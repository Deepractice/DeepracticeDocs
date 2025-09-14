---
layer: Practice
type: Reference
title: Monorepo 配置模板集
category: node-development-environment
status: published
version: 2.1.0
date: 2025-01-14
author: Sean Jiang & Claude
tags:
  - Monorepo
  - pnpm
  - TypeScript
  - Turborepo
  - 配置模板
purpose: 提供生产就绪的 Monorepo 配置模板，可直接复制使用
scope:
  includes:
    - 完整的配置文件模板
    - 工作区配置（pnpm-workspace.yaml）
    - TypeScript 配置（tsconfig.json）
    - Turborepo 配置（turbo.json）
    - 构建工具配置（tsup、vitest）
    - 代码质量配置（ESLint、Prettier）
    - Git Hooks 配置（Lefthook）
    - CI/CD 配置示例
  excludes:
    - 配置原理解释（→ understanding-monorepo-architecture.md）
    - 技术选型理由（→ monorepo-standard.md）
    - 业务代码示例
outcome:
  - 获得所有必需的配置文件
  - 能够快速搭建 Monorepo 环境
  - 掌握配置调整方法
dependencies:
  - ./monorepo-standard.md
related:
  - ./how-to-initialize-monorepo.md
  - ./understanding-monorepo-architecture.md
---

# Monorepo 配置规范

## 概述

本规范提供完整的 Monorepo 配置模板，包括工作区、TypeScript、构建工具、代码质量和自动化配置。所有配置均为生产就绪，可直接复制使用。

## 核心配置文件

### 项目根目录结构

```
my-monorepo/
├── apps/                 # 应用程序
├── packages/            # 共享包
├── configs/             # 共享配置
├── tools/               # 工具脚本
├── .github/             # GitHub 配置
├── pnpm-workspace.yaml  # 工作区配置
├── turbo.json          # Turborepo 配置
├── package.json        # 根 package.json
├── tsconfig.json       # TypeScript 配置
├── .npmrc              # npm 配置
├── .nvmrc              # Node 版本
├── lefthook.yml        # Git Hooks
└── .gitignore          # Git 忽略
```

## 工作区配置

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'configs/*'
  - 'tools/*'
```

### 根 package.json

```json
{
  "name": "my-monorepo",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@8.14.0",
  "engines": {
    "node": ">=18.19.0",
    "pnpm": ">=8.0.0"
  },
  "scripts": {
    // 开发命令
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    
    // 工作区管理
    "clean": "turbo run clean && rm -rf node_modules",
    "fresh": "pnpm clean && pnpm install",
    "update:deps": "pnpm update -r --interactive --latest",
    
    // Git Hooks
    "prepare": "lefthook install",
    
    // 版本管理
    "changeset": "changeset",
    "version": "changeset version",
    "release": "pnpm build && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.1",
    "@types/node": "^20.10.6",
    "lefthook": "^1.5.5",
    "prettier": "^3.1.1",
    "turbo": "^1.11.2",
    "typescript": "^5.3.3"
  },
  "pnpm": {
    "overrides": {
      "typescript": "^5.3.3"
    }
  }
}
```

### .npmrc

```ini
# pnpm 配置
shamefully-hoist=true
prefer-workspace-packages=true
link-workspace-packages=deep
auto-install-peers=true
strict-peer-dependencies=false

# 提升模式
hoist-pattern[]=*eslint*
hoist-pattern[]=*prettier*
hoist-pattern[]=@types/*

# Node 版本
use-node-version=18.19.0
engine-strict=true

# 注册表
registry=https://registry.npmjs.org/
```

## TypeScript 配置

### 根 tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./packages/utils" },
    { "path": "./packages/types" },
    { "path": "./packages/ui" },
    { "path": "./apps/web" }
  ]
}
```

### configs/typescript/base.json

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    // 目标和模块
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "moduleDetection": "force",
    
    // 严格模式
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    
    // 互操作性
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    
    // 输出配置
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "incremental": true
  },
  "exclude": [
    "node_modules",
    "dist",
    "build",
    "coverage"
  ]
}
```

### 包级别 tsconfig.json 模板

```json
{
  "extends": "../../configs/typescript/base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "composite": true,
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts"],
  "references": [
    { "path": "../types" }
  ]
}
```

## Turborepo 配置

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local", "tsconfig.json"],
  "globalEnv": ["NODE_ENV", "CI"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"],
      "cache": true,
      "env": ["NODE_ENV"]
    },
    "dev": {
      "dependsOn": ["^build"],
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "cache": false
    },
    "lint": {
      "outputs": [],
      "cache": true
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": [],
      "cache": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

## 构建工具配置

### tsup.config.ts

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
    entry: './src/index.ts'
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  shims: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.conditions = ['import', 'module']
    options.platform = 'neutral'
  }
})
```

### 包 package.json 模板

```json
{
  "name": "@myproject/utils",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup",
    "test": "vitest run",
    "lint": "eslint src",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@myproject/types": "workspace:*"
  },
  "devDependencies": {
    "tsup": "^8.0.1",
    "vitest": "^1.1.0"
  }
}
```

## 代码质量配置

### ESLint 配置 (configs/eslint/base.js)

```javascript
export default {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc' }
    }],
    'no-console': ['warn', { allow: ['warn', 'error'] }]
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true
      }
    }
  },
  ignorePatterns: ['dist', 'build', 'coverage', '*.config.js']
}
```

### Prettier 配置 (.prettierrc)

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### EditorConfig (.editorconfig)

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
```

## Git Hooks 配置

### lefthook.yml

```yaml
pre-commit:
  parallel: true
  commands:
    format:
      glob: "*.{js,ts,tsx,json,md}"
      run: pnpm prettier --write {staged_files}
      stage_fixed: true
    
    lint:
      glob: "*.{js,ts,tsx}"
      run: pnpm eslint --fix {staged_files}
      stage_fixed: true
    
    type-check:
      run: turbo run type-check --filter=[HEAD^]

commit-msg:
  commands:
    validate:
      run: |
        commit_regex='^(feat|fix|docs|style|refactor|perf|test|build|ci|chore)(\(.+\))?: .{1,50}'
        if ! grep -qE "$commit_regex" "$1"; then
          echo "❌ 提交信息必须符合约定式提交规范"
          exit 1
        fi

pre-push:
  parallel: false
  commands:
    test:
      run: turbo run test --filter=[origin/main]
    build:
      run: turbo run build --filter=[origin/main]
```

## 测试配置

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.config.ts'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    },
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist', 'build']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
```

## VSCode 配置

### .vscode/settings.json

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "eslint.workingDirectories": [{ "mode": "auto" }],
  "files.exclude": {
    "**/node_modules": true,
    "**/.turbo": true
  }
}
```

### .vscode/extensions.json

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "editorconfig.editorconfig",
    "vitest.explorer"
  ]
}
```

## CI/CD 配置

### .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - name: Install
        run: pnpm install --frozen-lockfile
      
      - name: Lint
        run: pnpm lint
      
      - name: Type Check
        run: pnpm type-check
      
      - name: Test
        run: pnpm test
      
      - name: Build
        run: pnpm build
```

## 快速命令参考

### 日常开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建项目
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint
pnpm type-check
```

### 包管理

```bash
# 添加根依赖
pnpm add -D -w typescript

# 添加包依赖
pnpm add express --filter @myproject/api

# 添加内部依赖
pnpm add @myproject/utils --filter @myproject/web

# 更新依赖
pnpm update -r --interactive --latest
```

### 任务执行

```bash
# 执行特定包任务
turbo run build --filter=@myproject/utils

# 执行受影响包
turbo run build --filter=...[origin/main]

# 查看执行计划
turbo run build --dry-run

# 禁用缓存
turbo run build --force
```

## 故障排除

### 常见问题快速解决

| 问题 | 命令 |
|------|------|
| 依赖安装失败 | `pnpm store prune && pnpm install` |
| 类型检查失败 | `tsc --build --clean && tsc --build` |
| 构建缓存问题 | `rm -rf .turbo && turbo run build --force` |
| Git Hooks 失效 | `npx lefthook install --force` |
| ESM 导入错误 | 确保文件扩展名 `.js` 和 `"type": "module"` |

---

## 参考资源

- [pnpm Workspace](https://pnpm.io/workspaces)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Lefthook](https://github.com/evilmartians/lefthook)

---

*记住：好的配置是能直接复制使用的配置。*