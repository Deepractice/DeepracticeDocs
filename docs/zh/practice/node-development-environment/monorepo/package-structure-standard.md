---
layer: Practice
type: Reference
title: 包结构设计标准
category: node-development-environment/monorepo
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - Monorepo
  - 包设计
  - 项目结构
  - 模块化

purpose: 定义 Monorepo 中包的标准结构和组织方式
scope:
  includes:
    - 包的分类和职责
    - 目录结构规范
    - package.json 配置
    - 导出和入口规范
  excludes:
    - 具体业务逻辑  # → 业务相关文档
    - 构建工具配置  # → turborepo-configuration.md
outcome:
  - 能设计清晰的包结构
  - 能正确配置包的导出
  - 能避免包之间的耦合
---

# 包结构设计标准

## 概述

良好的包结构设计是 Monorepo 成功的关键。本标准定义了包的分类、职责划分、目录结构和配置规范。

## 包分类体系

### 按职责分类

| 类型 | 前缀 | 职责 | 示例 |
|------|------|------|------|
| **应用包** | `app-*` | 可独立运行的应用 | `@org/app-web`, `@org/app-mobile` |
| **库包** | 无前缀 | 共享的功能库 | `@org/ui`, `@org/utils` |
| **配置包** | `config-*` | 共享配置 | `@org/config-eslint`, `@org/config-typescript` |
| **工具包** | `tool-*` | 开发工具 | `@org/tool-scripts`, `@org/tool-cli` |
| **类型包** | `types-*` | 类型定义 | `@org/types-api`, `@org/types-shared` |

### 按层级分类

```
依赖方向：应用 → 功能 → 基础 → 配置

apps/           # 应用层：最终用户产品
  ↓
packages/       # 功能层：业务功能模块
  ↓
libs/           # 基础层：通用工具库
  ↓
configs/        # 配置层：共享配置
```

## 标准目录结构

### 应用包结构

```
apps/web/
├── src/                    # 源代码
│   ├── app/               # 应用主体
│   ├── components/        # 组件
│   ├── hooks/            # Hooks
│   ├── lib/              # 工具函数
│   ├── styles/           # 样式
│   └── types/            # 类型定义
├── public/                # 静态资源
├── tests/                 # 测试文件
│   ├── unit/             # 单元测试
│   ├── integration/      # 集成测试
│   └── e2e/              # 端到端测试
├── .env.example          # 环境变量示例
├── package.json          # 包配置
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # 构建配置
└── README.md             # 说明文档
```

### 库包结构

```
packages/ui/
├── src/                    # 源代码
│   ├── components/        # 组件定义
│   │   ├── Button/
│   │   │   ├── index.ts
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── Button.stories.tsx
│   │   └── index.ts      # 统一导出
│   ├── hooks/            # 共享 Hooks
│   ├── utils/            # 工具函数
│   └── index.ts          # 包入口
├── dist/                  # 构建产物
├── tests/                 # 额外测试
├── package.json          # 包配置
├── tsconfig.json         # TypeScript 配置
├── tsup.config.ts        # 打包配置
└── README.md             # 使用文档
```

### 配置包结构

```
configs/eslint/
├── index.js              # 主配置文件
├── rules/                # 规则定义
│   ├── base.js
│   ├── react.js
│   └── typescript.js
├── package.json          # 包配置
└── README.md             # 配置说明
```

### 类型包结构

```
packages/types-api/
├── src/
│   ├── models/           # 数据模型
│   │   ├── user.ts
│   │   └── product.ts
│   ├── api/              # API 类型
│   │   ├── request.ts
│   │   └── response.ts
│   └── index.ts          # 统一导出
├── package.json
└── tsconfig.json
```

## package.json 配置规范

### 基础字段配置

```json
{
  "name": "@org/package-name",
  "version": "1.0.0",
  "description": "包的简短描述",
  "keywords": ["monorepo", "typescript"],
  "homepage": "https://github.com/org/repo#readme",
  "bugs": {
    "url": "https://github.com/org/repo/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/org/repo.git",
    "directory": "packages/package-name"
  },
  "license": "MIT",
  "author": "Organization Name",
  "sideEffects": false,
  "type": "module"
}
```

### 导出配置

#### 单入口导出

```json
{
  "main": "./dist/index.js",      // CommonJS 入口
  "module": "./dist/index.mjs",   // ESM 入口
  "types": "./dist/index.d.ts",   // 类型定义
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  }
}
```

#### 多入口导出

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./components": {
      "types": "./dist/components/index.d.ts",
      "import": "./dist/components/index.mjs",
      "require": "./dist/components/index.js"
    },
    "./hooks": {
      "types": "./dist/hooks/index.d.ts",
      "import": "./dist/hooks/index.mjs",
      "require": "./dist/hooks/index.js"
    },
    "./styles/*.css": "./dist/styles/*.css",
    "./package.json": "./package.json"
  },
  "typesVersions": {
    "*": {
      "components": ["./dist/components/index.d.ts"],
      "hooks": ["./dist/hooks/index.d.ts"]
    }
  }
}
```

### 脚本配置

```json
{
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist node_modules .turbo",
    "prepack": "pnpm build",
    "prepublishOnly": "pnpm test && pnpm build"
  }
}
```

### 依赖配置

```json
{
  "dependencies": {
    "@org/utils": "workspace:*",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@org/config-typescript": "workspace:*",
    "@org/config-eslint": "workspace:*",
    "@types/node": "^20.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "peerDependenciesMeta": {
    "react-dom": {
      "optional": true
    }
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

## 文件组织规范

### 索引文件模式

```typescript
// src/index.ts - 包的主入口
export * from './components'
export * from './hooks'
export * from './utils'
export type * from './types'

// src/components/index.ts - 组件统一导出
export { Button } from './Button'
export { Input } from './Input'
export { Select } from './Select'
```

### 桶式导出模式

```typescript
// src/components/Button/index.ts
export { Button } from './Button'
export type { ButtonProps } from './Button.types'
export { buttonVariants } from './Button.styles'
```

### 命名导出 vs 默认导出

```typescript
// ✅ 推荐：命名导出
export const Button = () => {}
export type ButtonProps = {}

// ❌ 避免：默认导出（在库包中）
export default Button
```

## 构建配置规范

### tsup 配置

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  minify: process.env.NODE_ENV === 'production'
})
```

### TypeScript 配置

```json
// tsconfig.json
{
  "extends": "@org/config-typescript/base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "declarationDir": "./dist",
    "composite": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules", "**/*.test.ts"]
}
```

## 包边界设计

### 职责边界

| 原则 | 说明 | 示例 |
|------|------|------|
| **单一职责** | 每个包只负责一个领域 | UI 包不包含业务逻辑 |
| **依赖方向** | 只能依赖更底层的包 | 应用→功能→基础 |
| **接口稳定** | 公开 API 保持稳定 | 使用语义化版本 |
| **最小暴露** | 只导出必要的接口 | 内部实现不导出 |

### 反模式识别

❌ **循环依赖**
```
packages/ui → packages/utils → packages/ui
```

❌ **跨层依赖**
```
configs/eslint → apps/web （配置包不应依赖应用）
```

❌ **过度耦合**
```
packages/feature-a 直接导入 packages/feature-b 的内部文件
```

## 版本管理规范

### 版本号规则

```json
{
  "version": "1.2.3-beta.4"
  //         │ │ │   │    │
  //         │ │ │   │    └── 预发布版本号
  //         │ │ │   └──────── 预发布标签
  //         │ │ └──────────── 补丁版本
  //         │ └────────────── 次版本
  //         └──────────────── 主版本
}
```

### 版本策略

| 包类型 | 版本策略 | 发布频率 |
|--------|---------|----------|
| **应用包** | 独立版本 | 按需发布 |
| **库包** | 语义化版本 | 定期发布 |
| **配置包** | 锁定版本 | 稳定后少改 |
| **类型包** | 同步版本 | 跟随 API 变化 |

## 文档规范

### README 模板

```markdown
# @org/package-name

包的简短描述

## 安装

\`\`\`bash
pnpm add @org/package-name
\`\`\`

## 使用

\`\`\`typescript
import { Component } from '@org/package-name'
\`\`\`

## API

### Component

描述组件功能

## 开发

\`\`\`bash
pnpm dev    # 开发模式
pnpm build  # 构建
pnpm test   # 测试
\`\`\`

## License

MIT
```

### API 文档

使用 TSDoc 注释：

```typescript
/**
 * Button 组件
 * @param props - 组件属性
 * @returns React 元素
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export function Button(props: ButtonProps) {
  // ...
}
```

## 测试规范

### 测试文件位置

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx      # 单元测试
│   │   └── Button.e2e.tsx       # E2E 测试
```

### 测试配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/']
    }
  }
})
```

## 最佳实践

### DO - 推荐做法

✅ **明确的包边界**
- 每个包有清晰的职责
- 导出接口稳定且文档完善
- 依赖关系单向且清晰

✅ **一致的结构**
- 所有包遵循相同的目录结构
- 统一的命名规范
- 共享的配置基础

✅ **完善的类型**
- 所有导出都有类型定义
- 使用 TypeScript 严格模式
- 导出类型与实现分离

### DON'T - 避免做法

❌ **过度拆分**
- 不要为几行代码创建包
- 避免过细的功能划分
- 防止包数量爆炸

❌ **紧耦合**
- 避免包之间的循环依赖
- 不要直接引用内部文件
- 防止隐式依赖

❌ **版本混乱**
- 避免随意的版本号
- 不要忽视破坏性变更
- 防止版本不兼容

## 迁移指南

### 从单体应用拆分

1. **识别边界**：分析代码，找出独立模块
2. **提取通用代码**：创建基础库包
3. **分离业务模块**：按功能创建包
4. **建立依赖关系**：使用 workspace 协议
5. **逐步迁移**：保持应用可运行

### 包的合并与拆分

**何时合并**：
- 包之间频繁共同修改
- 职责界限模糊
- 维护成本高于收益

**何时拆分**：
- 包变得过大（>1000 行）
- 职责不再单一
- 需要独立版本管理

---

## 参考资源

- [Node.js Package Exports](https://nodejs.org/api/packages.html#package-entry-points) - 包导出规范
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) - 项目引用
- [tsup](https://tsup.egoist.dev/) - 打包工具文档

---

*记住：好的包结构是清晰的职责划分和稳定的接口设计的结果。*