---
layer: Practice
type: Index
title: 工具链集成规范
category: node-development-environment/toolchain
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - 工具链
  - 构建工具
  - Git hooks
  - CI/CD
  - 自动化

# 目录级 PSO
purpose: 定义开发工具链的集成和配置标准，作为父级 PSO 中工程化能力和自动化流程的实施规范
scope:
  includes:
    - 构建工具配置（Vite、Rollup、TSC、esbuild）
    - Git hooks 配置（Lefthook、commitlint）
    - 测试框架集成（Vitest、覆盖率）
    - CI/CD 配置（GitHub Actions）
    - 发布流程（Changesets、npm publish）
    - 文档生成（TypeDoc、JSDoc）
  excludes:
    - 具体业务构建逻辑
    - 部署平台配置
    - 监控和日志工具
    - 容器化配置
outcome:
  - 统一的工具链配置
  - 自动化的质量保证
  - 高效的构建流程
  - 规范的发布管理
---

# 工具链集成规范

## 概述

工具链是连接开发和生产的桥梁。一个完善的工具链能够：
- 自动化重复性工作
- 保证代码质量
- 加速构建过程
- 规范发布流程

## 构建工具

### 构建工具选择

| 工具 | 适用场景 | 优势 | 配置复杂度 |
|------|---------|------|------------|
| **TSC** | 纯 TS 库 | 类型声明完美 | ⭐ |
| **Vite** | 应用开发 | 开发快、HMR | ⭐⭐ |
| **Rollup** | 库打包 | Tree-shaking 好 | ⭐⭐⭐ |
| **esbuild** | 快速构建 | 速度极快 | ⭐⭐ |

### TSC 构建配置

```json
// tsconfig.build.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts", "**/*.spec.ts"]
}
```

```json
// package.json
{
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "build:watch": "tsc -p tsconfig.build.json --watch"
  }
}
```

### Vite 构建配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyLib',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    sourcemap: true,
    minify: 'esbuild'
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      tsConfigFilePath: './tsconfig.build.json'
    })
  ]
})
```

### Rollup 配置

```javascript
// rollup.config.js
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  external: ['react', 'react-dom'],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.build.json'
    }),
    terser()
  ]
}
```

## Git Hooks

### Lefthook 配置

```yaml
# .lefthook.yml
# 提交前检查
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{js,ts,jsx,tsx}"
      run: pnpm eslint {staged_files} --fix
    
    format:
      glob: "*.{js,ts,jsx,tsx,json,md}"
      run: pnpm prettier --write {staged_files}
    
    typecheck:
      glob: "*.{ts,tsx}"
      run: pnpm tsc --noEmit
    
    test:
      glob: "*.{test,spec}.{js,ts}"
      run: pnpm vitest related {staged_files} --run

# 提交信息检查
commit-msg:
  commands:
    commitlint:
      run: pnpm commitlint --edit {1}

# 推送前检查
pre-push:
  commands:
    test:
      run: pnpm test
    
    build:
      run: pnpm build
```

### Commitlint 配置

```javascript
// commitlint.config.js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复
        'docs',     // 文档
        'style',    // 格式
        'refactor', // 重构
        'perf',     // 性能
        'test',     // 测试
        'chore',    // 构建
        'revert',   // 回滚
        'build',    // 构建系统
        'ci'        // CI 配置
      ]
    ],
    'subject-case': [0],
    'subject-full-stop': [2, 'never', '.'],
    'subject-min-length': [2, 'always', 5],
    'subject-max-length': [2, 'always', 80],
    'body-max-line-length': [2, 'always', 100]
  }
}
```

## 测试框架

### Vitest 配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    // 测试环境
    environment: 'node',
    globals: true,
    
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
        '**/__mocks__/**'
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    },
    
    // 测试文件匹配
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    
    // 监听配置
    watchExclude: ['**/node_modules/**', '**/dist/**'],
    
    // 其他配置
    mockReset: true,
    restoreMocks: true,
    clearMocks: true
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

### 测试脚本

```json
// package.json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:related": "vitest related",
    "test:changed": "vitest --changed"
  }
}
```

## CI/CD 配置

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Lint
        run: pnpm lint
      
      - name: Type check
        run: pnpm typecheck
      
      - name: Test
        run: pnpm test:coverage
      
      - name: Build
        run: pnpm build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
```

### 发布流程

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
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
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm release
          version: pnpm version-packages
          commit: "chore: release"
          title: "chore: release"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 版本发布

### Changesets 配置

```json
// .changeset/config.json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": [],
  "___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH": {
    "onlyUpdatePeerDependentsWhenOutOfRange": true
  }
}
```

### 发布脚本

```json
// package.json
{
  "scripts": {
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "pnpm build && changeset publish",
    "release:canary": "pnpm build && changeset publish --tag canary"
  }
}
```

## 文档生成

### TypeDoc 配置

```json
// typedoc.json
{
  "entryPoints": ["src/index.ts"],
  "out": "docs/api",
  "plugin": ["typedoc-plugin-markdown"],
  "theme": "markdown",
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeInternal": true,
  "includeVersion": true,
  "readme": "README.md",
  "gitRevision": "main",
  "validation": {
    "invalidLink": true
  }
}
```

### JSDoc 配置

```javascript
// jsdoc.config.js
module.exports = {
  source: {
    include: ['src'],
    includePattern: '.+\\.js(doc|x)?$',
    excludePattern: '(^|\\/|\\\\)_'
  },
  opts: {
    destination: './docs/jsdoc',
    recurse: true,
    readme: './README.md'
  },
  plugins: ['plugins/markdown'],
  templates: {
    cleverLinks: false,
    monospaceLinks: false
  }
}
```

## 环境变量管理

### dotenv 配置

```typescript
// src/config/env.ts
import { z } from 'zod'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

// 定义 schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(32),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info')
})

// 验证和导出
export const env = envSchema.parse(process.env)
```

### 环境文件

```bash
# .env.example
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/db
API_KEY=your-api-key-here-min-32-characters
LOG_LEVEL=info
```

## 日志配置

### 简单日志

```typescript
// src/utils/logger.ts
const logLevels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
} as const

type LogLevel = keyof typeof logLevels

class Logger {
  private level: LogLevel = 'info'
  
  constructor(level?: LogLevel) {
    this.level = level || (process.env.LOG_LEVEL as LogLevel) || 'info'
  }
  
  private shouldLog(level: LogLevel): boolean {
    return logLevels[level] >= logLevels[this.level]
  }
  
  debug(...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug('[DEBUG]', new Date().toISOString(), ...args)
    }
  }
  
  info(...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info('[INFO]', new Date().toISOString(), ...args)
    }
  }
  
  warn(...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]', new Date().toISOString(), ...args)
    }
  }
  
  error(...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error('[ERROR]', new Date().toISOString(), ...args)
    }
  }
}

export const logger = new Logger()
```

## 最佳实践

### ✅ 应该做的

1. **自动化一切** - 能自动化的都要自动化
2. **快速反馈** - Git hooks 提供即时反馈
3. **持续集成** - 每次提交都要通过 CI
4. **文档同步** - 代码和文档一起更新

### ❌ 不应该做的

1. **跳过测试** - 不要为了速度跳过测试
2. **忽略 CI 失败** - CI 失败必须修复
3. **手动发布** - 使用自动化发布流程
4. **硬编码配置** - 使用环境变量

## 相关资源

### 内部文档
- [Node.js 开发环境规范](../index.md) - 父级规范
- [代码检查标准](../linting/index.md) - Lint 配置
- [TypeScript 配置](../typescript/index.md) - 类型检查

### 外部资源
- [Vite 文档](https://vitejs.dev) - Vite 官方文档
- [Vitest 文档](https://vitest.dev) - 测试框架
- [Changesets](https://github.com/changesets/changesets) - 版本管理

---

*记住：工具链的价值在于自动化和标准化，让开发者专注于创造价值而非重复劳动。*