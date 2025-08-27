# 高级特性

本章介绍 TypeScript 高级类型特性的使用方法和注意事项。

## 高级类型特性

### 1.1 工具类型使用

#### 1.1.1 充分利用内置工具类型
```typescript
// ✅ 使用内置工具类型而不是自己实现

// Partial - 将所有属性变为可选
interface User {
  id: string
  name: string
  email: string
  age: number
}

type UpdateUser = Partial<User>  // 所有字段可选，用于更新

// Pick - 选择部分属性
type UserPreview = Pick<User, 'id' | 'name'>  // 只包含 id 和 name

// Omit - 排除部分属性  
type UserWithoutEmail = Omit<User, 'email'>  // 排除 email 字段

// Required - 将所有属性变为必需
type CompleteUser = Required<Partial<User>>  // 所有字段必需

// Readonly - 将所有属性变为只读
type ImmutableUser = Readonly<User>  // 所有字段只读

// Record - 构造对象类型
type UserMap = Record<string, User>  // { [key: string]: User }
type Roles = Record<'admin' | 'user' | 'guest', string[]>

// Extract - 提取联合类型中的特定类型
type Status = 'idle' | 'loading' | 'success' | 'error'
type FinishedStatus = Extract<Status, 'success' | 'error'>  // 'success' | 'error'

// Exclude - 排除联合类型中的特定类型
type PendingStatus = Exclude<Status, FinishedStatus>  // 'idle' | 'loading'

// ReturnType - 获取函数返回类型
function getUser() {
  return { id: '1', name: 'John' }
}
type UserType = ReturnType<typeof getUser>

// Parameters - 获取函数参数类型
function createUser(name: string, age: number) { }
type CreateUserParams = Parameters<typeof createUser>  // [string, number]

// Awaited - 获取 Promise 解析后的类型 (TS 4.5+)
type PromiseUser = Promise<User>
type ResolvedUser = Awaited<PromiseUser>  // User
```

#### 1.1.2 组合使用工具类型
```typescript
// 组合多个工具类型创建复杂类型
interface Article {
  id: string
  title: string
  content: string
  author: User
  tags: string[]
  publishedAt: Date
  updatedAt: Date
  viewCount: number
  draft: boolean
}

// 创建文章的输入类型（排除自动生成的字段）
type CreateArticleInput = Omit<Article, 
  'id' | 'publishedAt' | 'updatedAt' | 'viewCount'
>

// 更新文章的输入类型（所有字段可选，除了 id）
type UpdateArticleInput = Partial<
  Omit<Article, 'id' | 'publishedAt'>
> & { id: string }

// 文章预览类型
type ArticlePreview = Pick<Article, 
  'id' | 'title' | 'author' | 'publishedAt' | 'tags'
> & {
  contentPreview: string  // 添加额外字段
}

// 只读的已发布文章
type PublishedArticle = Readonly<
  Omit<Article, 'draft'>
> & { draft: false }
```

#### 1.1.3 自定义工具类型
```typescript
// 当内置工具类型不满足需求时，创建自定义工具类型

// DeepPartial - 深度可选
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object 
    ? DeepPartial<T[P]> 
    : T[P]
}

// DeepReadonly - 深度只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}

// Nullable - 添加 null 类型
type Nullable<T> = T | null

// NonNullableKeys - 获取非空属性的键
type NonNullableKeys<T> = {
  [K in keyof T]: T[K] extends null | undefined ? never : K
}[keyof T]

// Mutable - 移除 readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

// PickByType - 根据值类型选择属性
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P]
}

// 使用示例
interface Config {
  apiUrl: string
  timeout: number
  retryCount: number
  enableCache: boolean
  enableLog: boolean
}

type NumberConfig = PickByType<Config, number>
// { timeout: number; retryCount: number }

type BooleanConfig = PickByType<Config, boolean>
// { enableCache: boolean; enableLog: boolean }
```

### 1.2 条件类型封装

#### 1.2.1 封装复杂条件类型
```typescript
// ✅ 将复杂的条件类型封装为可复用的工具类型

// IsArray - 判断是否为数组
type IsArray<T> = T extends any[] ? true : false

// ArrayElement - 获取数组元素类型
type ArrayElement<T> = T extends (infer E)[] ? E : never

// UnwrapPromise - 解包 Promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

// FunctionArgs - 获取函数参数
type FunctionArgs<T> = T extends (...args: infer A) => any ? A : never

// Flatten - 扁平化类型
type Flatten<T> = T extends any[] 
  ? T[number] 
  : T extends object 
    ? T[keyof T]
    : T

// 使用示例
type IsUserArray = IsArray<User[]>  // true
type IsUser = IsArray<User>  // false

type UserElement = ArrayElement<User[]>  // User
type PromiseContent = UnwrapPromise<Promise<User>>  // User
type NormalContent = UnwrapPromise<User>  // User

function fetchUsers(...ids: string[]): Promise<User[]> { }
type FetchUsersArgs = FunctionArgs<typeof fetchUsers>  // [string[]]
```

#### 1.2.2 条件类型与映射类型结合
```typescript
// 根据条件修改对象类型

// 将可选属性变为必需
type RequiredByKeys<T, K extends keyof T> = 
  Omit<T, K> & Required<Pick<T, K>>

// 将特定属性变为可选
type OptionalByKeys<T, K extends keyof T> = 
  Omit<T, K> & Partial<Pick<T, K>>

// 根据条件修改属性类型
type NullableProperties<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? T[P] | null : T[P]
}

// 过滤出特定类型的属性
type FunctionProperties<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K]
}

// 使用示例
interface Product {
  id: string
  name: string
  price?: number
  description?: string
  calculate: (tax: number) => number
  format: () => string
}

// 将 price 变为必需
type ProductWithPrice = RequiredByKeys<Product, 'price'>

// 将 id 和 name 变为可选
type FlexibleProduct = OptionalByKeys<Product, 'id' | 'name'>

// 将 price 和 description 变为可 null
type NullableProduct = NullableProperties<Product, 'price' | 'description'>

// 只保留函数属性
type ProductMethods = FunctionProperties<Product>
// { calculate: (tax: number) => number; format: () => string }
```

#### 1.2.3 递归条件类型
```typescript
// TypeScript 4.1+ 支持递归条件类型

// DeepReplace - 深度替换类型
type DeepReplace<T, From, To> = T extends From
  ? To
  : T extends object
    ? { [K in keyof T]: DeepReplace<T[K], From, To> }
    : T

// Paths - 获取对象所有路径
type Paths<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${Paths<T[K]>}`
          : K
        : never
    }[keyof T]
  : never

// 使用示例
interface NestedConfig {
  api: {
    url: string
    timeout: number | null
    retry: {
      count: number | null
      delay: number | null
    }
  }
  features: {
    enableCache: boolean | null
  }
}

// 将所有 null 替换为 undefined
type ConfigWithUndefined = DeepReplace<NestedConfig, null, undefined>

// 获取所有路径
type ConfigPaths = Paths<NestedConfig>
// "api" | "api.url" | "api.timeout" | "api.retry" | "api.retry.count" | "api.retry.delay" | "features" | "features.enableCache"
```

### 1.3 类型守卫实现

#### 1.3.1 综合使用各种守卫方式
```typescript
// ✅ 根据场景选择合适的类型守卫方式

// 1. 类型谓词（Type Predicates）- 适合复杂判断
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value
  )
}

// 2. in 操作符 - 适合鸭子类型
interface Bird {
  fly(): void
  layEggs(): void
}

interface Fish {
  swim(): void
  layEggs(): void
}

function isBird(pet: Bird | Fish): pet is Bird {
  return 'fly' in pet
}

// 3. instanceof - 适合类实例
class HttpError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message)
  }
}

function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError
}

// 4. typeof - 适合基础类型
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

// 5. 自定义属性检查
interface Tagged {
  _tag: string
}

interface SuccessResponse extends Tagged {
  _tag: 'success'
  data: unknown
}

interface ErrorResponse extends Tagged {
  _tag: 'error'
  message: string
}

type Response = SuccessResponse | ErrorResponse

function isSuccess(response: Response): response is SuccessResponse {
  return response._tag === 'success'
}
```

#### 1.3.2 组合类型守卫
```typescript
// 创建可组合的类型守卫工具

// 基础守卫
const Guards = {
  isString: (value: unknown): value is string => 
    typeof value === 'string',
  
  isNumber: (value: unknown): value is number => 
    typeof value === 'number' && !isNaN(value),
  
  isObject: (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value),
  
  isArray: <T>(
    value: unknown,
    itemGuard?: (item: unknown) => item is T
  ): value is T[] => {
    if (!Array.isArray(value)) return false
    if (!itemGuard) return true
    return value.every(itemGuard)
  },
  
  hasProperty: <K extends string>(
    value: unknown,
    key: K
  ): value is Record<K, unknown> => {
    return Guards.isObject(value) && key in value
  }
}

// 组合守卫
function isUserArray(value: unknown): value is User[] {
  return Guards.isArray(value, isUser)
}

function isStringArray(value: unknown): value is string[] {
  return Guards.isArray(value, Guards.isString)
}

// 高级组合
function createGuard<T>(
  checks: Array<(value: unknown) => boolean>
): (value: unknown) => value is T {
  return (value: unknown): value is T => {
    return checks.every(check => check(value))
  }
}

// 使用示例
const isValidUser = createGuard<User>([
  (v) => Guards.hasProperty(v, 'id'),
  (v) => Guards.hasProperty(v, 'name'),
  (v) => Guards.hasProperty(v, 'email'),
  (v) => Guards.isString((v as any).id),
  (v) => Guards.isString((v as any).name),
  (v) => Guards.isString((v as any).email)
])
```

#### 1.3.3 断言函数（Assertion Functions）
```typescript
// TypeScript 3.7+ 支持断言函数

// 断言函数 - 如果不满足条件则抛出错误
function assertIsUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new Error('Value is not a User')
  }
}

function assertIsNotNull<T>(
  value: T | null,
  message = 'Value is null'
): asserts value is T {
  if (value === null) {
    throw new Error(message)
  }
}

function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`)
}

// 使用示例
function processUser(value: unknown) {
  assertIsUser(value)
  // 之后 value 的类型是 User
  console.log(value.name)
  console.log(value.email)
}

function handleStatus(status: Status) {
  switch (status) {
    case 'idle':
      return 'Waiting'
    case 'loading':
      return 'Processing'
    case 'success':
      return 'Complete'
    case 'error':
      return 'Failed'
    default:
      assertNever(status)  // 确保处理了所有情况
  }
}
```

## 实验性特性

### 2.1 装饰器使用

#### 2.1.1 等待 Stage 3 稳定
```typescript
// ⚠️ 装饰器目前仍是实验性特性，等待 Stage 3 稳定后使用

// 当前状态（实验性）
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,  // 旧版装饰器
    "emitDecoratorMetadata": true
  }
}

// 未来 Stage 3 装饰器示例（语法可能变化）
// 类装饰器
function Component(target: any) {
  // 装饰器逻辑
}

// 方法装饰器
function Log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${key} with args:`, args)
    return original.apply(this, args)
  }
}

// 属性装饰器
function Required(target: any, key: string) {
  // 验证逻辑
}
```

#### 2.1.2 框架特定的装饰器使用
```typescript
// 某些框架（如 Angular、NestJS）强制要求装饰器

// NestJS 示例（框架要求时可以使用）
import { Controller, Get, Post, Body } from '@nestjs/common'

@Controller('users')
export class UserController {
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll()
  }
  
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto)
  }
}

// Angular 示例
import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-user',
  template: '<div>{{user.name}}</div>'
})
export class UserComponent {
  @Input() user: User
  @Output() userClick = new EventEmitter<User>()
}
```

#### 2.1.3 替代方案
```typescript
// 在装饰器稳定前，使用替代方案

// 1. 高阶函数替代类装饰器
function withLogging<T extends { new(...args: any[]): {} }>(Base: T) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args)
      console.log('Instance created:', this)
    }
  }
}

class User {
  constructor(public name: string) {}
}

const LoggedUser = withLogging(User)
const user = new LoggedUser('John')

// 2. 属性包装器替代属性装饰器
class Model {
  private _id: string = ''
  
  get id(): string {
    console.log('Getting id:', this._id)
    return this._id
  }
  
  set id(value: string) {
    console.log('Setting id:', value)
    this._id = value
  }
}

// 3. 工厂函数替代方法装饰器
function createLoggingMethod<T extends (...args: any[]) => any>(
  method: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    console.log(`Calling ${name} with args:`, args)
    const result = method(...args)
    console.log(`${name} returned:`, result)
    return result
  }) as T
}

class Service {
  process = createLoggingMethod(
    (data: string) => {
      return data.toUpperCase()
    },
    'process'
  )
}
```

### 2.2 其他实验性特性

#### 2.2.1 模板字面量类型的高级用法
```typescript
// TypeScript 4.1+ 的模板字面量类型

// 路由路径类型
type Route = '/users' | '/posts' | '/comments'
type ApiRoute = `api${Route}`  // 'api/users' | 'api/posts' | 'api/comments'

// CSS 单位类型
type CSSUnit = 'px' | 'em' | 'rem' | '%'
type CSSValue = `${number}${CSSUnit}`

// 事件名类型
type EventName = 'click' | 'focus' | 'blur'
type EventHandler = `on${Capitalize<EventName>}`  // 'onClick' | 'onFocus' | 'onBlur'

// 实用示例：创建 BEM 类名
type BEMBlock = 'button' | 'card' | 'modal'
type BEMElement = 'header' | 'body' | 'footer'
type BEMModifier = 'active' | 'disabled' | 'large'

type BEMClassName = 
  | BEMBlock
  | `${BEMBlock}__${BEMElement}`
  | `${BEMBlock}--${BEMModifier}`
  | `${BEMBlock}__${BEMElement}--${BEMModifier}`

const className: BEMClassName = 'button__header--active'  // 类型安全
```

#### 2.2.2 Satisfies 操作符（TypeScript 4.9+）
```typescript
// satisfies 操作符：验证类型但保留推断

// 不使用 satisfies（类型被扩宽）
const config1: Record<string, string | number> = {
  api: 'https://api.example.com',
  timeout: 5000
}
// config1.api 的类型是 string | number（不够精确）

// 使用 satisfies（保留精确类型）
const config2 = {
  api: 'https://api.example.com',
  timeout: 5000
} satisfies Record<string, string | number>
// config2.api 的类型是 string（精确）
// config2.timeout 的类型是 number（精确）

// 实用示例：配置对象
type Theme = {
  colors: Record<string, string>
  fonts: Record<string, string>
}

const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    danger: '#dc3545'
  },
  fonts: {
    body: 'system-ui',
    heading: 'Georgia'
  }
} satisfies Theme

// 保留了精确的字面量类型
type PrimaryColor = typeof theme.colors.primary  // '#007bff'
```

## 常见问题

### 工具类型性能问题？
```typescript
// 避免过度嵌套的工具类型
// ❌ 性能差
type DeepComplex<T> = {
  [K in keyof T]: T[K] extends object 
    ? DeepComplex<Partial<Required<Readonly<T[K]>>>>
    : T[K]
}

// ✅ 拆分为多个简单类型
type Step1<T> = Readonly<T>
type Step2<T> = Required<T>
type Step3<T> = Partial<T>
```

### 条件类型不工作？
```typescript
// 使用 distributive conditional types
type ToArray<T> = T extends any ? T[] : never
type Result = ToArray<string | number>  // string[] | number[]

// 避免 distribution
type ToArray2<T> = [T] extends [any] ? T[] : never
type Result2 = ToArray2<string | number>  // (string | number)[]
```

### 类型守卫失效？
```typescript
// 确保守卫函数返回类型谓词
// ❌ 错误
function isUser(value: unknown) {
  return value && typeof value === 'object' && 'id' in value
}

// ✅ 正确
function isUser(value: unknown): value is User {
  return value && typeof value === 'object' && 'id' in value
}
```

## 最佳实践

### DO ✅
- 充分利用 TypeScript 内置工具类型
- 封装复杂的条件类型为可复用的工具
- 综合使用各种类型守卫方式
- 等待装饰器 Stage 3 稳定后再使用
- 使用 satisfies 保留精确类型推断

### DON'T ❌
- 不要重复实现内置工具类型的功能
- 避免过度嵌套的条件类型（影响性能）
- 不要在生产代码中使用实验性特性
- 避免过度使用模板字面量类型
- 不要忽略类型守卫的返回类型声明

## 下一步

掌握高级特性后，请参考：
- [开发工具](./toolchain) - 配置开发环境
- [配置规范](./config) - 回顾项目配置