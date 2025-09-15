---
layer: Practice
type: Index
title: 项目初始化规范
category: node-development-environment/initialization
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - 项目初始化
  - 脚手架
  - 工程化配置
  - 快速启动

# 目录级 PSO
purpose: 实现 Monorepo 项目脚手架和初始化模板，作为父级 PSO 中"项目初始化"部分的具体落地
scope:
  includes:
    - Monorepo 项目初始化流程和模板
    - 标准目录结构创建
    - 初始配置文件模板
    - 工程化工具链配置
    - 快速启动验证流程
  excludes:
    - 具体业务逻辑实现
    - 特定框架使用（React/Vue/Nest）
    - 部署平台特定配置（AWS/阿里云）
    - 其他类型项目初始化（单体、微服务等）
outcome:
  - 10 分钟内完成项目基础架构搭建
  - 所有工程化配置自动就位
  - 团队成员可立即开始业务开发
  - 避免重复的配置工作
---

# 项目初始化规范

## 概述

项目初始化是软件开发的第一步，但往往也是最容易被忽视的环节。一个良好的初始化流程可以：
- 节省大量配置时间
- 确保项目质量从一开始就有保障
- 统一团队的开发标准
- 降低新成员的上手成本

## 核心理念

### 🎯 一次配置，永久受益
不要让每个项目都重复相同的配置工作。标准化的初始化流程让团队专注于业务价值。

### ⚡ 快速启动
目标是 10 分钟内完成从零到可开发状态，包括所有必要的工具链配置。

### 📦 开箱即用
初始化完成后，所有工程化能力应该立即可用：
- 代码检查就绪
- 测试框架配置完成
- Git hooks 自动安装
- 构建流程可运行

## 项目类型

### Monorepo 项目
本目录专注于 Monorepo 项目的初始化，适用于：
- 多包管理场景
- 前后端一体化项目
- 组件库开发
- 微服务架构

**核心特点**：
- 统一的依赖管理
- 共享的配置和工具
- 包之间的高效协作
- 代码复用最大化

**相关文档**：
- [如何初始化 Monorepo 项目](./monorepo-scaffold.md) `How-to` - 完整的步骤指南

## 标准目录结构

### Monorepo 结构
```
project-root/
├── apps/              # 前端应用
│   └── web/          # 主 Web 应用
├── services/         # 后端服务
│   └── api/          # API 服务
├── packages/         # 共享包
│   ├── ui/          # UI 组件库
│   ├── utils/       # 工具函数
│   └── types/       # 类型定义
├── docs/            # 项目文档
├── scripts/         # 构建脚本
└── [配置文件]       # 各种配置
```

### 配置文件清单
```
.
├── package.json          # 项目元数据
├── pnpm-workspace.yaml   # Workspace 配置
├── tsconfig.base.json    # TypeScript 基础配置
├── tsconfig.json         # TypeScript 根配置
├── turbo.json           # Turborepo 配置
├── vitest.config.ts     # 测试配置
├── eslint.config.js     # 代码检查配置
├── .prettierrc          # 格式化配置
├── .lefthook.yml        # Git hooks 配置
├── commitlint.config.js # 提交规范配置
├── .gitignore          # Git 忽略配置
└── README.md           # 项目说明
```

## 工具链选择

### 核心工具

| 工具 | 用途 | 选择理由 |
|------|------|----------|
| **pnpm** | 包管理器 | 速度快、磁盘占用少、原生 workspace 支持 |
| **TypeScript** | 开发语言 | 类型安全、更好的 IDE 支持 |
| **Turborepo** | 构建系统 | 智能缓存、并行构建、增量构建 |
| **Vitest** | 测试框架 | 快速、ESM 原生支持、与 Vite 生态兼容 |
| **ESLint** | 代码检查 | 可扩展、社区生态丰富 |
| **Prettier** | 代码格式化 | 零配置、支持多种语言 |
| **Lefthook** | Git hooks | 快速、并行执行、配置简单 |

### 版本要求

- Node.js >= 20.0.0（LTS 版本）
- pnpm >= 8.15.0
- TypeScript >= 5.3.0

## 初始化流程

### 1. 环境准备
```bash
# 检查 Node.js 版本
node -v  # 应该 >= 20.0.0

# 安装 pnpm
npm install -g pnpm@latest

# 验证安装
pnpm -v
```

### 2. 开始初始化
使用 Monorepo 初始化模板创建项目基础结构。

### 3. 执行初始化
按照对应的 How-to 文档执行初始化步骤。

### 4. 验证配置
运行验证命令确保所有配置正确：
```bash
pnpm install       # 依赖安装
pnpm typecheck    # 类型检查
pnpm lint         # 代码检查
pnpm test         # 测试运行
pnpm build        # 构建验证
```

## 最佳实践

### ✅ 应该做的

1. **立即提交初始化结果**
   ```bash
   git add .
   git commit -m "chore: initialize project structure"
   ```

2. **配置 IDE**
   - 安装推荐的 VSCode 扩展
   - 应用项目的格式化配置

3. **运行一次完整流程**
   - 确保所有命令都能正常工作
   - 发现问题立即修复

### ❌ 不应该做的

1. **跳过验证步骤** - 可能导致后续问题
2. **修改核心配置** - 除非有充分理由
3. **忽略 Git hooks** - 质量保证的第一道防线

## 常见问题

### Q: 为什么选择 pnpm 而不是 npm/yarn？
A: pnpm 提供更快的安装速度、更少的磁盘占用，且对 monorepo 有原生支持。

### Q: 是否必须使用 TypeScript？
A: 强烈推荐。TypeScript 提供的类型安全和 IDE 支持能显著提升开发效率。

### Q: 如何自定义初始化模板？
A: 可以 fork 现有模板并根据需求调整，但建议保持核心工具链不变。

## 演进计划

- [ ] 支持 CLI 工具自动化初始化
- [ ] 优化初始化速度到 5 分钟内
- [ ] 添加初始化后的自动化测试
- [ ] 集成更多工具链选项

## 相关资源

### 内部文档
- [Node.js 开发环境规范](../index.md) - 上层规范
- [Monorepo 实践指南](../monorepo/index.md) - Monorepo 详细说明
- [代码检查标准](../linting/index.md) - Lint 配置详解

### 外部资源
- [pnpm 官方文档](https://pnpm.io)
- [Turborepo 文档](https://turbo.build)
- [Vitest 文档](https://vitest.dev)

---

*记住：好的开始是成功的一半。标准化的初始化流程让每个项目都有最佳起点。*