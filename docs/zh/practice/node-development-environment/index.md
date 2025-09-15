---
layer: Practice
type: Index
title: Node.js 开发环境规范
category: node-development-environment
status: published
version: 2.0.0
date: 2025-01-14
author: Sean Jiang & Claude
tags:
  - Node.js
  - TypeScript
  - 开发环境
  - 工具链
  - 最佳实践

# 目录级 PSO
purpose: 提供 Node.js/TypeScript 项目的标准化开发环境配置
scope:
  progression:  # 有状态的配置过程
    1. 技术选型决策：选择技术栈和工具链
    2. Node.js 基础环境：基于1的选型配置运行时
    3. 项目结构初始化：基于2创建项目基础结构
    4. Monorepo 组织：基于3设置多包项目结构（如需要）
    5. TypeScript 配置：基于4添加类型系统和编译配置
    6. 代码质量工具：基于5添加 ESLint、Prettier
    7. 测试框架：基于6添加 Vitest、测试覆盖率
    8. 构建工具链：基于7添加 Turborepo、Vite 等
    9. 自动化流程：基于8添加 CI/CD、Git hooks
    10. 开发体验优化：基于9完善 VSCode 配置
outcome:
  - 获得一个完整配置的 Node.js/TypeScript 开发环境
  - 每个配置步骤都可验证和测试
  - 团队能立即开始业务开发
---
# Node.js 开发环境规范

## 概述

本目录包含 Node.js/TypeScript 开发环境相关的标准和最佳实践。

## 文档列表

- [技术选型标准](./technology-selection/) - 技术栈选择约束
- [Node.js 环境标准](./nodejs/) - 运行时配置规范
- [项目初始化](./initialization/) - 项目脚手架和模板
- [Monorepo 实践指南](./monorepo/) - 多包项目管理
- [TypeScript 开发规范](./typescript/) - 类型系统配置
- [代码检查标准](./linting/) - ESLint 和 Prettier 配置
- [测试框架配置](./testing/) - 测试策略和工具
- [构建工具链](./toolchain/) - Turborepo、Vite 等构建工具
- [自动化流程](./automation/) - CI/CD、Git hooks
- [VSCode 配置优化](./vscode/) - 编辑器配置
