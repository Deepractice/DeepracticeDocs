---
layer: Practice
type: Reference
title: package.json 配置规范
category: node-development-environment/initialization
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude

purpose: 定义 package.json 文件的标准配置规范
scope:
  includes:
    - 必需字段规范
    - 脚本命名标准
    - 依赖管理规则
    - 元信息规范
    - 发布配置
  excludes:
    - 具体依赖包选择  # 属于技术选型
    - 框架特定配置  # 属于框架规范
outcome:
  - 规范的 package.json 配置
  - 统一的脚本命名
  - 清晰的依赖管理
---

# package.json 配置规范

## 必需字段

| 字段 | 说明 | 示例 |
|------|------|------|
| `name` | 包名称，小写字母和连字符 | `"my-project"` |
| `version` | 语义化版本 | `"1.0.0"` |
| `description` | 简洁的项目描述 | `"A Node.js TypeScript project"` |
| `type` | 模块类型 | `"module"` (ESM) 或 `"commonjs"` |
| `engines` | Node.js 版本要求 | `{ "node": ">=20.0.0" }` |
| `packageManager` | 包管理器版本锁定 | `"pnpm@8.15.0"` |

## 脚本规范

### 标准脚本名称

| 脚本名 | 用途 | 命令示例 |
|--------|------|----------|
| `dev` | 开发模式 | `tsx watch src/index.ts` |
| `build` | 构建项目 | `tsc && vite build` |
| `test` | 运行测试 | `vitest` |
| `test:watch` | 监听测试 | `vitest --watch` |
| `test:coverage` | 测试覆盖率 | `vitest --coverage` |
| `lint` | 代码检查 | `eslint .` |
| `lint:fix` | 自动修复 | `eslint . --fix` |
| `format` | 格式化代码 | `prettier --write .` |
| `format:check` | 检查格式 | `prettier --check .` |
| `typecheck` | 类型检查 | `tsc --noEmit` |
| `clean` | 清理构建 | `rimraf dist` |
| `prepare` | 安装后钩子 | `husky install` |

### 脚本组织原则

```json
{
  "scripts": {
    "// 开发": "",
    "dev": "...",
    "build": "...",
    
    "// 质量": "",
    "test": "...",
    "lint": "...",
    "format": "...",
    "typecheck": "...",
    
    "// 工具": "",
    "clean": "...",
    "prepare": "..."
  }
}
```

## 依赖管理

### 依赖分类

| 类型 | 字段 | 说明 |
|------|------|------|
| 生产依赖 | `dependencies` | 运行时需要的包 |
| 开发依赖 | `devDependencies` | 仅开发时需要 |
| 同级依赖 | `peerDependencies` | 宿主环境提供 |
| 可选依赖 | `optionalDependencies` | 可选功能包 |

### 版本范围规范

| 符号 | 含义 | 使用场景 |
|------|------|----------|
| `^1.2.3` | 兼容性更新 | 默认，允许小版本更新 |
| `~1.2.3` | 补丁更新 | 保守，仅允许补丁 |
| `1.2.3` | 精确版本 | 锁定关键依赖 |
| `>=1.2.3` | 最小版本 | peerDependencies |
| `*` | 任意版本 | 避免使用 |

## 发布配置

### 基础发布字段

```json
{
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
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

### 私有包配置

```json
{
  "private": true,
  "publishConfig": {
    "access": "restricted"
  }
}
```

## 元信息规范

### 作者信息

```json
{
  "author": {
    "name": "Sean Jiang",
    "email": "sean@deepractice.ai",
    "url": "https://deepractice.ai"
  },
  "contributors": [
    "Name <email@example.com>"
  ]
}
```

### 仓库信息

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/deepractice/project.git"
  },
  "bugs": {
    "url": "https://github.com/deepractice/project/issues"
  },
  "homepage": "https://deepractice.ai"
}
```

### 关键词和许可

```json
{
  "keywords": [
    "nodejs",
    "typescript",
    "deepractice"
  ],
  "license": "MIT"
}
```

## Monorepo 根配置

```json
{
  "name": "my-monorepo",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "lint": "turbo lint",
    "format": "prettier --write .",
    "clean": "turbo clean && rimraf node_modules"
  },
  "devDependencies": {
    "turbo": "^1.11.0",
    "prettier": "^3.1.0",
    "eslint": "^8.55.0",
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

## 工作空间包配置

```json
{
  "name": "@my-monorepo/package-name",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "test": "vitest",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@my-monorepo/shared": "workspace:*"
  }
}
```

## 配置示例

### 完整的应用配置

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "A production Node.js application",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc && vite build",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "clean": "rimraf dist coverage",
    "prepare": "husky install"
  },
  "dependencies": {
    "express": "^4.18.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/express": "^4.17.0",
    "typescript": "^5.3.0",
    "tsx": "^4.6.0",
    "vite": "^5.0.0",
    "vitest": "^1.1.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0",
    "husky": "^8.0.0",
    "rimraf": "^5.0.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/deepractice/my-app.git"
  },
  "keywords": [
    "nodejs",
    "typescript",
    "express"
  ],
  "author": "Sean Jiang <sean@deepractice.ai>",
  "license": "MIT"
}
```

## 最佳实践

### 版本管理

- 使用语义化版本（Semantic Versioning）
- 开发阶段使用 `0.x.x` 版本
- 重大变更时更新主版本号

### 脚本命名

- 使用统一的命名约定
- 相关脚本使用冒号分组（如 `test:*`）
- 避免过长的脚本名

### 依赖管理

- 定期更新依赖
- 使用 `pnpm update --interactive` 交互式更新
- 生产依赖保持最小化
- 开发依赖放在 `devDependencies`

### 性能优化

- 使用 `files` 字段限制发布内容
- 配置 `sideEffects: false` 支持 tree-shaking
- 合理使用 `peerDependencies` 避免重复安装

---

*提示：使用 `pnpm init` 后根据本规范调整配置。*