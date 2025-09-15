---
layer: Practice
type: Index
title: TypeScript 配置规范
category: node-development-environment/typescript
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - TypeScript
  - 类型系统
  - 编译配置
  - ESModule

# 目录级 PSO
purpose: 实现 TypeScript 配置和类型管理的标准化，作为父级 PSO 中"核心开发环境"的类型安全保障
scope:
  includes:
    - TypeScript 编译配置（tsconfig 标准）
    - 严格模式配置（strict mode 选项）
    - ESModule 配置（module、moduleResolution）
    - 模块解析配置（paths、baseUrl）
    - 类型声明管理（@types、声明文件）
    - 编译优化策略（增量编译、项目引用）
  excludes:
    - 具体业务类型定义
    - 框架特定配置（React、Vue）
    - 运行时行为配置
    - 打包工具配置（webpack、vite）
outcome:
  - 类型安全的开发体验
  - 统一的 TypeScript 配置标准
  - 最佳的 IDE 支持
  - 编译性能优化
---

# TypeScript 配置规范

## 概述

TypeScript 为 JavaScript 添加了静态类型系统，是现代 Node.js 开发的标配。良好的 TypeScript 配置能够：
- 在编译时发现错误
- 提供卓越的 IDE 体验
- 改善代码可维护性
- 增强团队协作效率

## 核心原则

### 🛡️ 严格模式优先
始终启用 strict 模式，宁可在开始时严格，也不要在后期补救。

### 📦 ESModule 原生
优先使用 ESModule，这是 JavaScript 的未来。

### 🎯 渐进式采用
可以逐步迁移，但新代码必须是 TypeScript。

## 基础配置

### tsconfig.base.json

所有项目的基础配置：

```json
{
  "compilerOptions": {
    // 语言和环境
    "target": "ES2022",                    // 编译目标
    "lib": ["ES2022"],                     // 可用的库
    "module": "NodeNext",                   // 模块系统
    "moduleResolution": "NodeNext",        // 模块解析策略
    
    // 严格性检查
    "strict": true,                        // 启用所有严格检查
    "noUnusedLocals": true,               // 未使用的局部变量
    "noUnusedParameters": true,           // 未使用的参数
    "noImplicitReturns": true,            // 隐式返回
    "noFallthroughCasesInSwitch": true,   // switch 穿透
    "noUncheckedIndexedAccess": true,     // 索引访问检查
    "exactOptionalPropertyTypes": true,    // 精确可选属性
    
    // 模块互操作
    "esModuleInterop": true,              // ES 模块互操作
    "allowSyntheticDefaultImports": true,  // 合成默认导入
    "resolveJsonModule": true,            // 导入 JSON
    "forceConsistentCasingInFileNames": true, // 文件名大小写
    
    // 输出配置
    "declaration": true,                   // 生成声明文件
    "declarationMap": true,               // 生成声明映射
    "sourceMap": true,                    // 生成源映射
    "inlineSources": true,                // 内联源代码
    
    // 性能优化
    "incremental": true,                  // 增量编译
    "skipLibCheck": true,                 // 跳过库检查
    "isolatedModules": true,              // 独立模块
    
    // 路径配置
    "baseUrl": ".",                       // 基础路径
    "paths": {                            // 路径映射
      "@/*": ["src/*"],
      "@shared/*": ["../../packages/shared/src/*"]
    }
  },
  "exclude": [
    "node_modules",
    "dist",
    "build",
    "coverage",
    "**/*.spec.ts",
    "**/*.test.ts"
  ]
}
```

### 项目级 tsconfig.json

继承基础配置：

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../shared" }
  ]
}
```

## ESModule 配置

### package.json 设置

```json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc --build",
    "dev": "tsx watch src/index.ts"
  }
}
```

### 导入语句规范

```typescript
// ✅ 正确：使用完整扩展名
import { util } from './utils.js'
import type { Config } from './types.js'

// ❌ 错误：省略扩展名（在 NodeNext 中）
import { util } from './utils'

// ✅ 正确：导入 JSON
import config from './config.json' with { type: 'json' }

// ✅ 正确：类型导入
import type { User } from '@/types/user.js'
import { type Role, type Permission } from '@/types/auth.js'
```

## 严格模式详解

### 必须启用的选项

| 选项 | 作用 | 示例 |
|------|------|------|
| **strict** | 启用所有严格检查 | 总开关 |
| **strictNullChecks** | 空值检查 | 防止 `undefined` 错误 |
| **strictFunctionTypes** | 函数类型检查 | 逆变/协变正确性 |
| **strictBindCallApply** | bind/call/apply 检查 | 参数类型安全 |
| **noImplicitAny** | 禁止隐式 any | 必须显式声明类型 |
| **noImplicitThis** | 禁止隐式 this | this 类型必须明确 |

### 推荐启用的选项

```json
{
  "compilerOptions": {
    // 未使用代码检查
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    
    // 代码质量检查
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    
    // 一致性检查
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    
    // 精确性检查
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

## 类型管理

### 类型声明组织

```
types/
├── global.d.ts          # 全局类型声明
├── env.d.ts            # 环境变量类型
├── modules/            # 模块声明
│   └── untyped-lib.d.ts
└── index.ts            # 导出入口
```

### 环境变量类型

```typescript
// env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      PORT?: string
      DATABASE_URL: string
      API_KEY: string
    }
  }
}

export {}
```

### 模块声明

```typescript
// modules/untyped-lib.d.ts
declare module 'untyped-lib' {
  export function process(data: unknown): string
  export interface Options {
    timeout?: number
    retries?: number
  }
}
```

## 项目引用

### Monorepo 配置

根目录 tsconfig.json：

```json
{
  "files": [],
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/core" },
    { "path": "./apps/web" },
    { "path": "./services/api" }
  ]
}
```

子项目 tsconfig.json：

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "references": [
    { "path": "../../packages/shared" }
  ]
}
```

## 性能优化

### 增量编译

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```

### 编译缓存

```bash
# package.json
{
  "scripts": {
    "build": "tsc --build",
    "build:clean": "tsc --build --clean",
    "build:force": "tsc --build --force"
  }
}
```

### Watch 模式优化

```json
{
  "watchOptions": {
    "watchFile": "useFsEvents",
    "watchDirectory": "useFsEvents",
    "fallbackPolling": "dynamicPriority",
    "synchronousWatchDirectory": true,
    "excludeDirectories": ["**/node_modules", "dist"]
  }
}
```

## IDE 配置

### VSCode 设置

```json
// .vscode/settings.json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.preferences.importModuleSpecifierEnding": "js",
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

## 迁移策略

### 渐进式迁移

1. **启用 allowJs**
   ```json
   {
     "compilerOptions": {
       "allowJs": true,
       "checkJs": false
     }
   }
   ```

2. **逐步添加类型**
   - 从关键模块开始
   - 使用 JSDoc 注释
   - 逐步转换为 .ts

3. **启用 checkJs**
   ```json
   {
     "compilerOptions": {
       "checkJs": true
     }
   }
   ```

4. **完全迁移到 TypeScript**

## 常见问题

### Q: Cannot find module 错误
```typescript
// 解决方案 1：添加路径映射
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// 解决方案 2：使用完整路径
import { util } from './utils.js'
```

### Q: ESM 和 CommonJS 互操作
```typescript
// 导入 CommonJS 模块
import pkg from 'commonjs-package'
const { method } = pkg

// 或启用 esModuleInterop
import commonjsModule from 'commonjs-package'
```

### Q: 类型文件找不到
```bash
# 安装类型定义
pnpm add -D @types/node @types/express

# 或创建声明文件
echo "declare module 'untyped-module'" > types/modules.d.ts
```

## 最佳实践

### ✅ 应该做的

1. **使用 strict 模式** - 从项目开始就启用
2. **类型优先** - 先定义接口，再实现
3. **避免 any** - 使用 unknown 代替
4. **分离类型导入** - 使用 `import type`

### ❌ 不应该做的

1. **滥用 as** - 类型断言应该谨慎使用
2. **忽略错误** - 不要用 @ts-ignore
3. **全局类型污染** - 避免修改全局类型
4. **过度类型体操** - 保持类型简单可读

## 相关资源

### 内部文档
- [Node.js 开发环境规范](../index.md) - 父级规范
- [Node.js 环境配置](../nodejs/index.md) - 运行时配置
- [代码检查标准](../linting/index.md) - TypeScript 检查规则

### 外部资源
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) - 官方手册
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/) - 深入理解
- [Type Challenges](https://github.com/type-challenges/type-challenges) - 类型挑战

---

*记住：TypeScript 不是负担，而是投资。严格的类型系统换来的是长期的维护性和开发效率。*