---
layer: Practice
type: Reference
title: TypeScript 类型管理规范
category: node-development-environment/typescript
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - TypeScript
  - 类型管理
  - 类型声明
  - @types

purpose: 规范 TypeScript 类型声明的组织、管理和维护标准，确保类型安全和开发体验
scope:
  includes:
    - 类型文件组织结构（types/ 目录规范）
    - @types 包的选择和版本管理
    - 自定义类型声明文件（.d.ts）编写
    - 全局类型扩展和模块声明
    - 类型导出和共享策略
    - 第三方库类型处理
    - 类型安全最佳实践
  excludes:
    - TypeScript 语法教学  # 属于教程
    - 具体业务类型定义  # 属于项目代码
    - 类型体操技巧  # 属于高级教程
outcome:
  - 能建立规范的类型文件结构
  - 能正确管理 @types 依赖
  - 能为无类型库创建声明
  - 能维护类型的一致性和准确性
---

# TypeScript 类型管理规范

## 核心理念：最小化手动管理

现代 TypeScript 项目中，**99% 的类型都是自动管理的**：
- 现代库自带类型定义
- TypeScript 自动生成 .d.ts
- 类型跟随代码，无需单独维护

我们只需要管理 **1% 的必要类型**。

## 类型管理原则

### 自动化优先

| 类型来源 | 管理方式 | 人工介入 |
|---------|---------|----------|
| **现代 npm 包** | 自带 types | ❌ 无需管理 |
| **业务代码类型** | 跟随实现 | ❌ 无需管理 |
| **编译产物类型** | tsc 自动生成 | ❌ 无需管理 |
| **环境变量** | 需要声明 | ✅ 手动定义 |
| **全局变量** | 需要声明 | ✅ 手动定义 |
| **遗留无类型库** | 需要声明 | ⚠️ 考虑替换 |

## 类型文件组织

### 最简类型目录结构

只在根目录维护**真正需要手动管理**的类型：

```text
monorepo/
├── types/                    # 仅包含必要的全局类型
│   ├── env.d.ts             # ✅ 环境变量类型（必要）
│   └── global.d.ts          # ⚠️ 全局变量（仅在需要时创建）
│
├── packages/
│   └── */src/               # 业务类型跟随代码
│       ├── user.service.ts  # interface User 定义在这里
│       └── product.model.ts # class Product 定义在这里
│
└── apps/
    └── */src/               # 应用类型跟随实现
        └── pages/           # 页面类型在页面文件中定义
```

### 什么时候需要 /types/ 目录？

| 场景 | 需要手动管理？ | 解决方案 |
|------|--------------|----------|
| **环境变量** | ✅ 是 | 创建 `/types/env.d.ts` |
| **构建工具全局变量** | ⚠️ 偶尔 | 仅在使用时创建 `/types/global.d.ts` |
| **无类型的 npm 包** | ❌ 否 | 换成有类型的替代品 |
| **业务接口类型** | ❌ 否 | 定义在使用的地方 |
| **共享类型** | ❌ 否 | 通过正常 import/export |

### 全局类型文件规范

全局 `/types/` 目录只存放真正全局共享的类型：

```typescript
// types/global.d.ts - 全局变量
declare global {
  var __APP_VERSION__: string
  var __BUILD_TIME__: string
  var __DEBUG__: boolean
  
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

export {}

// types/env.d.ts - 环境变量
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      PORT?: string
      DATABASE_URL: string
      REDIS_URL?: string
    }
  }
}

export {}

// types/modules/old-library.d.ts - 无类型第三方库
declare module 'old-library' {
  export function parse(input: string): any
  export function format(data: any): string
  export const version: string
}
```

### 配置全局类型

在根目录的 `tsconfig.base.json` 中：

```json
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./types"                    // 包含全局类型目录
    ],
    "types": [
      "node"                       // 明确包含的类型
    ]
  },
  "include": [
    "types/**/*"                   // 确保包含全局类型
  ]
}
```

## 现代库选择标准

### 优先选择自带类型的库

```json
// ✅ 好的库：package.json 自带 types
{
  "name": "modern-library",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"  // 自带类型！
}
```

| 判断标准 | 好的信号 | 坏的信号 |
|---------|---------|----------|
| **类型支持** | 自带 types/typings 字段 | 既无自带也无 @types |
| **维护状态** | 最近 6 个月有更新 | 超过 2 年未更新 |
| **技术栈** | TypeScript 编写 | 纯 JavaScript 旧项目 |
| **社区活跃** | Issues 有回复 | Issues 无人理 |

### 常见现代库（都自带类型）

```bash
# 框架类
pnpm add vue@3          # ✅ 自带类型
pnpm add vite           # ✅ 自带类型
pnpm add nuxt@3         # ✅ 自带类型

# 工具类  
pnpm add zod            # ✅ 自带类型
pnpm add dayjs          # ✅ 自帶类型
pnpm add nanoid         # ✅ 自帶类型

# 后端类
pnpm add prisma         # ✅ 自帶类型
pnpm add trpc           # ✅ 自帶类型
pnpm add fastify        # ✅ 自帶类型
```

### 需要 @types 的库（考虑替代）

```bash
# ❌ 需要 @types 的库（考虑替换）
pnpm add express        # 需要 @types/express
pnpm add lodash         # 需要 @types/lodash

# ✅ 替代方案
pnpm add fastify        # 替代 express，自带类型
pnpm add lodash-es      # 替代 lodash，更现代
pnpm add radash         # 替代 lodash，自带类型
```

### 处理遗留系统的策略

| 情况 | 建议 | 操作 |
|------|------|------|
| **内部遗留系统** | 逐步迁移 | 暂时写最简 .d.ts |
| **外部老库** | 寻找替代 | 找现代化的替代品 |
| **必须使用** | 最小化声明 | 只声明用到的部分 |

## 业务类型管理：跟随代码

### 类型和实现在一起

```typescript
// user.service.ts - ❌ 不要单独的类型文件
// ✅ 类型和实现在同一文件
export interface User {
  id: string
  name: string
  email: string
}

export class UserService {
  async getUser(id: string): Promise<User> {
    // 实现...
  }
}
```

### OOP 风格：类即类型

```typescript
// models/User.ts - 类本身就是类型
export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string
  ) {}
  
  get displayName() {
    return this.name.toUpperCase()
  }
}

// 使用时无需额外类型定义
const user = new User('1', 'Sean', 'sean@example.com')
```

## 必要的全局类型管理

### 只管理这些全局类型

### 1. 环境变量（必须）

```typescript
// types/env.d.ts - 每个项目都需要
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      DATABASE_URL: string
      REDIS_URL?: string
    }
  }
}

// Vite 项目
interface ImportMetaEnv {
  VITE_API_URL: string
  VITE_PUBLIC_PATH: string
}

export {}
```

### 2. 构建工具全局变量（可选）

```typescript
// types/global.d.ts - 仅在使用时创建
declare global {
  const __BUILD_TIME__: string
  const __COMMIT_HASH__: string
  const __VERSION__: string
}

export {}
```

### 3. 遗留无类型库（应该避免）

```typescript
// types/modules/old-lib.d.ts - 最后才考虑
declare module 'company-legacy-sdk' {
  // 只声明用到的部分
  export function init(apiKey: string): void
  export function track(event: string, data?: any): void
}
```

## TypeScript 编译配置

### 自动生成类型文件

```json
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true,         // ✅ 自动生成 .d.ts
    "declarationMap": true,      // ✅ 生成 sourcemap
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

编译后自动生成：
```text
src/
  user.service.ts
↓ tsc

dist/
  user.service.js      # 运行时代码
  user.service.d.ts    # 类型定义（自动生成）
  user.service.d.ts.map
```

### 全局类型配置

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "typeRoots": [
      "./node_modules/@types",
      "./types"                // 包含全局类型
    ]
  },
  "include": [
    "types/**/*"               // 确保包含
  ]
}
```

## 跨包类型共享

### 通过正常 import/export

```typescript
// packages/shared/src/models/User.ts
export class User {
  constructor(
    public id: string,
    public name: string
  ) {}
}

// apps/web/src/pages/profile.tsx
import { User } from '@shared/models'  // 正常导入

// 配置路径映射
package.json:
{
  "imports": {
    "@shared/*": "../shared/src/*"
  }
}
```


## 类型安全最佳实践

### 优先使用类型推断

```typescript
// ✅ 好：让 TypeScript 自动推断
const user = {
  id: '1',
  name: 'Sean'
}  // 类型自动推断

// ❌ 不必要：过度标注
const user: { id: string; name: string } = {
  id: '1',
  name: 'Sean'
}
```

### 避免 any

```typescript
// ❌ 避免 any
function process(data: any) { }

// ✅ 使用 unknown
function process(data: unknown) {
  if (typeof data === 'string') {
    return data.toUpperCase()
  }
}

// ✅ 使用泛型
function process<T>(data: T): T {
  return data
}
```

### 使用 Zod 进行运行时验证

```typescript
// 对外部数据使用 zod 验证
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email()
})

// 类型自动生成
type User = z.infer<typeof UserSchema>

// API 响应验证
const response = await fetch('/api/user')
const data = await response.json()
const user = UserSchema.parse(data)  // 类型安全
```

## 常用 TypeScript 工具

### 内置工具类型（已经很够用）

```typescript
// 最常用的几个
type PartialUser = Partial<User>       // 全部可选
type RequiredUser = Required<User>     // 全部必填  
type UserName = Pick<User, 'name'>     // 选取属性
type UserNoId = Omit<User, 'id'>       // 排除属性

// 返回值类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any
type PromiseType<T> = T extends Promise<infer U> ? U : T
```

### 不要过度使用类型体操

```typescript
// ❌ 过度复杂，难以维护
type DeepPartialWithConditionalOmit<T, K extends keyof any> = {
  [P in keyof T as P extends K ? never : P]?: 
    T[P] extends (infer U)[] ? DeepPartialWithConditionalOmit<U, K>[] :
    T[P] extends object ? DeepPartialWithConditionalOmit<T[P], K> :
    T[P]
}

// ✅ 保持简单
type UpdateData = Partial<User>
```

## 实际开发流程

### 1. 项目初始化

```bash
# 创建项目
pnpm create vite@latest my-app --template react-ts

# 只需要创建一个文件
touch types/env.d.ts
```

```typescript
// types/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
}
```

### 2. 写业务代码

```typescript
// src/services/user.service.ts
// 类型和实现在一起
export interface User {
  id: string
  name: string
}

export async function getUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}
```

### 3. 构建发布

```bash
# 构建（自动生成 .d.ts）
pnpm build

# dist/ 目录下自动有
# - index.js
# - index.d.ts
```

## 最佳实践总结

### ✅ 现代 TypeScript 开发

1. **选择自带类型的库** - 避免 @types 依赖
2. **类型跟随代码** - 不要单独的类型文件
3. **利用类型推断** - 让 TypeScript 做它擅长的
4. **最小化手动管理** - 只管 env.d.ts
5. **使用 Zod 验证外部数据** - 运行时类型安全

### ❌ 避免的做法

1. **使用无类型的老库** - 找现代替代品
2. **过度类型体操** - 保持代码可读性
3. **全局类型污染** - 不要修改原生对象
4. **单独的类型目录** - 除非真正全局
5. **使用 any** - 用 unknown 代替

## 相关资源

### 内部文档

- [TypeScript 配置规范](./index.md) - TypeScript 总览
- [TypeScript 编译配置标准](./tsconfig-standard.md) - tsconfig 详解

### 推荐的现代库

- [Zod](https://zod.dev) - 运行时类型验证
- [Vite](https://vitejs.dev) - 现代构建工具（自带类型）
- [Vitest](https://vitest.dev) - 测试框架（自带类型）
- [Radash](https://radash-docs.vercel.app) - lodash 现代替代（自带类型）

---

*记住：现代 TypeScript 开发中，99% 的类型都是自动管理的，我们只需要关注那 1% 真正需要手动管理的全局类型。*
