---
layer: Practice
type: Index
title: Node.js 环境标准
category: nodejs-environment
status: published
version: 1.0.0
date: 2025-01-14
author: Sean Jiang & Claude
tags:
  - Node.js
  - 环境配置
  - 版本管理
  - 标准化

# 目录级 PSO
purpose: 为组织成员提供 Node.js 运行环境的统一配置标准，确保环境一致性
scope:
  includes:
    - Node.js 版本选择和管理策略
    - 环境变量的标准化配置
    - npm/pnpm 配置规范
    - 全局工具的标准清单
    - 运行时参数优化
    - 多环境配置方案
  excludes:
    - 具体项目的业务配置  # 属于项目自身
    - IDE 配置  # 属于编辑器规范
    - 容器化配置  # 属于 DevOps 领域
outcome:
  - 所有成员使用一致的 Node.js 环境
  - 避免"在我机器上能跑"的问题
  - 新成员 10 分钟内完成环境配置
  - AI 能准确理解和辅助环境问题
---

# Node.js 环境标准

## 概述

本目录定义了 Deepractice 组织内 Node.js 运行环境的标准配置，确保所有开发者（人类和 AI）在一致的环境下工作，消除环境差异带来的问题。

## 核心原则

- **LTS 优先**：始终使用 Node.js LTS 版本
- **版本一致**：团队使用相同的 Node.js 版本
- **配置统一**：标准化的环境变量和配置
- **工具精简**：只安装必要的全局工具
- **易于切换**：支持多版本共存和切换

## 目录结构

```
nodejs/
├── index.md                           # 本文件
├── nodejs-version-standard.md         # Node.js 版本管理标准
├── nodejs-configuration-standard.md   # Node.js 配置标准
├── npm-configuration-standard.md      # npm/pnpm 配置标准
├── global-tools-standard.md          # 全局工具安装标准
└── how-to-setup-nodejs.md           # 如何配置 Node.js 环境
```

## 核心文档

### 版本管理
- Node.js 版本管理标准 `Reference` - 即将创建
- 如何配置 Node.js 环境 `How-to` - 即将创建

### 配置规范
- Node.js 配置标准 `Reference` - 即将创建
- npm/pnpm 配置标准 `Reference` - 即将创建
- 全局工具安装标准 `Reference` - 即将创建

## 快速开始

### 1. 版本选择

当前标准版本：
- **生产环境**：Node.js 20.x LTS
- **开发环境**：Node.js 20.x LTS
- **实验性项目**：可使用 Node.js 22.x

### 2. 版本管理工具

推荐使用：
- **macOS/Linux**：[fnm](https://github.com/Schniz/fnm)（更快）或 [nvm](https://github.com/nvm-sh/nvm)
- **Windows**：[fnm](https://github.com/Schniz/fnm) 或 [nvm-windows](https://github.com/coreybutler/nvm-windows)

### 3. 基础配置

```bash
# .nvmrc 或 .node-version
20.11.0

# 环境变量
NODE_ENV=development
NODE_OPTIONS="--max-old-space-size=4096"
```

### 4. 包管理器配置

```bash
# 使用淘宝镜像（可选）
npm config set registry https://registry.npmmirror.com

# pnpm 配置
pnpm config set store-dir ~/.pnpm-store
```

## 标准清单

### 必需配置

- [ ] 安装 Node.js LTS 版本
- [ ] 配置版本管理工具（nvm/fnm）
- [ ] 创建 .nvmrc 文件
- [ ] 配置 npm registry
- [ ] 安装 pnpm

### 推荐配置

- [ ] 配置 NODE_OPTIONS
- [ ] 设置全局 npm prefix
- [ ] 配置 npm 缓存目录
- [ ] 安装常用全局工具

### 验证步骤

```bash
# 检查版本
node --version  # 应该是 20.x.x
npm --version   # 应该是 10.x.x
pnpm --version  # 应该是 8.x.x

# 检查配置
npm config get registry
pnpm config get store-dir
```

## 常见问题

### 版本不一致

**问题**：团队成员使用不同的 Node.js 版本
**解决**：强制使用 .nvmrc 并在 CI 中检查

### 包安装失败

**问题**：npm install 速度慢或失败
**解决**：使用国内镜像或 pnpm

### 内存溢出

**问题**：构建时出现 heap out of memory
**解决**：配置 NODE_OPTIONS 增加内存限制

## 迁移指南

从非标准环境迁移：

1. **备份当前配置**
2. **卸载全局包**（记录必要的）
3. **安装版本管理工具**
4. **按标准重新配置**
5. **验证环境一致性**

## 维护要求

- 每次 Node.js LTS 更新时评估升级
- 定期审查全局工具清单
- 收集环境相关问题并更新标准
- 保持与业界最佳实践同步

## 相关资源

### 上层规范
- [Node.js 开发环境规范](../index.md) - 整体开发环境标准

### 相关规范
- [TypeScript 配置标准](../typescript/) - TypeScript 环境配置
- [Monorepo 标准](../monorepo/) - 多包项目组织

### 外部资源
- [Node.js 官方文档](https://nodejs.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [npm 文档](https://docs.npmjs.com/)
- [pnpm 文档](https://pnpm.io/)

---

*记住：统一的环境是高效协作的基础。*