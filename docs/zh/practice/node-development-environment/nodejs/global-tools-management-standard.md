---
layer: Practice
type: Reference
title: 全局工具管理规范
category: node-development-environment/nodejs
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - Node.js
  - 全局工具
  - CLI工具
  - 版本管理

purpose: 定义 Node.js 全局工具的安装、管理和版本控制标准
scope:
  includes:
    - 必装工具清单
    - 全局工具版本管理
    - 安装位置配置
    - 更新策略
  excludes:
    - 项目级依赖
    - IDE 插件
    - 系统级工具
outcome:
  - 统一的全局工具集
  - 可控的版本管理
  - 清晰的更新流程
---

# 全局工具管理规范

## 必装工具清单

### 核心工具

| 工具 | 用途 | 安装命令 | 最低版本 |
|------|------|----------|----------|
| **pnpm** | 高性能包管理器 | `npm i -g pnpm` | 8.0.0 |
| **ni** | 统一包管理器调用 | `npm i -g @antfu/ni` | 0.21.0 |
| **tsx** | TypeScript 执行器 | `pnpm add -g tsx` | 4.0.0 |
| **nodemon** | 文件监听重启 | `pnpm add -g nodemon` | 3.0.0 |

### 开发工具

| 工具 | 用途 | 安装命令 | 使用场景 |
|------|------|----------|----------|
| **npm-check-updates** | 依赖更新检查 | `pnpm add -g npm-check-updates` | 依赖管理 |
| **npkill** | 清理 node_modules | `pnpm add -g npkill` | 磁盘清理 |
| **npm-run-all** | 并行运行脚本 | `pnpm add -g npm-run-all` | 脚本管理 |
| **concurrently** | 并发执行命令 | `pnpm add -g concurrently` | 多任务 |

### 调试工具

| 工具 | 用途 | 安装命令 | 使用场景 |
|------|------|----------|----------|
| **ndb** | Chrome DevTools 调试 | `pnpm add -g ndb` | 高级调试 |
| **clinic** | 性能诊断 | `pnpm add -g clinic` | 性能分析 |
| **0x** | 火焰图生成 | `pnpm add -g 0x` | CPU 分析 |
| **why-is-node-running** | 进程分析 | `pnpm add -g why-is-node-running` | 内存泄漏 |

### 代码质量

| 工具 | 用途 | 安装命令 | 配置要求 |
|------|------|----------|----------|
| **eslint** | 代码检查 | `pnpm add -g eslint` | 项目级配置 |
| **prettier** | 代码格式化 | `pnpm add -g prettier` | 项目级配置 |
| **commitizen** | 规范化提交 | `pnpm add -g commitizen` | 配合 cz-conventional-changelog |
| **standard-version** | 版本发布 | `pnpm add -g standard-version` | 语义化版本 |

## 全局工具版本管理

### 版本锁定策略

```json
// global-tools.json
{
  "tools": {
    "pnpm": "8.15.0",
    "tsx": "^4.7.0",
    "@antfu/ni": "^0.21.0",
    "npm-check-updates": "^16.14.0",
    "nodemon": "^3.0.0"
  },
  "updatePolicy": {
    "pnpm": "minor",
    "tsx": "minor",
    "@antfu/ni": "patch",
    "npm-check-updates": "major"
  }
}
```

### 安装脚本

```bash
#!/bin/bash
# install-global-tools.sh

echo "🔧 安装全局工具..."

# 核心工具
npm install -g pnpm@8.15.0
pnpm add -g @antfu/ni@latest
pnpm add -g tsx@latest

# 开发工具
pnpm add -g npm-check-updates@latest
pnpm add -g npkill@latest
pnpm add -g npm-run-all@latest

# 可选工具（根据需要）
read -p "安装调试工具？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  pnpm add -g ndb clinic 0x
fi

echo "✅ 全局工具安装完成！"

# 验证安装
echo "📋 已安装的工具："
pnpm list -g --depth=0
```

## 安装位置配置

### npm 全局目录

```bash
# 查看当前位置
npm config get prefix
# 默认：/usr/local

# 修改为用户目录（避免权限问题）
npm config set prefix ~/.npm-global

# 添加到 PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### pnpm 全局目录

```bash
# 查看全局目录
pnpm config get global-dir
# 默认：~/.local/share/pnpm/global

# 查看全局 bin 目录
pnpm config get global-bin-dir
# 默认：~/.local/share/pnpm

# 自定义位置
pnpm config set global-dir ~/.pnpm-global
pnpm config set global-bin-dir ~/.pnpm-global/bin
```

### 按 Node 版本隔离

```bash
# 使用 fnm 时，全局包按版本隔离
fnm use 20
npm install -g typescript  # 安装到 Node 20

fnm use 18
npm install -g typescript  # 安装到 Node 18

# 查看特定版本的全局包
fnm exec --using=20 npm list -g --depth=0
```

## ni 工具使用

### 统一命令接口

```bash
# 安装依赖（自动检测包管理器）
ni              # npm install / pnpm install / yarn install

# 添加依赖
ni axios        # npm i axios / pnpm add axios

# 添加开发依赖
ni -D eslint    # npm i -D eslint / pnpm add -D eslint

# 运行脚本
nr dev          # npm run dev / pnpm dev
nr build        # npm run build / pnpm build

# 执行包
nx tsx          # npx tsx / pnpm dlx tsx

# 卸载
nun axios       # npm uninstall axios / pnpm remove axios

# 升级
nu              # npm update / pnpm update

# 清理
nc              # npm ci / pnpm install --frozen-lockfile
```

### 配置文件

```ini
# ~/.nirc
# 默认包管理器
defaultAgent=pnpm

# 全局包管理器
globalAgent=pnpm
```

## 工具更新策略

### 更新检查

```bash
# 检查全局包更新
npm outdated -g
pnpm outdated -g

# 使用 npm-check-updates
ncu -g

# 查看具体版本
npm view pnpm versions --json
```

### 更新流程

```bash
#!/bin/bash
# update-global-tools.sh

echo "🔍 检查全局工具更新..."

# 保存当前版本
pnpm list -g --depth=0 > global-tools-backup.txt

# 更新工具
pnpm update -g

# 验证更新
echo "📋 更新后的版本："
pnpm list -g --depth=0

# 测试关键工具
echo "🧪 测试工具..."
tsx --version
ni --version
ncu --version

echo "✅ 更新完成！"
```

### 版本回滚

```bash
# 卸载当前版本
pnpm remove -g <package>

# 安装指定版本
pnpm add -g <package>@<version>

# 从备份恢复
while read line; do
  if [[ $line == *"@"* ]]; then
    package=$(echo $line | cut -d'@' -f1)
    version=$(echo $line | cut -d'@' -f2)
    pnpm add -g "$package@$version"
  fi
done < global-tools-backup.txt
```

## 工具配置

### nodemon 配置

```json
// nodemon.json
{
  "watch": ["src"],
  "ext": "ts,js,json",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "tsx",
  "env": {
    "NODE_ENV": "development"
  },
  "delay": "1000"
}
```

### commitizen 配置

```json
// ~/.czrc
{
  "path": "cz-conventional-changelog",
  "defaultType": "feat",
  "defaultScope": "",
  "maxHeaderWidth": 100,
  "maxLineWidth": 100
}
```

## 最佳实践

### ✅ 推荐做法

1. **工具版本文档化**
   ```markdown
   ## Required Global Tools
   
   | Tool | Version | Install |
   |------|---------|---------|
   | pnpm | 8.15.0 | `npm i -g pnpm@8.15.0` |
   | tsx | ^4.7.0 | `pnpm add -g tsx` |
   ```

2. **团队工具同步**
   ```json
   // package.json
   {
     "scripts": {
       "setup:tools": "node scripts/install-tools.js",
       "check:tools": "node scripts/check-tools.js"
     }
   }
   ```

3. **按项目隔离**
   ```bash
   # 项目级工具（推荐）
   npm install --save-dev typescript eslint
   
   # 使用 npx 运行
   npx tsc
   npx eslint
   ```

### ❌ 避免做法

1. **过度全局安装** - 项目依赖应该本地安装
2. **忽略版本** - 全局工具也需要版本管理
3. **混用包管理器** - 统一使用一个包管理器管理全局包
4. **不清理旧版本** - 定期清理不用的全局包

## 故障排查

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 命令找不到 | PATH 配置错误 | 检查并更新 PATH |
| 权限错误 | 安装到系统目录 | 修改 prefix 到用户目录 |
| 版本冲突 | 多个版本共存 | 清理并重新安装 |
| 工具不工作 | Node 版本不兼容 | 检查工具的 Node 版本要求 |

### 诊断命令

```bash
# 查看全局包位置
npm root -g
pnpm root -g

# 查看 bin 目录
npm bin -g
pnpm bin -g

# 查看 PATH
echo $PATH | tr ':' '\n' | grep -E '(npm|pnpm|node)'

# 查看工具实际位置
which tsx
which pnpm

# 清理无用的全局包
pnpm list -g --depth=0
pnpm remove -g <unused-package>
```

---

*记住：全局工具应该少而精，大部分工具应该作为项目依赖安装。*