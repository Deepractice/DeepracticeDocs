---
layer: Practice
type: How-to
title: 如何初始化项目
category: node-development-environment/initialization
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - 项目初始化
  - 脚手架
  - 快速开始

purpose: 快速创建标准化的项目结构
scope:
  progression:
    1. 创建项目目录
    2. 初始化 Git 仓库
    3. 配置 package.json
    4. 创建目录结构
    5. 添加基础配置文件
    6. 安装基础依赖
outcome:
  - 完成项目初始化
  - 标准的项目结构
  - 可以开始开发
---

# 如何初始化项目

## 前置要求

确保已完成 [Node.js 环境配置](../nodejs/how-to-setup-nodejs.md)。

## 步骤 1：创建项目目录

```bash
# 创建项目目录
mkdir my-project
cd my-project

# 或使用一行命令
mkdir my-project && cd $_
```

## 步骤 2：初始化 Git 仓库

```bash
# 初始化 Git
git init

# 设置默认分支名
git branch -M main

# 创建 .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
out/
*.tsbuildinfo

# Logs
logs/
*.log
npm-debug.log*
pnpm-debug.log*

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea/
*.swp
*.swo
.DS_Store

# Testing
coverage/
.nyc_output/

# Cache
.eslintcache
.parcel-cache/
.turbo/
EOF

# 首次提交
git add .gitignore
git commit -m "chore: initial commit with .gitignore"
```

## 步骤 3：初始化 package.json

```bash
# 使用 pnpm 初始化
pnpm init

# 或使用交互式初始化
npm init -y
```

### 更新 package.json

```json
{
  "name": "my-project",
  "version": "0.0.1",
  "description": "A Node.js TypeScript project",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "dev": "echo 'Configure dev script based on project type'",
    "build": "echo 'Configure build script based on project type'",
    "test": "echo 'Configure test script based on project type'",
    "lint": "echo 'Configure lint script after ESLint setup'",
    "format": "echo 'Configure format script after Prettier setup'"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

## 步骤 4：创建基础目录结构

```bash
# 创建基础目录（将在后续步骤中决定是单包还是多包）
mkdir -p docs scripts .github/workflows

# 创建 README.md
cat > README.md << 'EOF'
# My Project

> A Node.js TypeScript project

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Build
pnpm build

# Test
pnpm test
```

## 📄 License

MIT
EOF
```

## 步骤 5：添加配置文件

### .editorconfig

```bash
cat > .editorconfig << 'EOF'
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
EOF
```

### .nvmrc

```bash
echo "20.11.0" > .nvmrc
```

### .npmrc

```bash
cat > .npmrc << 'EOF'
# pnpm 配置
shamefully-hoist=false
strict-peer-dependencies=true
auto-install-peers=false

# 性能
prefer-frozen-lockfile=true

# 安全
engine-strict=true
EOF
```


## 步骤 6：决定项目类型

此时需要决定项目类型：

### 选项 A：单包项目
```bash
# 如果是单包项目，创建 src 目录
mkdir -p src tests

# 继续到 TypeScript 配置章节
# 参见：../typescript/how-to-setup-typescript.md
```

### 选项 B：Monorepo 项目
```bash
# 如果是 Monorepo，创建工作空间结构
mkdir -p apps services packages tools

# 创建 pnpm-workspace.yaml
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'services/*'
  - 'packages/*'
  - 'tools/*'
EOF

# 继续到 Monorepo 配置章节
# 参见：../monorepo/how-to-setup-monorepo.md
```

## 步骤 7：验证初始化

```bash
# 检查 Node.js 版本
node --version
# 应该显示: v20.11.0

# 检查 pnpm 版本
pnpm --version
# 应该显示: 8.x.x

# 检查项目结构
tree -I 'node_modules' -L 2
# 应该显示基础目录结构

# 检查 Git 状态
git status
# 应该显示已配置的文件

# 提交初始化
git add .
git commit -m "chore: initial project setup"
```

## 完整初始化脚本

```bash
#!/bin/bash
# init-project.sh - 项目初始化脚本

PROJECT_NAME=${1:-my-project}
PROJECT_TYPE=${2:-monorepo}  # monorepo 或 single

echo "🚀 Initializing $PROJECT_TYPE project: $PROJECT_NAME"

# 创建并进入项目目录
mkdir "$PROJECT_NAME" && cd "$PROJECT_NAME"

# Git 初始化
git init
git branch -M main

# 创建基础配置文件
# ... (包含 .gitignore, .editorconfig, .npmrc 等)

# 初始化 package.json
pnpm init

# 根据项目类型创建结构
if [ "$PROJECT_TYPE" = "monorepo" ]; then
  mkdir -p apps services packages tools
  echo "packages:" > pnpm-workspace.yaml
  echo "  - 'apps/*'" >> pnpm-workspace.yaml
  echo "  - 'services/*'" >> pnpm-workspace.yaml
  echo "  - 'packages/*'" >> pnpm-workspace.yaml
  echo "  - 'tools/*'" >> pnpm-workspace.yaml
else
  mkdir -p src tests
fi

# 创建基础目录
mkdir -p docs scripts .github/workflows

# 首次提交
git add .
git commit -m "chore: initial project setup"

echo "✅ Project '$PROJECT_NAME' initialized as $PROJECT_TYPE!"
echo "📁 cd $PROJECT_NAME"
echo "🔗 Next steps:"
if [ "$PROJECT_TYPE" = "monorepo" ]; then
  echo "   → Configure Monorepo: see monorepo/how-to-setup-monorepo.md"
else
  echo "   → Configure TypeScript: see typescript/how-to-setup-typescript.md"
fi
```

## 常见问题

### pnpm 未找到

```bash
npm install -g pnpm
```

### 权限错误

```bash
# macOS/Linux
chmod +x init-project.sh
```

### Node.js 版本不匹配

```bash
# 使用 fnm 切换版本
fnm use
fnm install 20.11.0
```

## 下一步

基础项目初始化完成！根据项目类型选择下一步：

### Monorepo 项目
1. [配置 Monorepo](../monorepo/how-to-setup-monorepo.md) - 设置工作空间
2. [配置 TypeScript](../typescript/how-to-setup-typescript.md) - 添加类型支持
3. [配置代码质量工具](../linting/how-to-setup-eslint.md) - ESLint + Prettier

### 单包项目
1. [配置 TypeScript](../typescript/how-to-setup-typescript.md) - 添加类型支持
2. [配置代码质量工具](../linting/how-to-setup-eslint.md) - ESLint + Prettier
3. [配置测试框架](../testing/how-to-setup-testing.md) - 添加测试

---

*提示：保存初始化脚本，可以快速创建新项目。*