---
layer: Practice
type: How-to
title: 如何配置 Node.js 开发环境
category: node-development-environment/nodejs
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - Node.js
  - 环境配置
  - 快速上手

purpose: 提供从零开始配置 Node.js 开发环境的步骤指南
scope:
  includes:
    - fnm 安装和配置
    - Node.js 版本安装
    - 包管理器配置
    - 环境验证
  excludes:
    - IDE 配置
    - 项目初始化
    - 框架安装
outcome:
  - 5 分钟完成环境配置
  - 能够切换 Node.js 版本
  - 包管理器正常工作
---

# 如何配置 Node.js 开发环境

## 前置要求

- macOS、Linux 或 Windows 10+
- 终端访问权限
- 网络连接（用于下载）

## 步骤 1：安装 fnm

### macOS

```bash
# 使用 Homebrew
brew install fnm

# 或使用安装脚本
curl -fsSL https://fnm.vercel.app/install | bash
```

### Linux

```bash
# 使用安装脚本
curl -fsSL https://fnm.vercel.app/install | bash

# 或使用 cargo（如果已安装 Rust）
cargo install fnm
```

### Windows

```powershell
# 使用 winget
winget install Schniz.fnm

# 或使用 Scoop
scoop install fnm

# 或下载安装包
# 访问 https://github.com/Schniz/fnm/releases
```

## 步骤 2：配置 Shell

### Bash

```bash
# 添加到 ~/.bashrc
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.bashrc

# 立即生效
source ~/.bashrc
```

### Zsh

```bash
# 添加到 ~/.zshrc
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc

# 立即生效
source ~/.zshrc
```

### Fish

```fish
# 添加到 ~/.config/fish/config.fish
echo 'fnm env --use-on-cd | source' >> ~/.config/fish/config.fish

# 立即生效
source ~/.config/fish/config.fish
```

### PowerShell (Windows)

```powershell
# 添加到 $PROFILE
Add-Content $PROFILE 'fnm env --use-on-cd | Out-String | Invoke-Expression'

# 重新加载配置
. $PROFILE
```

## 步骤 3：安装 Node.js

### 安装最新 LTS

```bash
# 查看可用的 LTS 版本
fnm list-remote --lts

# 安装最新 LTS
fnm install --lts

# 使用该版本
fnm use lts-latest

# 设为默认版本
fnm default lts-latest
```

### 安装特定版本

```bash
# 安装 Node.js 20
fnm install 20

# 或安装具体版本
fnm install 20.11.0

# 切换到该版本
fnm use 20.11.0
```

## 步骤 4：验证安装

```bash
# 检查 fnm
fnm --version
# 输出: fnm 1.35.1

# 检查 Node.js
node --version
# 输出: v20.11.0

# 检查 npm
npm --version
# 输出: 10.2.4

# 查看已安装版本
fnm list
# 输出:
# * v20.11.0 (default)
# * v18.19.0
```

## 步骤 5：配置包管理器

### 安装 pnpm

```bash
# 使用 npm 安装
npm install -g pnpm

# 验证安装
pnpm --version
# 输出: 8.15.0
```

### 配置 npm 镜像（中国用户）

```bash
# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 验证配置
npm config get registry
# 输出: https://registry.npmmirror.com
```

### 配置 pnpm 镜像（中国用户）

```bash
# 设置淘宝镜像
pnpm config set registry https://registry.npmmirror.com

# 验证配置
pnpm config get registry
```

## 步骤 6：项目级配置

### 创建版本文件

```bash
# 在项目根目录
echo "20.11.0" > .nvmrc

# 测试自动切换
cd ..
cd your-project
# fnm 应该自动切换到 20.11.0
```

### 配置 package.json

```json
{
  "name": "your-project",
  "engines": {
    "node": ">=20.0.0 <21.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

### 创建 .npmrc

```ini
# .npmrc
# 强制版本检查
engine-strict=true

# pnpm 配置
auto-install-peers=true
shamefully-hoist=true
```

## 步骤 7：安装全局工具

```bash
# 统一包管理器调用工具
npm install -g @antfu/ni

# TypeScript 执行器
pnpm add -g tsx

# 依赖更新检查
pnpm add -g npm-check-updates

# 验证安装
ni --version
tsx --version
ncu --version
```

## 验证脚本

创建 `check-env.sh`：

```bash
#!/bin/bash

echo "🔍 检查 Node.js 环境配置..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 fnm
if command -v fnm &> /dev/null; then
    echo -e "${GREEN}✅${NC} fnm 已安装: $(fnm --version)"
else
    echo -e "${RED}❌${NC} fnm 未安装"
    exit 1
fi

# 检查 Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    if [[ $NODE_VERSION == v20* ]] || [[ $NODE_VERSION == v18* ]]; then
        echo -e "${GREEN}✅${NC} Node.js: $NODE_VERSION (LTS)"
    else
        echo -e "${RED}⚠️${NC} Node.js: $NODE_VERSION (非 LTS 版本)"
    fi
else
    echo -e "${RED}❌${NC} Node.js 未安装"
    exit 1
fi

# 检查 npm
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✅${NC} npm 已安装: $(npm --version)"
else
    echo -e "${RED}❌${NC} npm 未安装"
fi

# 检查 pnpm
if command -v pnpm &> /dev/null; then
    echo -e "${GREEN}✅${NC} pnpm 已安装: $(pnpm --version)"
else
    echo -e "${RED}⚠️${NC} pnpm 未安装 (推荐安装)"
fi

# 检查镜像源
REGISTRY=$(npm config get registry)
if [[ $REGISTRY == *"npmmirror"* ]] || [[ $REGISTRY == *"taobao"* ]]; then
    echo -e "${GREEN}✅${NC} 使用镜像源: $REGISTRY"
else
    echo -e "ℹ️ 使用官方源: $REGISTRY"
fi

echo ""
echo "✨ 环境检查完成！"
```

运行验证：

```bash
chmod +x check-env.sh
./check-env.sh
```

## 常见问题解决

### fnm 命令找不到

```bash
# 检查 PATH
echo $PATH | grep fnm

# 手动添加到 PATH
export PATH="$HOME/.fnm:$PATH"

# 重新执行配置
eval "$(fnm env --use-on-cd)"
```

### 版本切换不生效

```bash
# 手动切换
fnm use 20.11.0

# 检查当前版本
fnm current

# 清理并重新安装
fnm uninstall 20.11.0
fnm install 20.11.0
fnm use 20.11.0
```

### pnpm 安装失败

```bash
# 方法 1：使用 npm
npm install -g pnpm

# 方法 2：使用独立安装脚本
curl -fsSL https://get.pnpm.io/install.sh | sh -

# 方法 3：使用 fnm 执行
fnm exec --using=20 npm install -g pnpm
```

### 权限问题（macOS/Linux）

```bash
# 修复 npm 全局目录权限
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## 下一步

环境配置完成后，你可以：

1. 📝 查看 [Node.js 版本管理标准](./nodejs-version-standard.md)
2. 📦 学习 [包管理策略](../package-management/index.md)
3. 🚀 开始 [项目初始化](../initialization/index.md)

---

*提示：将此配置过程整理为团队的标准化脚本，新成员入职只需运行一个命令即可完成环境搭建。*