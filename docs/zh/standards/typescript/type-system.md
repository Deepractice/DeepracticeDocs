# 类型系统

本章定义 TypeScript 类型系统的使用规范，确保类型安全和代码可维护性。

## 类型定义规范

### 1.1 Interface vs Type

#### 1.1.1 使用原则
**优先使用 interface 定义对象类型**：
```typescript
// ✅ 推荐：对象类型用 interface
interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

// ✅ 推荐：可扩展的 API
interface Config {
  apiUrl: string
  timeout: number
}

interface DevConfig extends Config {
  debug: boolean
}
```

**使用 type 定义其他类型**：
```typescript
// ✅ 联合类型
type Status = 'pending' | 'approved' | 'rejected'

// ✅ 交叉类型
type WithTimestamp = {
  createdAt: Date
  updatedAt: Date
}
type UserWithTimestamp = User & WithTimestamp

// ✅ 工具类型
type Nullable<T> = T | null
type AsyncData<T> = {
  loading: boolean
  data?: T
  error?: Error
}

// ✅ 元组类型
type Coordinate = [number, number]

// ✅ 函数类型别名
type Comparator<T> = (a: T, b: T) => number
```

#### 1.1.2 命名规范
```typescript
// Interface：使用 PascalCase，不加前缀
interface UserProfile { }
interface ApiResponse { }

// Type：使用 PascalCase
type ButtonSize = 'small' | 'medium' | 'large'
type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

// 泛型类型：描述性命名
type ResponseData<TData> = {
  code: number
  data: TData
  message: string
}

// ❌ 避免：I 前缀、下划线
interface IUser { }  // 不要加 I 前缀
type button_size = string  // 不要用 snake_case
```

### 1.2 函数类型定义

#### 1.2.1 简单函数用 type
```typescript
// ✅ 简单函数类型
type ClickHandler = (event: MouseEvent) => void
type Formatter<T> = (value: T) => string
type Predicate<T> = (item: T) => boolean

// 使用示例
const handleClick: ClickHandler = (e) => {
  console.log(e.clientX, e.clientY)
}

const formatCurrency: Formatter<number> = (value) => {
  return `$${value.toFixed(2)}`
}
```

#### 1.2.2 复杂函数用 interface
```typescript
// ✅ 需要重载的函数
interface CreateElement {
  (tag: 'div'): HTMLDivElement
  (tag: 'span'): HTMLSpanElement
  (tag: 'input'): HTMLInputElement
  (tag: string): HTMLElement
}

// ✅ 带属性的函数
interface Logger {
  (message: string): void
  level: 'debug' | 'info' | 'warn' | 'error'
  setLevel(level: string): void
}

const logger: Logger = (message) => {
  console.log(`[${logger.level}] ${message}`)
}
logger.level = 'info'
logger.setLevel = (level) => {
  logger.level = level as any
}
```

### 1.3 泛型命名规范

#### 1.3.1 混合使用策略
```typescript
// ✅ 简单场景：单字母
function identity<T>(value: T): T {
  return value
}

function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  // 实现
}

// ✅ 复杂场景：描述性命名
interface ApiResponse<TData, TError = Error> {
  data?: TData
  error?: TError
  loading: boolean
}

type AsyncAction<TPayload, TResult> = {
  type: string
  payload: TPayload
  execute(): Promise<TResult>
}

// ✅ 约束明确的泛型
type EntityMap<TEntity extends { id: string }> = {
  byId: Record<string, TEntity>
  allIds: string[]
}
```

#### 1.3.2 常用泛型参数命名
```typescript
// 标准单字母（简单场景）
T    // Type
K    // Key  
V    // Value
E    // Element or Error
N    // Number
S    // String

// 描述性命名（复杂场景）
TData      // 数据类型
TError     // 错误类型
TResult    // 结果类型
TPayload   // 载荷类型
TResponse  // 响应类型
TRequest   // 请求类型
TEntity    // 实体类型
TState     // 状态类型
TProps     // 属性类型
```

## 类型使用规范

### 2.1 类型导入

#### 2.1.1 强制使用 import type
```typescript
// ✅ 正确：纯类型导入使用 import type
import type { User, Post } from './models'
import type { ReactNode, FC } from 'react'
import type { AxiosRequestConfig } from 'axios'

// ✅ 正确：值和类型分开导入
import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

// ✅ 正确：使用 type 修饰符（TypeScript 4.5+）
import { Component, type ComponentProps } from './component'

// ❌ 错误：混合导入纯类型
import { User } from './models'  // 如果 User 只是类型
```

#### 2.1.2 配置强制检查
```json
// tsconfig.json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true  // TypeScript 5.0+，强制正确的导入语法
    // 或者使用旧版本选项
    "importsNotUsedAsValues": "error",
    "preserveValueImports": true
  }
}
```

```javascript
// .eslintrc.js
{
  rules: {
    '@typescript-eslint/consistent-type-imports': ['error', {
      prefer: 'type-imports',
      fixStyle: 'inline-type-imports'  // 自动修复为 inline 风格
    }]
  }
}
```

### 2.2 类型注解策略

#### 2.2.1 公共 API 必须注解
```typescript
// ✅ 导出的函数必须注解参数和返回值
export function calculateDiscount(
  price: number,
  discountRate: number
): number {
  return price * (1 - discountRate)
}

// ✅ 导出的类必须注解公共成员
export class UserService {
  private cache: Map<string, User> = new Map()
  
  public async getUser(id: string): Promise<User> {
    // 实现
  }
  
  public updateUser(id: string, data: Partial<User>): void {
    // 实现
  }
}

// ✅ 导出的常量需要明确类型
export const DEFAULT_CONFIG: Config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
}
```

#### 2.2.2 内部代码依赖推断
```typescript
// ✅ 内部变量可以依赖推断
function processData(input: string) {
  const lines = input.split('\n')  // 推断为 string[]
  const count = lines.length       // 推断为 number
  
  const results = lines.map(line => ({
    original: line,
    processed: line.trim().toLowerCase()
  }))  // 推断复杂类型
  
  return results
}

// ✅ 但复杂类型建议注解提高可读性
function complexProcess(data: InputData) {
  // 复杂类型建议注解
  const cache: Map<string, ProcessedData> = new Map()
  
  // 简单类型可以推断
  const startTime = Date.now()
  const isValid = validateData(data)
  
  return { cache, duration: Date.now() - startTime }
}
```

### 2.3 类型断言限制

#### 2.3.1 严格限制使用
```typescript
// ✅ 必要时使用，并添加注释说明
function processApiResponse(response: unknown): User {
  // 类型断言：API 响应已通过 schema 验证
  return response as User
}

// ✅ 使用类型守卫替代断言
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  )
}

function betterProcess(response: unknown): User {
  if (isUser(response)) {
    return response  // 无需断言
  }
  throw new Error('Invalid user data')
}

// ❌ 避免：双重断言
const value = someValue as unknown as TargetType  // 危险！

// ❌ 避免：无说明的断言
const user = data as User  // 为什么可以断言？
```

#### 2.3.2 断言的合理场景
```typescript
// ✅ DOM 元素断言（确定元素类型时）
const canvas = document.getElementById('myCanvas') as HTMLCanvasElement
const context = canvas.getContext('2d')!  // 非空断言，确定存在

// ✅ 第三方库集成
// Zod schema 验证后的断言
const userSchema = z.object({
  id: z.string(),
  name: z.string()
})

const validatedUser = userSchema.parse(data) as User  // 经过验证，安全

// ✅ 测试代码中的断言
describe('UserService', () => {
  it('should return user', () => {
    const mockUser = { id: '1', name: 'Test' } as User
    // 测试中可以更宽松
  })
})
```

## 特殊类型处理

### 3.1 Any 类型限制

#### 3.1.1 严格限制规则
```typescript
// ✅ 必须通过 ESLint 注释说明原因
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- 第三方库未提供类型
const legacyLibrary: any = window.legacyGlobal

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- 动态插件系统
type Plugin = {
  name: string
  execute: (context: any) => void  // 插件上下文类型未知
}

// ✅ 优先使用 unknown
function processData(input: unknown): string {
  if (typeof input === 'string') {
    return input
  }
  if (typeof input === 'number') {
    return String(input)
  }
  throw new Error('Invalid input type')
}
```

#### 3.1.2 配置 ESLint 规则
```javascript
// .eslintrc.js
{
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-return': 'error'
  }
}
```

### 3.2 空值处理

#### 3.2.1 明确区分 null 和 undefined
```typescript
// ✅ undefined：未初始化或不存在
interface User {
  id: string
  name: string
  email?: string         // 可选，可能 undefined
  avatar?: string        // 可选，可能 undefined
  deletedAt?: Date      // 可选，可能 undefined
}

// ✅ null：明确的空值
interface ApiResponse {
  data: User | null      // 明确表示可能为空
  error: Error | null    // 明确表示可能为空
}

// ✅ 实际使用示例
class UserRepository {
  private cache?: Map<string, User>  // 未初始化用 undefined
  
  async findById(id: string): Promise<User | null> {
    // 查询不到返回 null（明确的空值）
    const user = await db.query(id)
    return user || null
  }
  
  getCached(id: string): User | undefined {
    // 缓存中不存在返回 undefined
    return this.cache?.get(id)
  }
}
```

#### 3.2.2 空值检查最佳实践
```typescript
// ✅ 使用可选链和空值合并
function getUserEmail(user?: User): string {
  return user?.email ?? 'no-email@example.com'
}

// ✅ 类型守卫处理空值
function isNotNull<T>(value: T | null): value is T {
  return value !== null
}

function isNotNullish<T>(value: T | null | undefined): value is T {
  return value != null  // 同时检查 null 和 undefined
}

// 使用示例
const users = [user1, null, user2, undefined].filter(isNotNullish)
// users 类型为 User[]
```

### 3.3 枚举替代方案

#### 3.3.1 使用 const 对象 + as const
```typescript
// ✅ 推荐：const 对象模式
const Status = {
  Pending: 'pending',
  Approved: 'approved', 
  Rejected: 'rejected'
} as const

type Status = typeof Status[keyof typeof Status]
// type Status = 'pending' | 'approved' | 'rejected'

// 使用示例
function handleStatus(status: Status) {
  switch (status) {
    case Status.Pending:
      // 处理待定
      break
    case Status.Approved:
      // 处理通过
      break
    case Status.Rejected:
      // 处理拒绝
      break
  }
}

// ✅ 带有额外信息的常量
const HttpStatus = {
  OK: { code: 200, message: 'Success' },
  NotFound: { code: 404, message: 'Not Found' },
  ServerError: { code: 500, message: 'Internal Server Error' }
} as const

type HttpStatus = typeof HttpStatus[keyof typeof HttpStatus]
```

#### 3.3.2 为什么避免 enum
```typescript
// ❌ 避免使用 enum
enum Status {
  Pending,    // 0
  Approved,   // 1
  Rejected    // 2
}

// 问题 1：数字枚举的类型不安全
let status: Status = 100  // 不报错！

// 问题 2：生成额外的 JavaScript 代码
// 编译后：
var Status;
(function (Status) {
    Status[Status["Pending"] = 0] = "Pending";
    Status[Status["Approved"] = 1] = "Approved";
    Status[Status["Rejected"] = 2] = "Rejected";
})(Status || (Status = {}));

// 问题 3：字符串枚举虽然好一些，但仍有运行时开销
enum StringStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED'
}
```

## 常见问题

### 类型导入报错？
```typescript
// 解决方案 1：确保 tsconfig 配置正确
{
  "compilerOptions": {
    "verbatimModuleSyntax": true
  }
}

// 解决方案 2：分离值导入和类型导入
import { Component } from 'react'
import type { FC, PropsWithChildren } from 'react'
```

### 泛型约束太复杂？
```typescript
// 拆分复杂约束为多个简单类型
type BaseEntity = { id: string }
type Timestamped = { createdAt: Date; updatedAt: Date }
type SoftDeletable = { deletedAt?: Date }

// 组合使用
type Entity<T> = T & BaseEntity & Timestamped & Partial<SoftDeletable>
```

### any 迁移策略？
```typescript
// 渐进式迁移
// Step 1: any -> unknown
function oldFunction(data: any) { }
function newFunction(data: unknown) { }

// Step 2: 添加类型守卫
function isValidData(data: unknown): data is ValidType {
  // 验证逻辑
}

// Step 3: 使用具体类型
function finalFunction(data: ValidType) { }
```

## 最佳实践

### DO ✅
- 优先使用 interface 定义对象类型
- 强制使用 import type 导入纯类型
- 公共 API 必须有完整的类型注解
- 使用 const assertion 替代 enum
- 明确区分 null 和 undefined 的语义

### DON'T ❌
- 不要使用 any，除非有明确理由并注释说明
- 避免不必要的类型断言
- 不要使用 enum（const 对象更好）
- 避免过度使用类型注解（内部代码可依赖推断）
- 不要使用双重断言绕过类型检查

## 相关规范

- **本规范内**：
  - [编码风格](./coding-style) - 了解代码组织规范
  - [高级特性](./patterns) - 学习高级类型特性
  - [命名规范](./naming) - 类型相关的命名规则
- **跨规范引用**：
  - [Monorepo 工作区配置](../monorepo/workspace) - 多包项目的类型共享
  - [文档内容规范](../documentation/content) - 类型文档的编写规范

## 下一步

掌握类型系统后，请继续学习[编码风格](./coding-style)和[高级特性](./patterns)。