---
layer: Practice
type: Index
title: Monorepo 实践指南
category: node-development-environment/monorepo
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - Monorepo
  - pnpm workspace
  - Turborepo
  - 多包管理

# 目录级 PSO
purpose: 实现大型项目的多包架构和高效协作
scope:
  progression:  # 有状态的配置过程
    1. 架构理解：理解 Monorepo 的价值和架构模式
    2. Workspace 配置：基于1配置 pnpm workspace
    3. 包结构设计：基于2创建标准化的包结构
    4. 依赖管理：基于3配置包间依赖关系
    5. 任务编排：基于4使用 Turborepo 优化构建
    6. 版本管理：基于5实现统一的版本发布
outcome:
  - 掌握 Monorepo 架构设计和实施
  - 能够高效管理多包项目
  - 实现并行构建和智能缓存
---

## 概述

本目录包含 Monorepo 架构设计、工具配置和最佳实践的完整指南。

## 文档列表

- [Monorepo 架构标准](./monorepo-standard.md) - 架构设计和选型标准
- [如何搭建 Monorepo](./how-to-setup-monorepo.md) - 从零开始的实施指南
- [pnpm Workspace 配置规范](./pnpm-workspace-standard.md) - Workspace 配置标准
- [包结构设计标准](./package-structure-standard.md) - 包的标准结构和组织方式
- [包依赖管理指南](./package-dependencies-guide.md) - 包间依赖和版本管理
- [Turborepo 配置指南](./turborepo-configuration.md) - 任务编排和缓存优化
- [版本发布管理指南](./version-management-guide.md) - 版本管理和自动化发布