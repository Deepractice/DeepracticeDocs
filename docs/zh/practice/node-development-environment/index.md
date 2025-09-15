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
    1. Node.js 基础环境：运行时版本、包管理器配置
    2. TypeScript 配置：基于1添加类型系统和编译配置
    3. ESModule 系统：基于2配置模块解析和路径映射
    4. 代码质量工具：基于3添加 ESLint、Prettier、测试框架
    5. Monorepo 组织：基于4升级为多包项目结构
    6. 构建工具链：基于5添加 Turborepo、Vite 等构建工具
    7. 自动化流程：基于6添加 CI/CD、Git hooks
    8. 开发体验优化：基于7完善 VSCode 配置和文档
outcome:
  - 获得一个完整配置的 Node.js/TypeScript 开发环境
  - 每个配置步骤都可验证和测试
  - 团队能立即开始业务开发
---
# Node.js 开发环境规范

## 概述

本目录包含 Node.js/TypeScript 开发环境相关的标准和最佳实践。

## 文档列表

- [项目初始化](./initialization/) - 项目脚手架和模板
- [Node.js 环境标准](./nodejs/) - 运行时配置规范
- [TypeScript 开发规范](./typescript/) - 类型系统配置
- [代码检查标准](./linting/) - ESLint 和 Prettier 配置
- [测试框架配置](./testing/) - 测试策略和工具
- [Monorepo 实践指南](./monorepo/) - 多包项目管理
- [包管理策略](./package-management/) - 依赖管理规范
- [工具链集成](./toolchain/) - 构建和自动化工具
- [VSCode 配置优化](./vscode/) - 编辑器配置
