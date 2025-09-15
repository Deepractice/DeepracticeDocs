---
layer: Practice
type: Index
title: Node.js 环境配置规范
category: node-development-environment/nodejs
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - Node.js
  - 运行环境
  - 版本管理
  - 环境配置

# 目录级 PSO
purpose: 实现 Node.js 运行环境的标准化配置，作为父级 PSO 中"核心开发环境"的基础支撑
scope:
  includes:
    - Node.js 版本管理策略（LTS 选择、版本切换）
    - 环境变量配置标准（NODE_ENV、PATH 等）
    - 包管理器配置（npm、pnpm、yarn 配置）
    - 全局工具管理（必装工具、版本控制）
    - packageManager 字段规范
    - engines 约束配置
  excludes:
    - 具体框架配置（Express、Koa、Nest）
    - 应用层环境变量（业务相关）
    - CI/CD 环境配置
    - 容器化环境（Docker）
outcome:
  - 统一的 Node.js 版本管理策略
  - 标准化的环境配置流程
  - 可重现的开发环境
  - 新成员 5 分钟完成环境搭建
---

# Node.js 环境配置规范

## 概述

Node.js 运行环境是整个开发栈的基础。一个稳定、一致的 Node.js 环境配置能够：
- 避免"在我机器上能运行"的问题
- 确保团队使用相同的运行时版本
- 提高构建和部署的可靠性
- 减少环境相关的调试时间

## 核心原则

### 🎯 版本一致性
团队所有成员和环境（开发、测试、生产）应使用相同的 Node.js 版本。

### 🔒 LTS 优先
始终选择 LTS（长期支持）版本，确保稳定性和安全性。

### 📦 工具标准化
统一版本管理工具和包管理器，避免混用造成的问题。

## 版本管理

### 版本选择策略

| 版本类型 | 使用场景 | 更新策略 |
|---------|---------|----------|
| **Active LTS** | 生产环境、新项目 | 每 6 个月评估升级 |
| **Maintenance LTS** | 维护项目 | 仅安全更新 |
| **Current** | 实验性项目 | 不用于生产 |

### 当前推荐版本
```bash
# 2025 年 1 月推荐
Node.js 20.x LTS (Iron)  # Active LTS
Node.js 18.x LTS         # Maintenance LTS
```

### 版本管理工具

推荐使用 **fnm**（Fast Node Manager）：

**优点**：
- 🚀 速度快（Rust 编写）
- 💾 占用空间小
- 🔧 配置简单
- 📱 跨平台支持好

**安装**：
```bash
# macOS/Linux
curl -fsSL https://fnm.vercel.app/install | bash

# Windows
winget install Schniz.fnm
```

**基础使用**：
```bash
# 安装 Node.js 版本
fnm install 20
fnm install --lts

# 切换版本
fnm use 20
fnm use --lts

# 设置默认版本
fnm default 20

# 自动切换（根据 .nvmrc）
fnm use --version-file-strategy=recursive
```

## 项目配置

### package.json 配置

```json
{
  "engines": {
    "node": ">=20.0.0 <21.0.0",
    "pnpm": ">=8.15.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

### .nvmrc / .node-version

在项目根目录创建版本文件：

```bash
# .nvmrc 或 .node-version
20.11.0
```

### 环境变量配置

必要的环境变量：

```bash
# .env.example
NODE_ENV=development
NODE_OPTIONS="--max-old-space-size=4096"
NPM_CONFIG_REGISTRY=https://registry.npmmirror.com
```

## 包管理器配置

### pnpm（推荐）

**全局配置**：
```bash
# 设置镜像源
pnpm config set registry https://registry.npmmirror.com

# 设置存储路径
pnpm config set store-dir ~/.pnpm-store

# 启用性能优化
pnpm config set prefer-frozen-lockfile true
```

**项目配置**（.npmrc）：
```ini
# .npmrc
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=true
enable-pre-post-scripts=true
```

### npm 配置

**全局配置**：
```bash
# 设置镜像源
npm config set registry https://registry.npmmirror.com

# 设置缓存目录
npm config set cache ~/.npm-cache

# 关闭 fund 提示
npm config set fund false
```

## 全局工具管理

### 必装工具清单

| 工具 | 用途 | 安装命令 |
|------|------|----------|
| **pnpm** | 包管理器 | `npm install -g pnpm` |
| **ni** | 统一的包管理器调用 | `npm install -g @antfu/ni` |
| **tsx** | TypeScript 执行器 | `pnpm add -g tsx` |
| **npm-check-updates** | 依赖更新检查 | `pnpm add -g npm-check-updates` |

### 工具版本管理

创建全局工具版本文件：

```json
// .tool-versions.json
{
  "pnpm": "8.15.0",
  "tsx": "^4.7.0",
  "npm-check-updates": "^16.14.0"
}
```

## 环境验证

### 验证脚本

```bash
#!/bin/bash
# check-env.sh

echo "🔍 检查 Node.js 环境..."

# 检查 Node.js 版本
NODE_VERSION=$(node -v)
REQUIRED_VERSION="v20"

if [[ $NODE_VERSION == $REQUIRED_VERSION* ]]; then
  echo "✅ Node.js 版本正确: $NODE_VERSION"
else
  echo "❌ Node.js 版本错误: 需要 $REQUIRED_VERSION.x，当前 $NODE_VERSION"
  exit 1
fi

# 检查 pnpm
if command -v pnpm &> /dev/null; then
  echo "✅ pnpm 已安装: $(pnpm -v)"
else
  echo "❌ pnpm 未安装"
  exit 1
fi

echo "✨ 环境检查通过！"
```

## 最佳实践

### ✅ 应该做的

1. **锁定版本**
   - 使用 engines 字段锁定 Node.js 版本
   - 使用 packageManager 字段锁定包管理器版本

2. **版本文件**
   - 项目根目录必须有 .nvmrc
   - 让 fnm 自动切换版本

3. **环境隔离**
   - 不同项目使用不同的 Node.js 版本
   - 使用版本管理工具而非系统 Node.js

### ❌ 不应该做的

1. **混用包管理器** - 不要在同一项目中混用 npm/yarn/pnpm
2. **使用过新版本** - 不要在生产环境使用 Current 版本
3. **忽略版本约束** - 不要忽略 engines 字段的警告

## 故障排查

### 常见问题

**Q: node: command not found**
```bash
# 重新加载 shell 配置
source ~/.bashrc  # 或 ~/.zshrc

# 检查 PATH
echo $PATH | grep fnm
```

**Q: 版本切换不生效**
```bash
# 手动设置
fnm use 20 --install-if-missing

# 检查当前版本
fnm current
```

**Q: pnpm 安装失败**
```bash
# 使用 npm 安装
npm install -g pnpm

# 或使用独立安装脚本
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## 迁移指南

### 从 nvm 迁移到 fnm

```bash
# 1. 列出 nvm 安装的版本
nvm list

# 2. 在 fnm 中安装相同版本
fnm install 18.19.0
fnm install 20.11.0

# 3. 设置默认版本
fnm default 20.11.0

# 4. 迁移全局包
npm list -g --depth=0
# 重新安装到 fnm 管理的 Node.js
```

## 相关资源

### 内部文档

#### 核心规范
- [Node.js 版本管理标准](./nodejs-version-standard.md) `Reference` - LTS 策略与版本升级
- [环境变量配置标准](./environment-variables-standard.md) `Reference` - NODE_ENV 与配置管理
- [包管理器配置规范](./package-manager-configuration-standard.md) `Reference` - npm/pnpm/yarn 配置
- [全局工具管理规范](./global-tools-management-standard.md) `Reference` - 必装工具与版本控制
- [packageManager 字段规范](./package-manager-field-standard.md) `Reference` - Corepack 自动化管理
- [engines 约束配置规范](./engines-constraint-standard.md) `Reference` - 运行时版本约束

#### 操作指南
- [如何配置 Node.js 环境](./how-to-setup-nodejs.md) `How-to` - 5分钟快速上手

#### 相关目录
- [Node.js 开发环境规范](../index.md) - 父级规范
- [包管理策略](../package-management/index.md) - 包管理详细说明
- [项目初始化](../initialization/index.md) - 新项目配置

### 外部资源
- [Node.js Release Schedule](https://nodejs.org/en/about/releases/) - 官方版本计划
- [fnm Documentation](https://github.com/Schniz/fnm) - fnm 官方文档
- [pnpm Documentation](https://pnpm.io) - pnpm 官方文档

---

*记住：稳定的运行环境是高效开发的基础。选择 LTS，统一版本，标准化配置。*