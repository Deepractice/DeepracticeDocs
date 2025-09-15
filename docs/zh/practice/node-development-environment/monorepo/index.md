---
layer: Practice
type: Index
title: Monorepo 项目组织规范
category: node-development-environment/monorepo
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - Monorepo
  - 项目架构
  - pnpm workspace
  - Turborepo
  - 包管理

# 目录级 PSO
purpose: 定义 Monorepo 项目的组织架构和管理策略，作为父级 PSO 中多包项目管理的实践指南
scope:
  includes:
    - Monorepo 架构设计（目录结构、包组织）
    - 依赖管理策略（共享依赖、版本同步）
    - 构建编排配置（Turborepo pipeline）
    - 包之间的协作模式（引用、发布）
    - 开发工作流（本地开发、测试策略）
    - 版本管理策略（统一版本、独立版本）
  excludes:
    - 具体业务架构设计
    - 微服务通信协议
    - 部署和运维策略
    - 具体框架使用
outcome:
  - 清晰的项目组织结构
  - 高效的包依赖管理
  - 智能的构建缓存
  - 流畅的开发体验
---

# Monorepo 项目组织规范

## 概述

Monorepo（单一代码库）是将多个项目存放在同一个代码库中的开发策略。它特别适合：
- 需要共享代码的多个应用
- 前后端一体化项目
- 组件库和使用它的应用
- 微服务架构的多个服务

## 核心价值

### 🔄 代码复用最大化
共享代码实时同步，无需发布即可使用最新版本。

### 🚀 原子化提交
相关改动在一个提交中完成，保证一致性。

### 🛠️ 统一工具链
所有项目使用相同的构建、测试、部署流程。

## 架构设计

### 标准目录结构

```
monorepo-root/
├── apps/                 # 应用层 - 最终部署的应用
│   ├── web/             # Web 前端应用
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── mobile/          # 移动端应用
│       ├── src/
│       └── package.json
│
├── services/            # 服务层 - 后端服务
│   ├── api/            # API 服务
│   │   ├── src/
│   │   └── package.json
│   └── auth/           # 认证服务
│       ├── src/
│       └── package.json
│
├── packages/            # 包层 - 共享代码
│   ├── ui/             # UI 组件库
│   │   ├── src/
│   │   └── package.json
│   ├── utils/          # 工具函数库
│   │   ├── src/
│   │   └── package.json
│   ├── types/          # 类型定义
│   │   ├── src/
│   │   └── package.json
│   └── config/         # 共享配置
│       ├── eslint/
│       ├── tsconfig/
│       └── package.json
│
├── docs/               # 文档
│   └── architecture.md
│
├── scripts/            # 构建脚本
│   ├── build.js
│   └── release.js
│
├── package.json        # 根配置
├── pnpm-workspace.yaml # Workspace 配置
├── turbo.json         # Turborepo 配置
├── tsconfig.json      # TypeScript 根配置
└── .gitignore
```

### 包的分层原则

| 层级 | 目录 | 职责 | 依赖关系 |
|------|------|------|----------|
| **应用层** | apps/ | 最终用户交互界面 | 可依赖 services/ 和 packages/ |
| **服务层** | services/ | 业务逻辑和 API | 可依赖 packages/ |
| **包层** | packages/ | 共享代码和工具 | 只能依赖其他 packages/ |

### 包命名规范

```json
// apps/web/package.json
{
  "name": "@monorepo/web",
  "version": "1.0.0",
  "private": true
}

// packages/ui/package.json
{
  "name": "@monorepo/ui",
  "version": "1.0.0",
  "private": false  // 如果要发布
}
```

## Workspace 配置

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'services/*'
  - 'packages/*'
  - 'docs'
```

### 根 package.json

```json
{
  "name": "monorepo",
  "version": "0.0.0",
  "private": true,
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.15.0"
  },
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "clean": "turbo run clean && rm -rf node_modules",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "changeset": "changeset",
    "version": "changeset version",
    "release": "turbo run build && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.1",
    "turbo": "^1.11.0",
    "typescript": "^5.3.0",
    "prettier": "^3.2.0",
    "eslint": "^9.0.0"
  }
}
```

## 依赖管理

### 共享依赖策略

```json
// packages/ui/package.json
{
  "name": "@monorepo/ui",
  "dependencies": {
    "react": "^18.2.0"  // UI 库的依赖
  },
  "peerDependencies": {
    "react": "^18.2.0"  // 要求使用方提供
  }
}

// apps/web/package.json
{
  "name": "@monorepo/web",
  "dependencies": {
    "@monorepo/ui": "workspace:*",  // 内部包引用
    "react": "^18.2.0"  // 满足 peer 依赖
  }
}
```

### 版本同步

使用 pnpm overrides 统一版本：

```json
// 根 package.json
{
  "pnpm": {
    "overrides": {
      "react": "^18.2.0",
      "typescript": "^5.3.0",
      "@types/node": "^20.11.0"
    }
  }
}
```

### 内部包引用

```typescript
// apps/web/src/App.tsx
import { Button } from '@monorepo/ui'
import { formatDate } from '@monorepo/utils'
import type { User } from '@monorepo/types'
```

## Turborepo 配置

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"],
      "cache": true
    },
    "dev": {
      "dependsOn": ["^build"],
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "cache": true,
      "inputs": ["src/**", "test/**"]
    },
    "lint": {
      "outputs": [],
      "cache": true,
      "inputs": ["src/**", "*.json", "*.js", "*.ts"]
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": [],
      "cache": true
    },
    "clean": {
      "cache": false
    },
    "@monorepo/web#build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "env": ["NEXT_PUBLIC_*"]
    }
  }
}
```

### 任务编排

```bash
# 并行运行所有包的 dev
pnpm dev

# 构建依赖图顺序
pnpm build

# 只运行特定包
pnpm --filter @monorepo/web dev

# 运行受影响的包
pnpm turbo run build --filter=...[origin/main]
```

## 开发工作流

### 本地开发

```bash
# 1. 安装依赖
pnpm install

# 2. 并行开发
pnpm dev

# 3. 只开发特定应用
pnpm --filter web dev

# 4. 开发应用及其依赖
pnpm --filter web... dev
```

### 添加新包

```bash
# 1. 创建包目录
mkdir -p packages/new-package/src

# 2. 初始化 package.json
cd packages/new-package
pnpm init

# 3. 配置 package.json
{
  "name": "@monorepo/new-package",
  "version": "0.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}

# 4. 在其他包中使用
pnpm --filter web add @monorepo/new-package
```

### 依赖更新

```bash
# 更新所有包的依赖
pnpm update -r

# 更新特定包的依赖
pnpm --filter @monorepo/ui update react

# 交互式更新
pnpm update -i -r --latest
```

## TypeScript 配置

### 根 tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./apps/web" },
    { "path": "./services/api" },
    { "path": "./packages/ui" },
    { "path": "./packages/utils" },
    { "path": "./packages/types" }
  ]
}
```

### 包的 tsconfig.json

```json
// packages/utils/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": "./src",
    "outDir": "./dist",
    "tsBuildInfoFile": "./dist/tsconfig.tsbuildinfo"
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../types" }
  ]
}
```

## 版本管理

### Changesets 配置

```json
// .changeset/config.json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [
    ["@monorepo/ui", "@monorepo/utils", "@monorepo/types"]
  ],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@monorepo/web", "@monorepo/api"]
}
```

### 发布流程

```bash
# 1. 创建变更集
pnpm changeset

# 2. 版本更新
pnpm changeset version

# 3. 构建和发布
pnpm release
```

## 测试策略

### 单元测试

```json
// packages/utils/package.json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

### 集成测试

```typescript
// apps/web/__tests__/integration.test.ts
import { render } from '@testing-library/react'
import { Button } from '@monorepo/ui'

test('UI 包集成', () => {
  const { getByText } = render(<Button>Click</Button>)
  expect(getByText('Click')).toBeInTheDocument()
})
```

## 最佳实践

### ✅ 应该做的

1. **保持包的独立性** - 每个包应该能独立构建和测试
2. **明确依赖关系** - 避免循环依赖
3. **使用 workspace 协议** - `workspace:*` 引用内部包
4. **缓存优化** - 充分利用 Turborepo 缓存

### ❌ 不应该做的

1. **过度拆分** - 不要创建太小的包
2. **混合层级** - apps 不应该被 packages 依赖
3. **忽略版本管理** - 要有清晰的版本策略
4. **硬编码路径** - 使用包名而非相对路径

## 常见问题

### Q: 如何处理循环依赖？
A: 提取共同依赖到新的包中，或重新设计架构。

### Q: 构建很慢怎么办？
A: 使用 Turborepo 缓存，配置增量构建，优化依赖图。

### Q: 如何调试内部包？
A: 使用 `pnpm link` 或在 dev 模式下使用源码。

## 相关资源

### 内部文档
- [Node.js 开发环境规范](../index.md) - 父级规范
- [项目初始化](../initialization/index.md) - Monorepo 初始化
- [包管理策略](../package-management/index.md) - 依赖管理详解

### 外部资源
- [pnpm Workspaces](https://pnpm.io/workspaces) - Workspace 文档
- [Turborepo Docs](https://turbo.build) - Turborepo 官方文档
- [Changesets](https://github.com/changesets/changesets) - 版本管理工具

---

*记住：Monorepo 不是银弹，但对于需要代码共享的项目，它是最优解。*