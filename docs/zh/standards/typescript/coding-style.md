# 编码风格

本章定义 TypeScript 代码的组织和风格规范，确保代码的一致性和可读性。

## 声明与组织

### 1.1 类型声明文件

#### 1.1.1 优先自动生成
```json
// tsconfig.build.json
{
  "compilerOptions": {
    "declaration": true,           // 生成 .d.ts 文件
    "declarationMap": true,        // 生成 .d.ts.map 文件
    "declarationDir": "./dist/types",
    "emitDeclarationOnly": false   // 同时生成 JS 和声明文件
  }
}
```

**组织原则**：
- 库和组件：由 TypeScript 编译器自动生成
- 全局类型：手写并集中管理在 `types/` 目录
- 模块补充：手写类型与实现代码放在一起

#### 1.1.2 手写类型声明组织
```
src/
├── types/                 # 全局类型声明（集中）
│   ├── global.d.ts       # 全局类型扩展
│   ├── env.d.ts          # 环境变量类型
│   └── modules.d.ts      # 第三方模块声明
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── Button.types.ts  # 组件特定类型（就近）
└── utils/
    └── api/
        ├── client.ts
        └── client.types.ts  # 工具特定类型（就近）
```

#### 1.1.3 类型声明示例
**全局类型扩展** (`types/global.d.ts`):
```typescript
// 扩展 Window 对象
declare global {
  interface Window {
    __APP_VERSION__: string
    __API_BASE_URL__: string
    gtag?: (...args: any[]) => void
  }
}

// 扩展 NodeJS 全局
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    API_KEY: string
    DATABASE_URL: string
  }
}

export {}  // 确保文件被视为模块
```

**模块声明** (`types/modules.d.ts`):
```typescript
// 为无类型的模块声明类型
declare module 'legacy-package' {
  export function doSomething(input: string): void
  export class LegacyClass {
    constructor(options: any)
    method(): string
  }
}

// 资源文件类型声明
declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>
  export default content
}

declare module '*.css' {
  const classes: Record<string, string>
  export default classes
}
```

### 1.2 类型导出策略

#### 1.2.1 分层导出原则
```typescript
// ✅ 分层导出：内部类型不导出，公共类型统一导出

// internal-types.ts (内部类型，不导出)
interface InternalCache {
  data: Map<string, unknown>
  timestamp: number
}

type InternalState = {
  cache: InternalCache
  pending: boolean
}

// public-types.ts (公共类型，导出)
export interface User {
  id: string
  name: string
  email: string
}

export type UserRole = 'admin' | 'user' | 'guest'

export interface ApiResponse<T> {
  data: T
  status: number
  message: string
}
```

#### 1.2.2 统一导出出口
```typescript
// types/index.ts - 统一导出公共类型
export type { User, UserRole } from './user'
export type { Post, PostStatus } from './post'
export type { ApiResponse, ApiError } from './api'
export type { Config, Environment } from './config'

// 使用时从统一入口导入
import type { User, Post, ApiResponse } from '@/types'
```

#### 1.2.3 包的类型导出配置
```json
// package.json - 完整的类型导出配置（兼容性最好）
{
  "name": "@company/ui",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/types/index.d.ts",  // 兼容旧版本工具
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",  // Node.js 16+ 和现代打包工具
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./styles": "./dist/styles.css"
  },
  // TypeScript 模块解析提示
  "typesVersions": {
    "*": {
      "*": ["./dist/types/*"]
    }
  }
}
```

**配置要点**：
- `types` 字段：兼容旧版本 TypeScript 和工具
- `exports.types`：现代模块解析（优先级更高）
- `typesVersions`：支持子路径导出的类型
- **必须同时配置** types 和 exports 确保最大兼容性

#### 1.2.4 类型导入规范
```typescript
// ✅ 强制使用 import type 导入纯类型
import type { User, Post } from './models'
import type { ComponentProps } from 'react'

// ✅ 值和类型分开导入
import { useState } from 'react'
import type { FC, ReactNode } from 'react'

// ✅ 内联 type 修饰符（TypeScript 4.5+）
import { Component, type ComponentProps } from './component'

// ESLint 配置强制检查
// .eslintrc.js
{
  rules: {
    '@typescript-eslint/consistent-type-imports': ['error', {
      prefer: 'type-imports',
      fixStyle: 'inline-type-imports'
    }]
  }
}
```

#### 1.2.5 类型版本兼容策略
```typescript
/**
 * 用户信息接口
 * @since 1.0.0
 */
export interface User {
  id: string
  name: string
  email: string
  /**
   * 用户头像
   * @since 1.2.0
   */
  avatar?: string
  /**
   * @deprecated 从 2.0.0 开始使用 `role` 替代
   * @since 1.0.0
   */
  userType?: string
  /**
   * 用户角色
   * @since 2.0.0
   */
  role?: 'admin' | 'user' | 'guest'
}

// 渐进式废弃示例
export interface ApiResponse<T> {
  data: T
  /**
   * @deprecated 使用 `statusCode` 替代，将在 3.0.0 移除
   */
  code?: number
  /**
   * HTTP 状态码
   * @since 2.5.0
   */
  statusCode: number
}

// 版本兼容的类型别名
/** @deprecated 使用 `User` 替代 */
export type UserInfo = User

// 语义化版本规则
// - 新增可选属性：补丁版本或次要版本
// - 新增必需属性：主要版本（破坏性变更）
// - 移除属性：主要版本（破坏性变更）
// - 修改属性类型：主要版本（破坏性变更）
```

#### 1.2.6 泛型类型导出
```typescript
// ✅ 通用工具类型：提供合理默认值
export type Nullable<T = unknown> = T | null
export type AsyncData<T = unknown, E = Error> = {
  loading: boolean
  data?: T
  error?: E
}

// ✅ 业务特定类型：不提供默认值，要求明确指定
export interface PagedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// ✅ 导出常用的预设类型
export type StringRecord = Record<string, string>
export type AnyFunction = (...args: any[]) => any
export type UserList = PagedResponse<User>

// ❌ 避免：过度的默认值
export interface BadGeneric<
  T = any,  // 不要默认 any
  K = string,
  V = unknown,
  R = void
> { }
```

### 1.3 命名空间使用

#### 1.3.1 不使用 namespace
```typescript
// ❌ 避免：使用 namespace
namespace Utils {
  export function formatDate(date: Date): string {
    return date.toISOString()
  }
  
  export class Logger {
    log(message: string): void {
      console.log(message)
    }
  }
}

// ✅ 推荐：使用 ES6 模块
// utils/date.ts
export function formatDate(date: Date): string {
  return date.toISOString()
}

// utils/logger.ts
export class Logger {
  log(message: string): void {
    console.log(message)
  }
}

// utils/index.ts
export { formatDate } from './date'
export { Logger } from './logger'
```

#### 1.3.2 组织相关类型（不用 namespace）
```typescript
// ❌ 避免：使用 namespace 组织类型
namespace UserTypes {
  export interface User { }
  export type Role = 'admin' | 'user'
  export interface Profile { }
}

// ✅ 推荐：使用模块或对象
// 方式 1：独立模块文件
// user-types.ts
export interface User { }
export type Role = 'admin' | 'user'
export interface Profile { }

// 方式 2：类型分组对象（适合相关常量）
export const UserConstants = {
  Roles: {
    Admin: 'admin',
    User: 'user',
    Guest: 'guest'
  } as const,
  
  Status: {
    Active: 'active',
    Inactive: 'inactive',
    Suspended: 'suspended'
  } as const
} as const

export type UserRole = typeof UserConstants.Roles[keyof typeof UserConstants.Roles]
export type UserStatus = typeof UserConstants.Status[keyof typeof UserConstants.Status]
```

## 异步代码规范

### 2.1 Promise 类型处理

#### 2.1.1 混合策略
```typescript
// ✅ 公共 API：显式标注 Promise 类型
export class UserService {
  // 明确返回类型
  public async getUser(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`)
    return response.json()
  }
  
  // 明确可能失败的情况
  public async findUser(id: string): Promise<User | null> {
    try {
      return await this.getUser(id)
    } catch {
      return null
    }
  }
  
  // 明确 void Promise
  public async deleteUser(id: string): Promise<void> {
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
  }
}

// ✅ 内部实现：可依赖推断
class InternalProcessor {
  private async processData(data: RawData) {
    // 内部方法可以依赖推断
    const processed = await this.transform(data)
    const validated = await this.validate(processed)
    return this.save(validated)
  }
  
  private async transform(data: RawData) {
    // 推断返回类型
    return { ...data, transformed: true }
  }
}
```

#### 2.1.2 Promise 工具类型
```typescript
// 定义通用的异步结果类型
export type AsyncResult<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E }

// 使用示例
export async function fetchUserSafe(
  id: string
): Promise<AsyncResult<User>> {
  try {
    const user = await fetchUser(id)
    return { success: true, data: user }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

// 类型安全的错误处理
const result = await fetchUserSafe('123')
if (result.success) {
  console.log(result.data)  // User 类型
} else {
  console.error(result.error)  // Error 类型
}
```

### 2.2 错误处理模式

#### 2.2.1 类型安全的错误处理
```typescript
// 定义错误类型
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

// 类型守卫
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}
```

#### 2.2.2 Try-Catch 包装器
```typescript
// 通用的 try-catch 包装器
export async function tryCatch<T, E = Error>(
  fn: () => Promise<T>,
  errorHandler?: (error: unknown) => E
): Promise<[T, null] | [null, E]> {
  try {
    const result = await fn()
    return [result, null]
  } catch (error) {
    const handledError = errorHandler ? errorHandler(error) : error as E
    return [null, handledError]
  }
}

// 使用示例
const [user, error] = await tryCatch(
  () => fetchUser(id),
  (err) => new ApiError('Failed to fetch user', 'USER_FETCH', 500)
)

if (error) {
  // 处理错误
  console.error(error)
  return
}

// 使用 user（类型安全，非 null）
console.log(user.name)
```

### 2.3 异步流程控制

#### 2.3.1 并发控制
```typescript
// 并发执行，等待所有结果
export async function fetchAllUsers(
  ids: string[]
): Promise<User[]> {
  const promises = ids.map(id => fetchUser(id))
  return Promise.all(promises)
}

// 并发执行，获取成功的结果
export async function fetchUsersSettled(
  ids: string[]
): Promise<User[]> {
  const results = await Promise.allSettled(
    ids.map(id => fetchUser(id))
  )
  
  return results
    .filter((result): result is PromiseFulfilledResult<User> => 
      result.status === 'fulfilled'
    )
    .map(result => result.value)
}

// 限制并发数量
export async function fetchWithConcurrencyLimit<T>(
  items: T[],
  handler: (item: T) => Promise<void>,
  limit: number = 5
): Promise<void> {
  const executing: Promise<void>[] = []
  
  for (const item of items) {
    const promise = handler(item).finally(() => {
      executing.splice(executing.indexOf(promise), 1)
    })
    
    executing.push(promise)
    
    if (executing.length >= limit) {
      await Promise.race(executing)
    }
  }
  
  await Promise.all(executing)
}
```

#### 2.3.2 超时控制
```typescript
// Promise 超时包装器
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    )
  ])
}

// 使用示例
const user = await withTimeout(
  fetchUser(id),
  5000,
  'User fetch timed out'
)
```

## 框架特定规范

### 3.1 React 组件类型

#### 3.1.1 函数组件定义
```typescript
// ✅ 推荐：普通函数声明 + Props 类型
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  children 
}: ButtonProps) {
  return (
    <button
      className={`btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// ✅ 带泛型的组件
interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor?: (item: T, index: number) => string
}

export function List<T>({ 
  items, 
  renderItem, 
  keyExtractor 
}: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor ? keyExtractor(item, index) : index}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  )
}
```

#### 3.1.2 为什么不用 React.FC
```typescript
// ❌ 避免：使用 React.FC
const Button: React.FC<ButtonProps> = ({ children }) => {
  return <button>{children}</button>
}

// React.FC 的问题：
// 1. 隐式包含 children，即使组件不需要
// 2. 不支持泛型组件
// 3. 默认返回类型不够精确
// 4. 性能略差（多一层函数调用）

// ✅ 更好的方式
function Button({ children }: ButtonProps) {
  return <button>{children}</button>
}
```

#### 3.1.3 Hook 类型定义
```typescript
// 自定义 Hook 的类型定义
export function useUser(id: string): {
  user: User | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
} {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchUser(id)
      setUser(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [id])
  
  useEffect(() => {
    refetch()
  }, [refetch])
  
  return { user, loading, error, refetch }
}

// 带泛型的 Hook
export function useAsync<T>(
  asyncFunction: () => Promise<T>
): {
  data: T | null
  loading: boolean
  error: Error | null
  execute: () => Promise<void>
} {
  // 实现...
}
```

### 3.2 Vue 组件类型（如适用）

#### 3.2.1 组合式 API 类型
```typescript
// Vue 3 组合式 API 类型定义
import { defineComponent, PropType, ref, computed } from 'vue'

interface User {
  id: string
  name: string
}

export default defineComponent({
  name: 'UserCard',
  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    },
    showDetails: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const isExpanded = ref(false)
    
    const displayName = computed(() => 
      props.user.name.toUpperCase()
    )
    
    function toggleExpanded() {
      isExpanded.value = !isExpanded.value
    }
    
    return {
      isExpanded,
      displayName,
      toggleExpanded
    }
  }
})
```

### 3.3 Node.js 特定类型

#### 3.3.1 Express 类型扩展
```typescript
// types/express.d.ts
import { User } from '@/models/user'

declare global {
  namespace Express {
    interface Request {
      user?: User
      session?: {
        userId: string
        role: string
      }
    }
    
    interface Response {
      sendSuccess<T>(data: T): void
      sendError(message: string, code?: number): void
    }
  }
}

export {}  // 确保文件是模块
```

## 常见问题

### 类型声明文件不生效？
1. 确保 `tsconfig.json` 包含了类型文件路径
2. 检查是否有 `export {}` 使文件成为模块
3. 重启 TypeScript 服务（VS Code: Cmd+Shift+P → Restart TS Server）

### 循环依赖问题？
```typescript
// 使用 import type 避免循环依赖
// a.ts
import type { B } from './b'
export interface A {
  b: B
}

// b.ts  
import type { A } from './a'
export interface B {
  a: A
}
```

### 第三方库没有类型？
```typescript
// 1. 先尝试安装 @types 包
npm install -D @types/package-name

// 2. 如果没有，创建自己的声明
// types/package-name.d.ts
declare module 'package-name' {
  export function someFunction(): void
  // 最小化类型定义，按需添加
}
```

## 最佳实践

### DO ✅
- 优先让 TypeScript 自动生成声明文件
- 公共 API 使用显式的 Promise 类型注解
- 使用普通函数定义 React 组件
- 错误处理使用类型守卫
- 分层导出类型（内部/公共分离）
- 强制使用 `import type` 导入纯类型
- package.json 同时配置 types 和 exports 字段
- 使用 JSDoc 注释标记版本和废弃信息
- 泛型工具类型提供合理默认值

### DON'T ❌
- 不要使用 namespace（用 ES6 模块）
- 避免 React.FC（用普通函数）
- 不要忽略异步错误处理
- 避免过度嵌套的 Promise
- 不要在全局作用域随意扩展类型
- 不要混合值和类型的导入（除非使用内联 type）
- 避免破坏性的类型变更（遵循语义化版本）
- 不要给泛型设置 any 作为默认值

## 下一步

掌握编码风格后，请参考：
- [高级特性](./patterns) - 学习高级类型特性
- [开发工具](./toolchain) - 配置开发环境