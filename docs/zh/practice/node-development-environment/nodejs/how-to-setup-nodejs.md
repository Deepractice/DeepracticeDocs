---
layer: Practice
type: How-to
title: 如何配置 Node.js 环境
category: node-development-environment/nodejs
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - Node.js
  - 环境配置
  - 快速上手

purpose: 快速配置标准化的 Node.js 开发环境
scope:
  progression:
    1. 安装版本管理工具 fnm
    2. 安装 Node.js LTS 版本
    3. 配置 pnpm 包管理器
    4. 设置项目版本约束
    5. 验证环境配置
outcome:
  - 完成 Node.js 环境配置
  - 版本管理就绪
  - 包管理器配置完成
---

# 如何配置 Node.js 环境

## 步骤 1：安装 fnm（Fast Node Manager）

### macOS/Linux

```bash
# 使用 Homebrew
brew install fnm

# 或使用安装脚本
curl -fsSL https://fnm.vercel.app/install | bash
```

### Windows

```powershell
# 使用 Scoop
scoop install fnm

# 或使用 Winget
winget install Schniz.fnm
```

### 配置 Shell

将以下内容添加到你的 shell 配置文件（`~/.zshrc` 或 `~/.bashrc`）：

```bash
# fnm
eval "$(fnm env --use-on-cd)"
```

重新加载配置：

```bash
source ~/.zshrc  # 或 source ~/.bashrc
```

## 步骤 2：安装 Node.js

```bash
# 查看可用的 LTS 版本
fnm list-remote --lts

# 安装最新 LTS（推荐）
fnm install --lts

# 或安装特定版本
fnm install 20.11.0

# 设为默认版本
fnm default 20.11.0

# 验证安装
node --version  # v20.11.0
npm --version   # 10.x.x
```

## 步骤 3：安装和配置 pnpm

```bash
# 使用 npm 安装 pnpm
npm install -g pnpm

# 或使用 standalone 脚本
curl -fsSL https://get.pnpm.io/install.sh | sh -

# 验证安装
pnpm --version  # 8.x.x
```

### 配置 pnpm

创建全局配置文件 `~/.npmrc`：

```ini
# pnpm 性能优化
prefer-frozen-lockfile=true
resolution-mode=highest

# 安全设置
engine-strict=true
audit-level=moderate

# 使用国内镜像（可选）
registry=https://registry.npmmirror.com
```

## 步骤 4：配置项目

### 创建项目目录

```bash
mkdir my-project
cd my-project
```

### 初始化项目

```bash
pnpm init
```

### 创建版本约束文件

创建 `.nvmrc` 文件：

```bash
echo "20.11.0" > .nvmrc
```

### 配置 package.json

编辑 `package.json`，添加以下配置：

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "node": ">=20.11.0 <21.0.0",
    "pnpm": ">=8.0.0"
  },
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```

### 创建项目 .npmrc

```bash
cat > .npmrc << 'EOF'
# 依赖管理
shamefully-hoist=false
strict-peer-dependencies=true
auto-install-peers=false

# 性能
prefer-frozen-lockfile=true

# 安全
engine-strict=true
EOF
```

## 步骤 5：验证配置

运行以下命令验证环境：

```bash
# 检查 Node.js 版本
node --version
# 预期：v20.11.0

# 检查 pnpm
pnpm --version
# 预期：8.x.x

# 测试版本切换
cd ..
node --version  # 可能是其他版本
cd my-project
node --version  # 自动切换到 v20.11.0

# 测试包管理器约束
npm install  # 应该报错
pnpm install  # 应该成功
```

## 常见问题

### fnm 命令未找到

确保已将 fnm 添加到 PATH：

```bash
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc
source ~/.zshrc
```

### 版本切换不生效

```bash
# 手动切换
fnm use

# 检查当前版本
fnm current
```

### pnpm 安装失败

```bash
# 清理 npm 缓存
npm cache clean --force

# 重新安装
npm install -g pnpm@latest
```

## 下一步

环境配置完成！现在你可以：

1. [配置 TypeScript](../typescript/how-to-setup-typescript.md) - 添加类型支持
2. [配置 ESLint](../linting/how-to-setup-eslint.md) - 添加代码检查
3. [创建 Monorepo](../monorepo/how-to-create-monorepo.md) - 管理多包项目

---

*提示：使用 `fnm` + `pnpm` 的组合可以获得最佳的性能和开发体验。*