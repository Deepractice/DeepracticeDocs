---
layer: Practice
type: How-to
title: 如何初始化 Monorepo 项目
category: node-development-environment/initialization
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - Monorepo
  - 项目初始化
  - 脚手架
  - pnpm
  - TypeScript

# 文档级 PSO
purpose: 提供标准化的 Monorepo 项目初始化步骤，确保每个新项目都具备完整的工程化配置
scope:
  includes:
    - 项目目录结构创建
    - 基础配置文件生成
    - 必要依赖安装
    - Git 仓库初始化
  excludes:
    - 业务代码编写
    - 特定框架集成
    - CI/CD 部署配置
outcome:
  - 10 分钟内完成项目初始化
  - 所有工程化配置就位
  - 可立即开始业务开发
---

# 如何初始化 Monorepo 项目

## 前置要求

- Node.js >= 20.0.0
- pnpm >= 8.15.0
- Git

## 初始化步骤

### 1. 创建项目目录

```bash
mkdir my-monorepo
cd my-monorepo
```

### 2. 初始化 pnpm workspace

```bash
# 初始化 package.json
pnpm init

# 创建 workspace 配置
cat > pnpm-workspace.yaml << EOF
packages:
  - 'packages/*'
  - 'apps/*'
  - 'services/*'
EOF
```

### 3. 配置根 package.json

```json
{
  "name": "my-monorepo",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.15.0"
  },
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "clean": "turbo run clean && rm -rf node_modules",
    "prepare": "lefthook install",
    "commit": "cz"
  }
}
```

### 4. 创建标准目录结构

```bash
# 创建核心目录
mkdir -p packages apps services docs scripts

# 创建配置目录
mkdir -p .github/workflows .vscode
```

创建 README.md 文件：

```markdown
# My Monorepo

## 项目结构

.
├── apps/          # 前端应用
├── services/      # 后端服务
├── packages/      # 共享包
├── docs/          # 文档
└── scripts/       # 构建脚本

## 快速开始

pnpm install
pnpm dev
```

### 5. 配置 TypeScript

创建基础 tsconfig：

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "baseUrl": ".",
    "paths": {
      "@monorepo/*": ["packages/*/src"]
    }
  },
  "exclude": ["node_modules", "dist", "build", "coverage"]
}
```

根 tsconfig：

```json
// tsconfig.json
{
  "extends": "./tsconfig.base.json",
  "files": [],
  "references": []
}
```

### 6. 配置 Turborepo

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

### 7. 配置代码质量工具

ESLint 配置：

```javascript
// eslint.config.js
import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
]
```

Prettier 配置：

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100
}
```

### 8. 配置 Git hooks

```yaml
# .lefthook.yml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{js,ts,jsx,tsx}"
      run: pnpm lint
    format:
      glob: "*.{js,ts,jsx,tsx,json,md}"
      run: pnpm format

commit-msg:
  commands:
    commitlint:
      run: pnpm commitlint --edit $1
```

### 9. 配置测试框架

创建 Vitest 配置：

```javascript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/__tests__/**'
      ]
    },
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    watchExclude: ['**/node_modules/**', '**/dist/**']
  },
  resolve: {
    alias: {
      '@monorepo': resolve(__dirname, './packages')
    }
  }
})
```

创建 commitlint 配置：

```javascript
// commitlint.config.js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'build',
        'ci'
      ]
    ]
  }
}
```

### 10. 安装所有依赖

```bash
# 开发依赖
pnpm add -D -w \
  typescript \
  turbo \
  @types/node \
  vitest \
  @vitest/coverage-v8 \
  eslint \
  @eslint/js \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  prettier \
  eslint-config-prettier \
  @evilmartians/lefthook \
  @commitlint/cli \
  @commitlint/config-conventional \
  commitizen \
  cz-conventional-changelog
```

### 11. 初始化 Git 仓库

创建 .gitignore 文件：

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
*.tsbuildinfo

# Testing
coverage/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea/
*.swp
*.swo
.DS_Store

# Logs
logs/
*.log
npm-debug.log*
pnpm-debug.log*

# Misc
.turbo/
```

初始化仓库并提交：

```bash
git init
pnpm install
pnpm lefthook install
git add .
git commit -m "chore: initialize monorepo structure"
```

## 验证检查清单

- [ ] `pnpm install` 成功运行
- [ ] `pnpm typecheck` 无错误
- [ ] `pnpm lint` 可以运行
- [ ] `pnpm test` 配置就绪
- [ ] Git hooks 正常工作
- [ ] 可以创建新的 package

## 下一步

1. 在 `packages/` 创建共享包
2. 在 `apps/` 创建前端应用
3. 在 `services/` 创建后端服务
4. 配置 CI/CD 流程
5. 创建 Contributing.md 贡献指南
6. 设置 Issue/PR 模板

## 常见问题

### Q: 为什么使用 pnpm？
A: pnpm 提供更快的安装速度、更少的磁盘占用、更好的 monorepo 支持。

### Q: 是否必须使用 Turborepo？
A: 不是必须，但 Turborepo 提供了优秀的缓存和并行构建能力。

### Q: 如何添加新的 workspace？
A: 在对应目录（apps/services/packages）创建新目录，包含自己的 package.json。

## 相关资源

- [pnpm Workspace 文档](https://pnpm.io/workspaces)
- [Turborepo 文档](https://turbo.build/repo/docs)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)