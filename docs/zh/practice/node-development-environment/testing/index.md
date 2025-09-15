---
layer: Practice
type: Index
title: 测试框架配置规范
category: node-development-environment/testing
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - 测试
  - Vitest
  - 单元测试
  - 集成测试
  - 测试覆盖率

# 目录级 PSO
purpose: 定义测试框架的配置和测试策略标准，作为父级 PSO 中"代码质量保证"的测试实践规范
scope:
  includes:
    - 测试框架选择和配置（Vitest、Jest）
    - 测试策略制定（单元、集成、E2E）
    - 覆盖率要求和配置
    - 测试文件组织规范
    - Mock 和 Stub 策略
    - 测试数据管理
    - CI 中的测试配置
  excludes:
    - 具体业务测试用例
    - 性能测试工具
    - 安全测试工具
    - 手动测试流程
outcome:
  - 统一的测试框架配置
  - 清晰的测试策略
  - 可靠的测试覆盖率
  - 高效的测试执行
---

# 测试框架配置规范

## 概述

测试是代码质量的保证。良好的测试策略能够：
- 预防回归错误
- 提供重构信心
- 作为活文档
- 提高代码质量

## 测试框架选择

### Vitest（推荐）

**优势**：
- ⚡ **速度快** - 基于 Vite，利用 ESM
- 🔧 **配置简单** - 开箱即用
- 🎯 **兼容 Jest** - 平滑迁移
- 📦 **内置功能** - 覆盖率、快照、Mock

**适用场景**：
- 新项目首选
- TypeScript 项目
- Monorepo 项目
- 需要快速反馈

### Jest（备选）

**适用场景**：
- 遗留项目
- React 项目（CRA）
- 需要特定 Jest 插件

## Vitest 配置

### 基础配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    // 测试环境
    environment: 'node', // 'node' | 'jsdom' | 'happy-dom'
    globals: true,
    
    // 文件匹配
    include: [
      '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: [
      'node_modules',
      'dist',
      'cypress',
      'coverage',
      '.{idea,git,cache,output,temp}'
    ],
    
    // 覆盖率配置
    coverage: {
      provider: 'v8', // 'v8' | 'istanbul'
      enabled: false, // 默认关闭，通过 --coverage 开启
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/__mocks__/**',
        '**/__tests__/**',
        '**/index.ts' // 如果只是导出
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      },
      clean: true,
      all: true
    },
    
    // 性能优化
    threads: true,
    maxThreads: 4,
    minThreads: 1,
    isolate: true,
    
    // Mock 配置
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
    
    // 超时配置
    testTimeout: 5000,
    hookTimeout: 10000,
    
    // 重试配置
    retry: 0, // CI 中可以设为 2
    
    // 监听模式
    watch: false,
    watchExclude: ['**/node_modules/**', '**/dist/**']
  },
  
  // 路径解析
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@test': resolve(__dirname, './test')
    }
  }
})
```

### Monorepo 配置

```typescript
// packages/ui/vitest.config.ts
import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../vitest.config.base'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: 'jsdom', // UI 组件需要 DOM
      setupFiles: ['./test/setup.ts']
    }
  })
)
```

## 测试策略

### 测试金字塔

```
        /\
       /E2E\      <- 少量（10%）
      /------\
     /集成测试\    <- 适量（30%）
    /----------\
   /  单元测试  \  <- 大量（60%）
  /--------------\
```

### 测试类型

| 类型 | 目的 | 速度 | 范围 | 工具 |
|------|------|------|------|------|
| **单元测试** | 测试单个函数/组件 | 快 | 小 | Vitest |
| **集成测试** | 测试模块间交互 | 中 | 中 | Vitest |
| **E2E 测试** | 测试完整流程 | 慢 | 大 | Playwright |
| **快照测试** | 防止意外变更 | 快 | 小 | Vitest |

## 测试文件组织

### 文件结构

```
src/
├── utils/
│   ├── format.ts
│   └── format.test.ts    # 同目录测试
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── Button.stories.tsx
│   └── __tests__/       # 集成测试
│       └── integration.test.ts
test/                     # 全局测试
├── setup.ts             # 测试设置
├── fixtures/            # 测试数据
├── mocks/              # 全局 Mock
└── e2e/                # E2E 测试
```

### 命名规范

```typescript
// 单元测试
describe('formatDate', () => {
  it('should format date to YYYY-MM-DD', () => {
    // Given-When-Then 或 Arrange-Act-Assert
    const date = new Date('2024-01-15')
    const result = formatDate(date)
    expect(result).toBe('2024-01-15')
  })
  
  it('should handle invalid date', () => {
    const result = formatDate('invalid')
    expect(result).toBe('Invalid Date')
  })
})

// 集成测试
describe('UserService Integration', () => {
  it('should create and retrieve user', async () => {
    const user = await createUser({ name: 'John' })
    const retrieved = await getUser(user.id)
    expect(retrieved).toEqual(user)
  })
})
```

## Mock 策略

### 自动 Mock

```typescript
// 自动 mock 模块
vi.mock('@/services/api')

// 部分 mock
vi.mock('@/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn()
  }
}))
```

### 手动 Mock

```typescript
// __mocks__/axios.ts
export default {
  get: vi.fn(() => Promise.resolve({ data: {} })),
  post: vi.fn(() => Promise.resolve({ data: {} }))
}
```

### Mock 服务器

```typescript
// test/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

// test/setup.ts
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## 测试数据管理

### Fixtures

```typescript
// test/fixtures/user.ts
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com'
}

export const createMockUser = (overrides = {}) => ({
  ...mockUser,
  ...overrides
})
```

### Factory 模式

```typescript
// test/factories/user.factory.ts
import { Factory } from 'fishery'
import { User } from '@/types'

export const userFactory = Factory.define<User>(({ sequence }) => ({
  id: sequence.toString(),
  name: `User ${sequence}`,
  email: `user${sequence}@example.com`,
  createdAt: new Date()
}))

// 使用
const user = userFactory.build()
const users = userFactory.buildList(3)
```

## 覆盖率配置

### 覆盖率目标

| 指标 | 最低要求 | 推荐目标 | 说明 |
|------|---------|---------|------|
| **Lines** | 70% | 80% | 代码行覆盖 |
| **Functions** | 70% | 80% | 函数覆盖 |
| **Branches** | 60% | 75% | 分支覆盖 |
| **Statements** | 70% | 80% | 语句覆盖 |

### 覆盖率脚本

```json
// package.json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:update": "vitest run -u"
  }
}
```

### 覆盖率徽章

```markdown
<!-- README.md -->
[![Coverage](https://img.shields.io/codecov/c/github/user/repo)](https://codecov.io/gh/user/repo)
```

## CI 集成

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - name: Install
        run: pnpm install --frozen-lockfile
      
      - name: Test
        run: pnpm test:coverage
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## 测试性能优化

### 并行执行

```typescript
// vitest.config.ts
{
  test: {
    threads: true,
    maxThreads: 4
  }
}
```

### 选择性运行

```bash
# 只运行变更的测试
vitest --changed

# 只运行相关的测试
vitest --related src/utils/format.ts

# 只运行特定文件
vitest src/utils
```

### 测试分片

```bash
# CI 中分片执行
vitest --shard=1/3
vitest --shard=2/3
vitest --shard=3/3
```

## 最佳实践

### ✅ 应该做的

1. **测试独立性** - 每个测试独立运行
2. **描述清晰** - 测试名称说明预期行为
3. **AAA 模式** - Arrange-Act-Assert
4. **适当 Mock** - 只 Mock 外部依赖
5. **快速反馈** - 单元测试要快

### ❌ 不应该做的

1. **测试实现细节** - 测试行为而非实现
2. **过度 Mock** - 不要 Mock 被测试的代码
3. **忽略失败测试** - 失败必须修复
4. **测试覆盖率造假** - 质量比数量重要
5. **睡眠等待** - 使用正确的异步处理

## 故障排查

### 常见问题

**Q: 测试超时**
```typescript
// 增加超时时间
test('slow test', async () => {
  // ...
}, 10000)
```

**Q: Mock 不生效**
```typescript
// 确保在导入前 mock
vi.mock('./module')
import { something } from './module'
```

**Q: 内存泄漏**
```bash
# 检测内存泄漏
vitest --logHeapUsage
```

## 相关资源

### 内部文档
- [Node.js 开发环境规范](../index.md) - 父级规范
- [代码检查标准](../linting/index.md) - 代码质量
- [工具链集成](../toolchain/index.md) - CI/CD 配置

### 外部资源
- [Vitest 文档](https://vitest.dev) - 官方文档
- [Testing Library](https://testing-library.com) - 测试工具
- [MSW](https://mswjs.io) - Mock 服务

---

*记住：测试不是为了达到 100% 覆盖率，而是为了信心。好的测试让重构变得轻松。*