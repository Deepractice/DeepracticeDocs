---
layer: Practice
type: Reference
title: 项目目录结构标准
category: node-development-environment/initialization
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude

purpose: 定义项目初始化时的标准目录结构
scope:
  includes:
    - 根目录结构
    - 单体项目顶层目录
    - Monorepo 顶层目录
  excludes:
    - 包内部结构
    - 文件命名规范
    - 代码组织方式
outcome:
  - 统一的项目目录结构
  - 清晰的顶层组织
---

# 项目目录结构标准

## 单体项目根目录

```
my-app/
├── .github/              # GitHub 配置
├── docs/                 # 项目文档
├── scripts/              # 构建和工具脚本
├── src/                  # 源代码目录
├── tests/                # 测试目录
├── .editorconfig         # 编辑器配置
├── .gitignore            # Git 忽略文件
├── .nvmrc                # Node 版本
├── .npmrc                # 包管理器配置
├── package.json          # 项目配置
├── pnpm-lock.yaml        # 依赖锁文件
└── README.md             # 项目说明
```

## Monorepo 项目根目录

```
my-monorepo/
├── .github/              # GitHub 配置
├── apps/                 # 前端应用目录
├── services/             # 后端服务目录
├── packages/             # 共享包目录
├── tools/                # 开发工具目录
├── docs/                 # 项目文档
├── .gitignore            # Git 忽略文件
├── .nvmrc                # Node 版本
├── .npmrc                # 包管理器配置
├── package.json          # 根配置
├── pnpm-workspace.yaml   # 工作空间配置
└── README.md             # 项目说明
```

## 基础配置文件

两种项目类型都需要的基础配置文件：

- `.gitignore` - Git 忽略规则
- `.nvmrc` - Node.js 版本约束
- `.npmrc` - 包管理器配置
- `.editorconfig` - 编辑器配置
- `package.json` - 项目元信息
- `README.md` - 项目说明文档

---

*注意：包的内部结构不在初始化阶段定义，由各包根据需要自行决定。*