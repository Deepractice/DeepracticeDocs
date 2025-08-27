# 命名规范

本章定义 TypeScript 项目的命名规范，确保代码的一致性和可读性。

## 标识符命名

### 1.1 变量和函数命名

#### 1.1.1 基本规则
```typescript
// ✅ 普通变量和函数：camelCase
const userName = 'John'
const isActive = true
let currentIndex = 0

function calculateTotal(price: number, tax: number): number {
  return price + tax
}

const getUserById = (id: string) => {
  // 实现
}

// ✅ 常量：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3
const API_BASE_URL = 'https://api.example.com'
const DEFAULT_PAGE_SIZE = 20

// ✅ 对象常量：对象本身大写，属性用 PascalCase
const Status = {
  Active: 'active',
  Inactive: 'inactive',
  Pending: 'pending'
} as const

const HttpMethod = {
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
  Delete: 'DELETE'
} as const
```

#### 1.1.2 布尔变量命名
```typescript
// ✅ 使用 is/has/can/should/will 前缀
const isLoading = true
const hasPermission = user.role === 'admin'
const canEdit = hasPermission && !isLoading
const shouldUpdate = isDirty && isValid
const willDelete = confirmDialog.result === 'yes'

// ✅ 函数返回布尔值也使用相同规则
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function hasAccess(user: User, resource: Resource): boolean {
  return user.permissions.includes(resource.requiredPermission)
}

// ❌ 避免：模糊的布尔名称
const flag = true  // 不清晰
const active = true  // 应该是 isActive
const permission = false  // 应该是 hasPermission
```

#### 1.1.3 数组和集合命名
```typescript
// ✅ 使用复数形式
const users: User[] = []
const activeUserIds: string[] = []
const permissions = new Set<Permission>()
const userRoles = new Map<string, Role[]>()

// ✅ 或者使用 xxxList/xxxArray 后缀（当复数形式不明显时）
const childList: Node[] = []
const dataArray: number[] = []

// ❌ 避免：单数形式表示集合
const user: User[] = []  // 应该是 users
const child: Node[] = []  // 应该是 children 或 childList
```

### 1.2 类、接口和类型命名

#### 1.2.1 PascalCase 规则
```typescript
// ✅ 类：PascalCase，不加前缀
class UserService {
  // 实现
}

class HttpClient {
  // 实现
}

// ✅ 接口：PascalCase，不加 I 前缀
interface User {
  id: string
  name: string
  email: string
}

interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

// ✅ 类型别名：PascalCase，不加 T 前缀
type UserId = string
type UserRole = 'admin' | 'user' | 'guest'
type AsyncCallback<T> = (error: Error | null, data?: T) => void

// ❌ 避免：匈牙利命名法
interface IUser { }  // 不要加 I 前缀
type TResponse = { }  // 不要加 T 前缀
class CUserService { }  // 不要加 C 前缀
```

#### 1.2.2 泛型参数命名
```typescript
// ✅ 简单泛型：单字母
function identity<T>(value: T): T {
  return value
}

function map<T, U>(array: T[], fn: (item: T) => U): U[] {
  return array.map(fn)
}

// ✅ 复杂泛型：描述性命名
interface ApiResponse<TData, TError = Error> {
  data?: TData
  error?: TError
  loading: boolean
}

type EventHandler<TEvent extends Event = Event> = (event: TEvent) => void

class Repository<TEntity extends BaseEntity, TId = string> {
  // 实现
}

// ✅ 常用泛型参数命名约定
// T - Type（类型）
// K - Key（键）
// V - Value（值）
// E - Element（元素）或 Error（错误）
// TData - 数据类型
// TResult - 结果类型
// TResponse - 响应类型
// TRequest - 请求类型
```

### 1.3 私有成员命名

#### 1.3.1 类成员命名
```typescript
// ✅ 私有成员无特殊标记，依赖 private 关键字
class UserService {
  private cache: Map<string, User>
  private readonly config: Config
  
  public async getUser(id: string): Promise<User> {
    return this.fetchUser(id)
  }
  
  private async fetchUser(id: string): Promise<User> {
    // 实现
  }
}

// ✅ 使用 ES2022 私有字段（如果目标环境支持）
class ModernService {
  #cache: Map<string, any>
  #config: Config
  
  constructor(config: Config) {
    this.#config = config
    this.#cache = new Map()
  }
  
  private clearCache(): void {
    this.#cache.clear()
  }
}

// ❌ 避免：下划线前缀（过时的做法）
class OldService {
  private _cache: Map<string, any>  // 不推荐
  private _fetchData(): void { }    // 不推荐
}
```

## 文件和目录命名

### 2.1 文件命名规则

#### 2.1.1 根据内容决定命名风格
```bash
# ✅ 单一结构（类/接口/类型/组件）：PascalCase
UserService.ts         # export class UserService
UserProfile.ts         # export interface UserProfile
ApiResponse.ts         # export type ApiResponse
Button.tsx             # export function Button() - React 组件
UserCard.vue           # export default defineComponent() - Vue 组件

# ✅ 工具集合（多个函数/常量）：kebab-case
string-utils.ts        # 多个字符串工具函数
date-helpers.ts        # 多个日期辅助函数
api-endpoints.ts       # API 端点常量集合
validation-rules.ts    # 验证规则集合
http-client.ts         # HTTP 客户端工具

# ✅ 特殊文件：固定命名
index.ts               # 模块入口
index.test.ts          # 测试文件
index.spec.ts          # 规格测试
setupTests.ts          # 测试配置
```

#### 2.1.2 文件命名示例
```typescript
// UserService.ts - 单一类导出
export class UserService {
  // 类实现
}

// UserProfile.ts - 单一接口导出
export interface UserProfile {
  id: string
  name: string
  // ...
}

// string-utils.ts - 多个工具函数
export function capitalize(str: string): string { }
export function truncate(str: string, length: number): string { }
export function slugify(str: string): string { }

// constants.ts - 常量集合
export const API_VERSION = 'v1'
export const MAX_FILE_SIZE = 10 * 1024 * 1024
export const SUPPORTED_FORMATS = ['jpg', 'png', 'gif']
```

#### 2.1.3 测试文件命名
```bash
# ✅ 测试文件与源文件保持一致的命名风格
UserService.ts         # 源文件
UserService.test.ts    # 对应的测试文件

string-utils.ts        # 源文件
string-utils.test.ts   # 对应的测试文件

# ✅ 或者放在 __tests__ 目录
src/
  UserService.ts
  __tests__/
    UserService.test.ts
```

### 2.2 目录命名规则

#### 2.2.1 目录始终使用 kebab-case
```bash
src/
├── components/        # 组件目录
├── services/          # 服务目录
├── utils/             # 工具目录
├── types/             # 类型定义
├── api-clients/       # API 客户端
├── user-management/   # 用户管理模块
└── payment-gateway/   # 支付网关模块
```

#### 2.2.2 模块目录结构
```bash
# ✅ 功能模块的标准结构
user-management/
├── index.ts           # 模块导出
├── UserService.ts     # 服务类
├── UserRepository.ts  # 仓储类
├── UserProfile.ts     # 类型定义
├── user-utils.ts      # 工具函数
└── constants.ts       # 模块常量
```

## 特殊命名约定

### 3.1 React/Vue 组件命名

#### 3.1.1 组件命名规则
```typescript
// ✅ React 组件：PascalCase
// UserCard.tsx
export function UserCard({ user }: UserCardProps) {
  return <div>{user.name}</div>
}

// ✅ Vue 组件：PascalCase
// UserCard.vue
export default defineComponent({
  name: 'UserCard'  // 组件名也是 PascalCase
})

// ✅ 组件属性接口：组件名 + Props
interface UserCardProps {
  user: User
  onClick?: () => void
}

interface ButtonProps {
  variant: 'primary' | 'secondary'
  disabled?: boolean
}

// ✅ 组件事件处理器：handle + 事件名
interface FormProps {
  onSubmit: (data: FormData) => void
  onChange: (field: string, value: any) => void
}

function Form({ onSubmit, onChange }: FormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(data)
  }
  
  const handleFieldChange = (field: string) => (value: any) => {
    onChange(field, value)
  }
}
```

### 3.2 事件和回调命名

#### 3.2.1 事件处理器命名
```typescript
// ✅ 事件处理器：handle + 名词 + 动词
const handleButtonClick = () => { }
const handleFormSubmit = () => { }
const handleInputChange = () => { }
const handleUserDelete = () => { }

// ✅ 事件属性：on + 名词 + 动词
interface ComponentProps {
  onClick?: () => void
  onSubmit?: (data: any) => void
  onChange?: (value: string) => void
  onUserSelect?: (user: User) => void
}

// ✅ 事件发射器：emit + 事件名
class EventBus {
  emitUserLogin(user: User) { }
  emitDataUpdate(data: any) { }
  emitErrorOccurred(error: Error) { }
}
```

### 3.3 异步操作命名

#### 3.3.1 异步函数命名
```typescript
// ✅ 异步操作：动词 + 名词
async function fetchUser(id: string): Promise<User> { }
async function loadSettings(): Promise<Settings> { }
async function saveProfile(profile: Profile): Promise<void> { }
async function deleteComment(id: string): Promise<boolean> { }

// ✅ Promise 相关变量
const userPromise = fetchUser(userId)
const loadingPromise = loadData()

// ✅ 加载状态变量
const isLoading = true
const isFetching = false
const isSaving = false
const isDeleting = false
```

## 常见问题

### 缩写词如何处理？
```typescript
// ✅ 缩写词在 PascalCase 中只首字母大写
class HttpApi { }      // 不是 HTTPApi
class XmlParser { }    // 不是 XMLParser
interface JsonData { } // 不是 JSONData

// ✅ 缩写词在 camelCase 中全部小写
const apiUrl = ''      // 不是 apiURL
const xmlData = ''     // 不是 xMLData
function parseJson() { } // 不是 parseJSON

// ✅ 常量中缩写词全部大写
const API_URL = ''
const MAX_HTTP_RETRIES = 3
```

### 数字如何处理？
```typescript
// ✅ 数字可以出现在名称中
const h1Element = document.querySelector('h1')
const base64Encode = (str: string) => { }
const sha256Hash = (data: Buffer) => { }

// ❌ 避免：数字开头（语法错误）
// const 1stItem = ''  // 错误
// function 2ndPhase() { }  // 错误
```

### 特殊字符和 Unicode？
```typescript
// ✅ 只使用 ASCII 字母、数字和 $、_
const userName = 'John'
const $element = document.querySelector('.app')
const _privateHelper = () => { }  // 虽然合法但不推荐

// ❌ 避免：Unicode 字符
const 用户名 = 'John'  // 不推荐
const naïve = true     // 不推荐
```

## 最佳实践

### DO ✅
- 保持命名一致性
- 使用描述性名称
- 遵循团队约定
- 布尔值使用 is/has/can 前缀
- 文件名反映其主要导出
- 常量使用 UPPER_SNAKE_CASE
- 类型相关使用 PascalCase

### DON'T ❌
- 不要使用匈牙利命名法（I 前缀、T 前缀）
- 避免使用下划线前缀表示私有
- 不要使用拼音命名
- 避免过度缩写
- 不要在类型中使用 any 作为名称的一部分
- 避免使用保留字作为名称
- 不要使用单字母变量（除了循环索引和泛型参数）

## 下一步

掌握命名规范后，请参考：
- [类型系统](./type-system) - 了解类型定义规范
- [编码风格](./coding-style) - 学习代码组织规范