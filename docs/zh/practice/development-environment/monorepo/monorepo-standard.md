---
layer: Practice
type: Reference
title: Monorepo 基础架构规范
category: development-environment
status: published
version: 1.1.0
date: 2025-01-14
author: Sean Jiang & Claude
tags:
  - Monorepo
  - pnpm
  - Turborepo
  - 开发环境
purpose: 定义 Monorepo 项目的基础架构标准和技术选型
scope:
  includes:
    - 核心技术栈选择（pnpm、Turborepo、TypeScript）
    - 项目目录组织原则
    - 工作区配置规范
    - 任务编排基础
  excludes:
    - 具体配置文件内容（→ monorepo-configuration.md）
    - 初始化操作步骤（→ how-to-initialize-monorepo.md）
    - 架构设计理念（→ understanding-monorepo-architecture.md）
outcome:
  - 理解 Monorepo 的技术栈选择理由
  - 掌握项目结构组织原则
  - 能够做出架构决策
dependencies:
  - /zh/practice/development-environment/nodejs-setup
related:
  - ./monorepo-configuration.md
  - ./understanding-monorepo-architecture.md
---

# Monorepo 基础架构规范

## 概述

本规范定义 Monorepo 项目的基础架构标准，提供零业务、纯技术的项目模板，确保多包项目的一致性和可维护性。

## 核心原则

| 原则 | 说明 | 实践要求 |
|------|------|----------|
| **最小化原则** | 只包含必要的基础设施 | 避免过度工程化，保持配置简洁 |
| **标准化原则** | 统一项目结构和工具链 | 一致的开发流程，规范的包管理 |
| **可扩展原则** | 支持渐进式扩展 | 便于添加新包，灵活的任务编排 |
| **性能优先** | 构建和开发效率至上 | 智能缓存，并行执行，增量构建 |

## 技术栈规范

### 核心技术选型

| 技术 | 工具 | 版本要求 | 用途 |
|------|------|----------|------|
| **包管理器** | pnpm | ≥8.0.0 | 高效依赖管理和 workspace 支持 |
| **任务编排** | Turborepo | 最新稳定版 | 智能缓存和并行执行 |
| **构建工具** | tsup | 最新稳定版 | 零配置的 TypeScript 构建 |
| **类型系统** | TypeScript | ≥5.0.0 | 类型安全和开发体验 |
| **Git Hooks** | Lefthook | 最新稳定版 | 轻量级的 Git 钩子管理 |
| **测试框架** | Vitest | 最新稳定版 | 快速的单元测试 |
| **代码规范** | ESLint + Prettier | 最新稳定版 | 代码质量保障 |

### 选型原则

- 优先选择零配置或低配置方案
- 确保工具之间的良好集成
- 考虑社区活跃度和维护状况
- 平衡功能完整性和学习成本

## 项目结构规范

### 推荐目录结构

```
my-monorepo/
├── apps/                    # 应用程序目录
├── packages/               # 共享包目录
├── services/              # 后端服务目录（可选）
├── configs/              # 共享配置目录（可选）
├── tools/               # 工具脚本目录（可选）
├── package.json        # 根包配置
├── pnpm-workspace.yaml # 工作区配置
├── turbo.json         # Turborepo 配置
└── [其他配置文件]     # 根据项目需要
```

**重要说明**：子目录的具体组织（如 `apps/web`、`packages/ui` 等）应由项目团队根据实际业务需求决定，这里仅提供顶层目录的组织建议。

### 目录职责说明

| 目录 | 职责 | 包命名规范 | 示例 |
|------|------|------------|------|
| `apps/` | 独立应用程序 | `@org/app-*` | `@myproject/web-app` |
| `packages/` | 共享代码包 | `@org/*` | `@myproject/utils` |
| `services/` | 后端服务 | `@org/service-*` | `@myproject/api-service` |
| `configs/` | 配置文件 | `@org/config-*` | `@myproject/config-typescript` |
| `tools/` | 开发工具 | `@org/tool-*` | `@myproject/tool-scripts` |

## 配置文件规范

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
  - 'configs/*'
  - 'tools/*'
```

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"],
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
      "cache": false
    },
    "lint": {
      "outputs": [],
      "cache": true
    },
    "type-check": {
      "outputs": [],
      "cache": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

### 根 package.json

```json
{
  "name": "my-monorepo",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "node": ">=18.19.0",
    "pnpm": ">=8.0.0"
  },
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules",
    "fresh": "pnpm clean && pnpm install",
    "prepare": "lefthook install"
  }
}
```

## 命令规范

### 标准命令集

| 命令 | 用途 | 必需性 | 实现要求 |
|------|------|--------|----------|
| `dev` | 开发模式 | 必需 | 支持热更新 |
| `build` | 构建生产版本 | 必需 | 输出优化后的代码 |
| `test` | 运行测试 | 必需 | 包含单元测试 |
| `lint` | 代码检查 | 必需 | ESLint 规则 |
| `type-check` | 类型检查 | 必需 | TypeScript 严格模式 |
| `clean` | 清理构建产物 | 建议 | 删除 dist 和缓存 |
| `test:coverage` | 测试覆盖率 | 可选 | 生成覆盖率报告 |
| `build:analyze` | 构建分析 | 可选 | Bundle 大小分析 |

### 命名约定

```json
{
  "scripts": {
    // 主命令：简洁的动词
    "build": "tsup",
    "test": "vitest run",
    
    // 子命令：使用冒号分隔
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    
    // 避免使用
    // ❌ "testWatch" - 驼峰命名
    // ❌ "test_watch" - 下划线分隔
  }
}
```

## 依赖管理规范

### 依赖分类原则

| 类型 | 安装位置 | 说明 | 示例 |
|------|----------|------|------|
| **开发工具** | 根目录 | 全局共享的开发依赖 | TypeScript, ESLint, Prettier |
| **构建工具** | 根目录 | 构建相关工具 | Turborepo, tsup, Vite |
| **内部依赖** | 各包 | workspace 协议引用 | `workspace:*` |
| **外部依赖** | 各包 | 包特定的依赖 | React, Express |
| **Peer 依赖** | 库包 | 由使用方提供 | React (for UI库) |

### 版本管理策略

```json
{
  "pnpm": {
    "overrides": {
      // 统一关键依赖版本
      "typescript": "^5.3.3",
      "react": "^18.2.0"
    },
    "peerDependencyRules": {
      "ignoreMissing": ["@types/react"]
    }
  }
}
```

## 质量保障

### 代码质量门禁

| 检查项 | 工具 | 执行时机 | 通过标准 |
|--------|------|----------|----------|
| 格式化 | Prettier | pre-commit | 100% 格式正确 |
| 代码规范 | ESLint | pre-commit | 0 errors |
| 类型检查 | TypeScript | pre-commit | 0 类型错误 |
| 单元测试 | Vitest | pre-push | 测试通过 |
| 测试覆盖率 | Vitest | CI | ≥80% |
| 构建检查 | Turborepo | pre-push | 构建成功 |

### Git Hooks 配置

```yaml
# lefthook.yml
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
      run: pnpm type-check

commit-msg:
  commands:
    validate:
      run: |
        grep -qE "^(feat|fix|docs|style|refactor|test|chore):" {1} || {
          echo "提交信息必须以 feat|fix|docs|style|refactor|test|chore 开头"
          exit 1
        }
```

## 性能优化

### 构建优化策略

| 策略 | 实现方式 | 效果 |
|------|----------|------|
| **增量构建** | TypeScript 项目引用 | 只构建变更部分 |
| **并行执行** | Turborepo 任务编排 | 多核并行处理 |
| **智能缓存** | Turborepo 缓存机制 | 跳过未变更任务 |
| **依赖优化** | pnpm 硬链接 | 减少磁盘占用 |
| **Tree Shaking** | ESM + tsup | 删除无用代码 |

### 开发体验优化

| 优化项 | 实现方式 | 效果 |
|--------|----------|------|
| **热更新** | Vite/tsup watch | 实时预览更改 |
| **类型提示** | TypeScript 路径映射 | 自动补全 |
| **并发开发** | Turborepo dev | 同时启动多服务 |
| **错误提示** | ESLint + VSCode | 实时错误反馈 |

## 适用范围

### 推荐使用场景

- 前后端共享代码的全栈项目
- 组件库和工具库的开发
- 微服务架构的项目
- 插件系统的开发
- SDK 和 CLI 工具开发

### 不适用场景

- 单一简单应用
- 临时原型项目
- 学习示例项目

## 迁移指南

### 现有项目迁移步骤

1. 评估项目结构和依赖关系
2. 创建 workspace 配置
3. 迁移共享代码到 packages
4. 配置 Turborepo 任务
5. 设置 Git Hooks
6. 验证构建和测试

### 迁移检查清单

- [ ] 所有包使用统一的命名空间
- [ ] 内部依赖使用 workspace 协议
- [ ] 配置文件放置在 configs 目录
- [ ] 实现标准命令集
- [ ] Git Hooks 正常工作
- [ ] 构建缓存生效

## 常见问题

### 技术问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 幽灵依赖 | Node 模块解析机制 | 使用 `shamefully-hoist: false` |
| 循环依赖 | 包之间相互引用 | 使用 dpdm 工具检测 |
| 缓存失效 | 输入文件未正确配置 | 检查 turbo.json 的 inputs |
| 热更新失效 | 监听配置错误 | 确保 watch 模式配置正确 |

### 性能问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 构建缓慢 | 未使用缓存 | 启用 Turborepo 缓存 |
| 安装缓慢 | 重复下载包 | 配置 pnpm store |
| 类型检查慢 | 全量检查 | 使用项目引用增量检查 |

---

## 参考资源

- [pnpm Workspace](https://pnpm.io/workspaces) - pnpm 工作区文档
- [Turborepo Docs](https://turbo.build/repo/docs) - Turborepo 官方文档
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) - TypeScript 项目引用
- [tsup](https://tsup.egoist.dev/) - 零配置构建工具

---

*记住：Monorepo 不是目的，而是提升开发效率和代码复用的手段。*