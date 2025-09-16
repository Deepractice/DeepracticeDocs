---
layer: Practice
type: Reference
title: Monorepo 架构标准
category: node-development-environment/monorepo
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - Monorepo
  - 架构设计
  - 多包管理
  - 最佳实践

purpose: 定义 Monorepo 架构的选型标准和设计原则
scope:
  includes:
    - Monorepo vs Polyrepo 决策标准
    - 架构模式和组织方式
    - 工具链选型标准
    - 最佳实践和反模式
  excludes:
    - 具体工具配置细节  # → 见各工具配置文档
    - 迁移实施步骤  # → 见 how-to 指南
outcome:
  - 能正确判断是否需要 Monorepo
  - 能选择合适的架构模式
  - 能避免常见的设计陷阱
---

# Monorepo 架构标准

## 概述

Monorepo（单一代码仓库）是一种将多个项目或包存放在同一个版本控制仓库中的软件开发策略。本标准定义了 Monorepo 的选型标准、架构模式和最佳实践。

## 核心概念

### Monorepo 定义

| 特征 | 说明 |
|------|------|
| **单一仓库** | 所有代码在一个 Git 仓库中 |
| **统一版本控制** | 共享版本历史和分支策略 |
| **原子提交** | 跨项目的更改可以在一次提交中完成 |
| **共享依赖** | 依赖项可以在项目间共享和复用 |
| **统一工具链** | 使用相同的构建、测试、部署工具 |

### 与 Polyrepo 对比

| 维度 | Monorepo | Polyrepo |
|------|----------|----------|
| **代码组织** | 所有代码在一个仓库 | 每个项目独立仓库 |
| **版本管理** | 统一版本，原子提交 | 独立版本，分散提交 |
| **依赖管理** | 内部依赖直接引用 | 通过包管理器发布 |
| **构建复杂度** | 需要智能构建系统 | 构建相对简单 |
| **权限控制** | 需要目录级权限 | 仓库级权限控制 |
| **CI/CD** | 需要优化的流水线 | 独立的流水线 |

## 选型决策标准

### 适合 Monorepo 的场景

✅ **强烈推荐**：
- 多个项目共享大量代码
- 需要频繁的跨项目重构
- 团队规模适中（5-50人）
- 项目间有紧密的依赖关系
- 需要统一的质量标准

✅ **推荐考虑**：
- 微服务架构但服务间耦合较高
- 前后端代码需要同步开发
- 组件库和应用需要协同开发
- 需要端到端的类型安全

### 不适合 Monorepo 的场景

❌ **不推荐**：
- 项目间完全独立，无代码共享
- 团队分布在不同时区且沟通困难
- 代码库已经超过 100GB
- 需要严格的代码访问隔离
- 团队对 Monorepo 工具不熟悉

⚠️ **谨慎考虑**：
- 开源项目需要独立贡献者
- 不同技术栈且无法统一工具链
- 构建时间已经成为瓶颈
- 团队规模超过 100 人

## 架构模式

### 1. 应用集合型（Apps Collection）

```
monorepo/
├── apps/
│   ├── web/          # Web 应用
│   ├── mobile/       # 移动应用
│   └── admin/        # 管理后台
├── packages/         # 共享包
└── tools/           # 工具链
```

**特点**：
- 多个独立应用共享代码
- 适合产品矩阵型公司
- 便于代码复用

### 2. 库集合型（Libraries Collection）

```
monorepo/
├── packages/
│   ├── core/        # 核心库
│   ├── ui/          # UI 组件库
│   ├── utils/       # 工具库
│   └── sdk/         # SDK
└── examples/        # 示例项目
```

**特点**：
- 专注于库的开发和维护
- 适合开源项目或平台型产品
- 便于版本管理和发布

### 3. 微服务型（Microservices）

```
monorepo/
├── services/
│   ├── auth/        # 认证服务
│   ├── user/        # 用户服务
│   └── payment/     # 支付服务
├── libs/            # 共享库
└── infra/          # 基础设施
```

**特点**：
- 多个微服务共存
- 便于服务间接口同步
- 适合中小规模微服务架构

### 4. 全栈型（Full-Stack）

```
monorepo/
├── apps/
│   ├── frontend/    # 前端应用
│   └── backend/     # 后端服务
├── packages/
│   ├── shared/      # 共享类型和工具
│   └── config/      # 共享配置
└── database/        # 数据库 schema
```

**特点**：
- 前后端代码在一起
- 类型安全跨前后端
- 适合全栈团队

## 工具链选型

### 包管理器选择

| 工具 | 优势 | 劣势 | 推荐场景 |
|------|------|------|----------|
| **pnpm** | 磁盘空间效率高、严格依赖 | 生态兼容性 | ⭐ 新项目首选 |
| **yarn** | 生态成熟、workspace 稳定 | 性能一般 | 兼容性要求高 |
| **npm** | 原生支持、无需额外工具 | workspace 功能弱 | 简单项目 |

### 构建工具选择

| 工具 | 特点 | 适用场景 |
|------|------|----------|
| **Turborepo** | 智能缓存、并行构建 | ⭐ Node.js 项目首选 |
| **Nx** | 功能强大、插件丰富 | 大型企业项目 |
| **Rush** | 微软出品、企业级 | 大型团队 |
| **Lerna** | 轻量、专注发布 | 简单的包管理 |

### 推荐技术栈

```yaml
基础设施:
  包管理: pnpm
  构建工具: Turborepo
  版本管理: Changesets

开发工具:
  语言: TypeScript
  格式化: Prettier
  检查: ESLint
  测试: Vitest

工程化:
  打包: Vite/tsup
  文档: VitePress
  CI/CD: GitHub Actions
```

## 目录结构标准

### 标准结构

```
monorepo/
├── apps/                 # 应用程序
│   └── [app-name]/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── packages/            # 共享包
│   └── [package-name]/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── configs/             # 共享配置
│   ├── eslint/
│   ├── prettier/
│   └── typescript/
├── tools/              # 工具脚本
├── docs/               # 文档
├── .changeset/         # 版本管理
├── pnpm-workspace.yaml # Workspace 配置
├── turbo.json         # Turborepo 配置
└── package.json       # 根配置
```

### 命名规范

| 类型 | 命名模式 | 示例 |
|------|----------|------|
| **应用** | `@org/app-*` | `@deepractice/app-web` |
| **包** | `@org/*` | `@deepractice/ui` |
| **配置** | `@org/config-*` | `@deepractice/config-eslint` |
| **工具** | `@org/tool-*` | `@deepractice/tool-build` |

## 最佳实践

### 依赖管理

✅ **推荐做法**：
- 共享依赖提升到根目录
- 使用 workspace 协议引用内部包
- 统一关键依赖的版本
- 定期更新和审计依赖

❌ **避免做法**：
- 内部包之间循环依赖
- 不同包使用冲突版本
- 过度的依赖提升
- 忽视 peer dependencies

### 构建优化

✅ **推荐做法**：
- 启用增量构建
- 配置智能缓存
- 并行执行任务
- 只构建变更影响的包

❌ **避免做法**：
- 每次都全量构建
- 忽视构建顺序依赖
- 缓存配置不当
- 构建产物未隔离

### 版本发布

✅ **推荐做法**：
- 使用 Changesets 管理版本
- 自动生成 CHANGELOG
- 统一发布流程
- 语义化版本控制

❌ **避免做法**：
- 手动修改版本号
- 忽视破坏性变更
- 发布未经测试的版本
- 版本号不规范

## 常见问题和解决方案

### 问题 1：构建时间过长

**症状**：
- 全量构建超过 10 分钟
- CI 经常超时

**解决方案**：
```json
// turbo.json
{
  "pipeline": {
    "build": {
      "cache": true,
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    }
  }
}
```

### 问题 2：依赖版本冲突

**症状**：
- 不同包需要同一依赖的不同版本
- 构建或运行时错误

**解决方案**：
```yaml
# .pnpmfile.cjs
module.exports = {
  hooks: {
    readPackage(pkg) {
      // 统一版本
      if (pkg.dependencies['react']) {
        pkg.dependencies['react'] = '^18.0.0'
      }
      return pkg
    }
  }
}
```

### 问题 3：类型定义不同步

**症状**：
- 修改共享类型后其他包报错
- TypeScript 编译失败

**解决方案**：
```json
// tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declarationMap": true
  },
  "references": [
    { "path": "../shared" }
  ]
}
```

## 迁移策略

### 从 Polyrepo 迁移

1. **评估阶段**：
   - 分析代码依赖关系
   - 评估共享代码量
   - 确定迁移优先级

2. **准备阶段**：
   - 搭建 Monorepo 基础设施
   - 配置工具链
   - 制定迁移计划

3. **迁移阶段**：
   - 逐个迁移项目
   - 保持历史记录
   - 更新 CI/CD

4. **优化阶段**：
   - 提取共享代码
   - 优化构建流程
   - 完善工具链

## 度量指标

### 关键指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| **增量构建时间** | < 2分钟 | 单个包修改后的构建时间 |
| **全量构建时间** | < 10分钟 | 从零开始的完整构建 |
| **缓存命中率** | > 80% | CI 中的缓存命中率 |
| **依赖安装时间** | < 3分钟 | 清空缓存后的安装时间 |
| **代码复用率** | > 30% | 共享代码占比 |

### 监控建议

- 使用 Turborepo 的分析工具
- 监控 CI 构建时间趋势
- 跟踪包的依赖关系复杂度
- 定期审查代码复用情况

## 工具对比矩阵

| 特性 | Turborepo | Nx | Rush | Lerna |
|------|-----------|----|----|--------|
| **增量构建** | ✅ | ✅ | ✅ | ⚠️ |
| **远程缓存** | ✅ | ✅ | ✅ | ❌ |
| **并行执行** | ✅ | ✅ | ✅ | ✅ |
| **依赖图分析** | ✅ | ✅ | ✅ | ⚠️ |
| **插件生态** | ⚠️ | ✅ | ⚠️ | ⚠️ |
| **学习曲线** | 低 | 高 | 中 | 低 |
| **社区活跃度** | 高 | 高 | 中 | 中 |

---

## 参考资源

- [Monorepo.tools](https://monorepo.tools/) - Monorepo 工具对比
- [Turborepo Docs](https://turbo.build/repo/docs) - Turborepo 官方文档
- [pnpm Workspace](https://pnpm.io/workspaces) - pnpm 工作区文档
- [Changesets](https://github.com/changesets/changesets) - 版本管理工具

---

*记住：Monorepo 不是银弹，选择它要基于实际需求而非技术时髦。*