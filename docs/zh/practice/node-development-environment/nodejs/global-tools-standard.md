---
layer: Practice
type: Reference
title: 全局工具安装标准
category: nodejs-environment
status: published
version: 1.0.0
date: 2025-01-14
author: Sean Jiang & Claude
tags:
  - Node.js
  - 全局工具
  - CLI工具
  - 开发工具

purpose: 定义组织内 Node.js 全局工具的安装和管理标准
scope:
  includes:
    - 全局工具选择原则
    - 必装工具清单
    - 可选工具推荐
    - 版本管理策略
    - 更新维护流程
  excludes:
    - 项目级依赖  # 使用 devDependencies
    - IDE 插件  # 属于编辑器配置
outcome:
  - 统一的全局工具集
  - 避免全局污染
  - 工具版本一致性
---

# 全局工具安装标准

## 安装原则

### 全局 vs 局部

| 安装方式 | 适用场景 | 示例 |
|----------|----------|------|
| **全局安装** | 跨项目通用的 CLI 工具 | pnpm, tsx, npm-check-updates |
| **局部安装** | 项目特定的构建工具 | webpack, vite, eslint |
| **npx 执行** | 偶尔使用的工具 | create-react-app, npm-check |

### 最小化原则

```bash
# 核心理念：能不装全局就不装

# ❌ 不推荐（全局安装）
npm install -g webpack
npm install -g eslint

# ✅ 推荐（项目内安装）
pnpm add -D webpack
pnpm add -D eslint

# ✅ 推荐（临时执行）
npx create-vite@latest
pnpm dlx create-vite@latest
```

## 必装工具清单

### 包管理器

| 工具 | 版本 | 用途 | 安装命令 |
|------|------|------|----------|
| **pnpm** | ^8.14.0 | 主包管理器 | `npm install -g pnpm` |
| **ni** | ^0.21.0 | 统一包管理器调用 | `npm install -g @antfu/ni` |

### 开发工具

| 工具 | 版本 | 用途 | 安装命令 |
|------|------|------|----------|
| **tsx** | ^4.7.0 | TypeScript 执行器 | `pnpm add -g tsx` |
| **nodemon** | ^3.0.0 | 文件监控重启 | `pnpm add -g nodemon` |
| **npm-check-updates** | ^16.14.0 | 依赖更新检查 | `pnpm add -g npm-check-updates` |

### 工具说明

```bash
# ni - 智能包管理器调用
ni              # 安装依赖（自动识别 pnpm/npm/yarn）
nr dev          # 运行脚本
nu              # 更新依赖

# tsx - TypeScript 执行
tsx script.ts              # 直接运行 TS 文件
tsx watch script.ts       # 监控模式
tsx --inspect script.ts   # 调试模式

# npm-check-updates - 依赖更新
ncu             # 检查更新
ncu -u          # 更新 package.json
ncu -g          # 检查全局包更新
```

## 可选工具推荐

### 开发效率

| 工具 | 用途 | 安装命令 | 使用场景 |
|------|------|----------|----------|
| **serve** | 静态文件服务器 | `pnpm add -g serve` | 预览构建结果 |
| **http-server** | 简单 HTTP 服务器 | `pnpm add -g http-server` | 快速启动服务 |
| **json-server** | Mock API 服务器 | `pnpm add -g json-server` | API 模拟 |
| **concurrently** | 并行执行命令 | `pnpm add -g concurrently` | 多任务并行 |

### 调试工具

| 工具 | 用途 | 安装命令 | 使用场景 |
|------|------|----------|----------|
| **ndb** | Chrome DevTools 调试 | `pnpm add -g ndb` | 高级调试 |
| **clinic** | 性能诊断 | `pnpm add -g clinic` | 性能分析 |
| **0x** | 火焰图生成 | `pnpm add -g 0x` | CPU 分析 |

### 代码质量

| 工具 | 用途 | 安装命令 | 使用场景 |
|------|------|----------|----------|
| **commitizen** | 规范化提交 | `pnpm add -g commitizen` | Git 提交规范 |
| **standard-version** | 版本管理 | `pnpm add -g standard-version` | 自动版本号 |

## 版本管理

### 工具版本锁定

```json
// global-tools.json（团队共享）
{
  "tools": {
    "pnpm": "8.14.0",
    "tsx": "4.7.0",
    "nodemon": "3.0.2",
    "npm-check-updates": "16.14.12"
  },
  "optional": {
    "serve": "14.2.1",
    "http-server": "14.1.1"
  }
}
```

### 版本检查脚本

```bash
#!/bin/bash
# check-global-tools.sh

echo "检查全局工具版本..."

# 必需工具检查
check_tool() {
  local tool=$1
  local required=$2
  local current=$(npm list -g --depth=0 $tool 2>/dev/null | grep $tool | awk '{print $2}')
  
  if [ -z "$current" ]; then
    echo "❌ $tool 未安装 (需要 $required)"
    return 1
  elif [ "$current" != "$required" ]; then
    echo "⚠️  $tool 版本不匹配 (当前: $current, 需要: $required)"
    return 1
  else
    echo "✅ $tool $current"
    return 0
  fi
}

check_tool "pnpm" "8.14.0"
check_tool "tsx" "4.7.0"
```

## 安装配置

### 全局目录配置

```bash
# 查看全局目录
npm config get prefix       # npm 全局目录
pnpm config get global-dir  # pnpm 全局目录

# 配置全局目录（避免权限问题）
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc

# pnpm 全局目录
pnpm config set global-bin-dir ~/.pnpm-global/bin
```

### 权限问题解决

```bash
# 方案1：使用用户目录（推荐）
npm config set prefix ~/.npm-global
pnpm config set global-dir ~/.pnpm-global

# 方案2：修改目录权限（不推荐）
sudo chown -R $(whoami) $(npm config get prefix)

# 方案3：使用 pnpm（自动处理）
# pnpm 默认安装到用户目录，无权限问题
```

## 更新策略

### 定期更新

```bash
# 每月检查更新
# 检查全局包更新
npm-check-updates -g

# 查看过时的全局包
npm outdated -g
pnpm outdated -g

# 更新特定工具
pnpm add -g pnpm@latest
pnpm add -g tsx@latest
```

### 批量更新脚本

```bash
#!/bin/bash
# update-global-tools.sh

echo "更新全局工具..."

# 更新包管理器
npm install -g pnpm@latest

# 更新必需工具
pnpm add -g tsx@latest
pnpm add -g nodemon@latest
pnpm add -g npm-check-updates@latest

# 列出已安装版本
pnpm list -g --depth=0
```

## 清理维护

### 卸载无用工具

```bash
# 列出所有全局包
npm list -g --depth=0
pnpm list -g --depth=0

# 卸载不需要的包
pnpm remove -g <package-name>

# 清理缓存
npm cache clean --force
pnpm store prune
```

### 迁移到新环境

```bash
# 导出当前全局包列表
npm list -g --depth=0 --json > global-packages.json

# 在新环境安装
cat global-packages.json | jq -r '.dependencies | keys[]' | xargs npm install -g
```

## 替代方案

### 使用 volta（Node.js 工具链管理器）

```bash
# 安装 volta
curl https://get.volta.sh | bash

# 使用 volta 安装工具
volta install node@20
volta install pnpm
volta install tsx

# 项目固定工具版本
volta pin node@20
volta pin pnpm@8
```

### 使用 Docker

```dockerfile
# Dockerfile.dev
FROM node:20-alpine

# 安装全局工具
RUN npm install -g pnpm@8.14.0 tsx@4.7.0

# 设置工作目录
WORKDIR /app

# 开发时挂载代码
VOLUME ["/app"]
```

## 团队规范

### 新成员入职

```bash
# 1. 安装 Node.js (使用 fnm)
fnm install 20.11.0
fnm use 20.11.0
fnm default 20.11.0

# 2. 安装必需全局工具
npm install -g pnpm@8.14.0
pnpm add -g tsx nodemon npm-check-updates

# 3. 验证安装
node --version    # v20.11.0
pnpm --version    # 8.14.0
tsx --version     # 4.7.0
```

### 工具使用规范

| 场景 | 使用工具 | 命令示例 |
|------|----------|----------|
| **安装依赖** | pnpm | `pnpm install` |
| **运行 TS 脚本** | tsx | `tsx src/script.ts` |
| **开发服务器** | nodemon | `nodemon --exec tsx src/index.ts` |
| **检查更新** | ncu | `ncu -u` |

## 故障排除

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| **command not found** | PATH 未配置 | 添加全局 bin 到 PATH |
| **EACCES 权限错误** | 系统目录权限 | 使用用户目录 |
| **版本冲突** | 多个版本共存 | 清理后重装 |
| **pnpm 命令失败** | 版本过旧 | 更新 pnpm |

### 诊断命令

```bash
# 检查 PATH
echo $PATH

# 查看全局包位置
npm config get prefix
which pnpm

# 列出所有全局包
npm list -g --depth=0

# 检查包版本
pnpm --version
tsx --version
```

## 最佳实践

### DO ✅

- 最小化全局安装
- 定期更新工具版本
- 团队统一工具版本
- 使用 npx/pnpm dlx 执行一次性命令
- 项目工具用 devDependencies

### DON'T ❌

- 不要全局安装项目构建工具
- 不要使用 sudo 安装全局包
- 不要忽略版本更新
- 不要安装重复功能的工具
- 不要依赖全局工具进行 CI/CD

---

## 参考资源

- [npm Global vs Local](https://docs.npmjs.com/downloading-and-installing-packages-globally)
- [pnpm Global](https://pnpm.io/cli/add#--global--g)
- [Volta - JavaScript Tool Manager](https://volta.sh/)

---

*记住：全局工具应该是辅助开发的，而不是项目依赖的。*