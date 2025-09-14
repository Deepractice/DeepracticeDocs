---
layer: Practice
type: How-to
title: 如何配置 Node.js 环境
category: nodejs-environment
status: published
version: 1.0.0
date: 2025-01-14
author: Sean Jiang & Claude
tags:
  - Node.js
  - 环境配置
  - 快速开始
  - 操作指南

purpose: 提供 Node.js 环境从零开始的配置步骤
scope:
  includes:
    - 完整配置流程
    - 各操作系统步骤
    - 验证和测试方法
    - 常见问题解决
  excludes:
    - 理论说明  # 见各标准文档
    - 高级配置  # 见配置标准
outcome:
  - 10分钟内完成环境配置
  - 环境符合组织标准
  - 能立即开始开发
---

# 如何配置 Node.js 环境

## 快速开始（5分钟）

如果你赶时间，按这个最简流程：

```bash
# 1. 安装 fnm（Node.js 版本管理器）
curl -fsSL https://fnm.vercel.app/install | bash

# 2. 重启终端或执行
source ~/.zshrc  # 或 ~/.bashrc

# 3. 安装 Node.js
fnm install 20.11.0
fnm use 20.11.0
fnm default 20.11.0

# 4. 安装 pnpm
npm install -g pnpm@8.14.0

# 5. 验证
node --version   # v20.11.0
pnpm --version   # 8.14.0
```

完成！现在可以开始开发了。

## 完整配置步骤

### Step 1: 安装 Node.js 版本管理器

#### macOS / Linux

```bash
# 方案A：使用 fnm（推荐，更快）
curl -fsSL https://fnm.vercel.app/install | bash

# 方案B：使用 Homebrew
brew install fnm

# 配置 Shell（添加到 ~/.zshrc 或 ~/.bashrc）
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc
source ~/.zshrc
```

#### Windows

```powershell
# 使用 Scoop
scoop install fnm

# 或使用 Chocolatey
choco install fnm

# 配置 PowerShell
notepad $PROFILE
# 添加: fnm env --use-on-cd | Out-String | Invoke-Expression
```

### Step 2: 安装 Node.js

```bash
# 查看可用版本
fnm list-remote

# 安装最新 LTS（推荐）
fnm install --lts
# 或指定版本
fnm install 20.11.0

# 使用安装的版本
fnm use 20.11.0

# 设置默认版本
fnm default 20.11.0

# 验证安装
node --version  # 应显示 v20.11.0
npm --version   # 应显示 10.x.x
```

### Step 3: 配置 npm Registry

```bash
# 使用淘宝镜像（国内用户）
npm config set registry https://registry.npmmirror.com

# 验证配置
npm config get registry

# 测试速度
npm ping
```

### Step 4: 安装 pnpm

```bash
# 使用 npm 安装 pnpm
npm install -g pnpm@8.14.0

# 配置 pnpm
pnpm config set store-dir ~/.pnpm-store
pnpm config set registry https://registry.npmmirror.com

# 验证安装
pnpm --version  # 应显示 8.14.0
```

### Step 5: 安装必需全局工具

```bash
# 安装开发工具
pnpm add -g tsx@4.7.0           # TypeScript 执行器
pnpm add -g nodemon@3.0.2       # 文件监控
pnpm add -g npm-check-updates@16.14.12  # 依赖更新

# 可选：安装 ni（统一包管理器命令）
pnpm add -g @antfu/ni

# 验证工具
tsx --version
nodemon --version
ncu --version
```

### Step 6: 配置环境变量

创建全局配置文件：

```bash
# 创建 Node.js 配置文件
cat > ~/.noderc << 'EOF'
# Node.js 运行时选项
export NODE_OPTIONS="--max-old-space-size=4096"
export NODE_ENV="development"

# pnpm 配置
export PNPM_HOME="$HOME/.pnpm-global"
export PATH="$PNPM_HOME:$PATH"
EOF

# 加载配置（添加到 ~/.zshrc 或 ~/.bashrc）
echo 'source ~/.noderc' >> ~/.zshrc
source ~/.zshrc
```

### Step 7: 项目级配置

在项目根目录创建版本文件：

```bash
# 创建 .nvmrc（版本锁定）
echo "20.11.0" > .nvmrc

# 创建 .npmrc（项目配置）
cat > .npmrc << 'EOF'
registry=https://registry.npmmirror.com
shamefully-hoist=false
auto-install-peers=true
EOF

# 测试自动切换
cd ..
cd project  # 应自动切换到项目指定版本
```

## 验证配置

### 运行验证脚本

```bash
# 创建验证脚本
cat > check-env.js << 'EOF'
#!/usr/bin/env node

console.log('Node.js 环境检查\n' + '='.repeat(40));

// 版本信息
console.log(`Node.js: ${process.version}`);
console.log(`npm: ${require('child_process').execSync('npm --version').toString().trim()}`);
console.log(`pnpm: ${require('child_process').execSync('pnpm --version').toString().trim()}`);

// 环境变量
console.log(`\n环境变量:`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`NODE_OPTIONS: ${process.env.NODE_OPTIONS}`);

// Registry
const registry = require('child_process').execSync('npm config get registry').toString().trim();
console.log(`\nRegistry: ${registry}`);

// 内存配置
const v8 = require('v8');
const heap = v8.getHeapStatistics();
console.log(`\n堆内存限制: ${Math.round(heap.heap_size_limit / 1024 / 1024)} MB`);

console.log('\n✅ 环境配置完成！');
EOF

# 运行验证
node check-env.js
```

### 检查清单

- [ ] Node.js 版本是 20.11.0
- [ ] pnpm 版本是 8.14.0
- [ ] Registry 配置正确
- [ ] 全局工具已安装
- [ ] 项目自动切换版本工作
- [ ] 环境变量已设置

## 特定 IDE 配置

### VSCode

```json
// .vscode/settings.json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "npm.packageManager": "pnpm",
  "eslint.packageManager": "pnpm",
  "terminal.integrated.env.osx": {
    "FNM_USE_ON_CD": "1"
  }
}
```

### WebStorm / IntelliJ IDEA

1. Settings → Languages & Frameworks → Node.js
2. Node interpreter: 选择 fnm 管理的版本
3. Package manager: 选择 pnpm

## 故障排除

### 问题：command not found: node

```bash
# 检查 PATH
echo $PATH | grep fnm

# 重新加载配置
source ~/.zshrc  # 或 ~/.bashrc

# 手动添加到 PATH
export PATH="$HOME/.fnm/aliases/default/bin:$PATH"
```

### 问题：fnm 不自动切换版本

```bash
# 确认配置
fnm env

# 检查 shell 配置
grep fnm ~/.zshrc

# 确保有这一行
eval "$(fnm env --use-on-cd)"
```

### 问题：pnpm 安装失败

```bash
# 清理 npm 缓存
npm cache clean --force

# 使用 npm 重新安装
npm uninstall -g pnpm
npm install -g pnpm@8.14.0

# 或使用独立安装脚本
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 问题：权限错误 (EACCES)

```bash
# 方案1：修改 npm prefix（推荐）
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

# 方案2：使用 pnpm（自动处理权限）
# pnpm 默认安装到用户目录

# 永远不要使用 sudo！
```

## 环境迁移

### 备份当前环境

```bash
# 导出配置
fnm list > node-versions.txt
npm list -g --depth=0 > global-packages.txt
npm config list > npm-config.txt
```

### 恢复到新机器

```bash
# 1. 安装 fnm
curl -fsSL https://fnm.vercel.app/install | bash

# 2. 安装 Node.js 版本
fnm install 20.11.0
fnm default 20.11.0

# 3. 恢复全局包
npm install -g pnpm@8.14.0
pnpm add -g tsx nodemon npm-check-updates

# 4. 恢复配置
npm config set registry https://registry.npmmirror.com
```

## 团队协作

### 新成员快速配置

```bash
# 1. 克隆配置脚本
git clone https://github.com/company/dev-setup.git
cd dev-setup

# 2. 运行自动配置
./setup-nodejs.sh

# 3. 验证环境
./check-env.sh
```

### 共享配置文件

```bash
# team-setup.sh
#!/bin/bash

echo "🚀 配置 Deepractice Node.js 开发环境"

# 安装 fnm
if ! command -v fnm &> /dev/null; then
  echo "安装 fnm..."
  curl -fsSL https://fnm.vercel.app/install | bash
fi

# 配置 Node.js
echo "安装 Node.js 20.11.0..."
fnm install 20.11.0
fnm use 20.11.0
fnm default 20.11.0

# 安装 pnpm
echo "安装 pnpm..."
npm install -g pnpm@8.14.0

# 配置 Registry
echo "配置 npm registry..."
npm config set registry https://registry.npmmirror.com
pnpm config set registry https://registry.npmmirror.com

# 安装全局工具
echo "安装全局工具..."
pnpm add -g tsx nodemon npm-check-updates

echo "✅ 配置完成！"
node --version
pnpm --version
```

## 维护检查

### 每周检查

```bash
# 检查更新
ncu -g  # 检查全局包更新

# 清理缓存
pnpm store prune
```

### 每月检查

```bash
# 检查 Node.js 更新
fnm list-remote | grep LTS

# 更新全局工具
pnpm add -g pnpm@latest
pnpm add -g tsx@latest
```

## 下一步

环境配置完成后，你可以：

1. 查看 [Node.js 版本管理标准](./nodejs-version-standard.md)
2. 了解 [Node.js 配置标准](./nodejs-configuration-standard.md)
3. 学习 [npm/pnpm 配置标准](./npm-configuration-standard.md)
4. 探索 [Monorepo 实践](../monorepo/)

---

*记住：好的开始是成功的一半，标准化的环境是高效开发的基础。*