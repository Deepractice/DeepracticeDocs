---
layer: Practice
type: Reference
title: pnpm Workspace 配置规范
category: node-development-environment/monorepo
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - pnpm
  - workspace
  - 包管理
  - Monorepo

purpose: 定义 pnpm workspace 的标准配置和使用规范
scope:
  includes:
    - workspace 配置文件规范
    - 依赖管理策略
    - 命令使用标准
    - 性能优化配置
  excludes:
    - pnpm 安装和基础使用  # → 见 package-manager-standard.md
    - Monorepo 架构设计  # → 见 monorepo-standard.md
outcome:
  - 能正确配置 pnpm workspace
  - 能高效管理包间依赖
  - 能优化安装和构建性能
---

# pnpm Workspace 配置规范

## 概述

pnpm workspace 是 pnpm 提供的 Monorepo 解决方案，通过硬链接和符号链接实现高效的依赖管理。本规范定义了 pnpm workspace 的配置标准和最佳实践。

## 核心配置文件

### pnpm-workspace.yaml

workspace 配置的核心文件，定义包的位置：

```yaml
# pnpm-workspace.yaml
packages:
  # 应用程序
  - 'apps/*'
  # 共享包
  - 'packages/*'
  # 配置包
  - 'configs/*'
  # 工具包
  - 'tools/*'
  # 排除特定目录
  - '!**/test/**'
  - '!**/dist/**'
```

### .npmrc 配置

pnpm 行为配置：

```ini
# .npmrc
# 严格模式：不允许未声明的依赖
strict-peer-dependencies=true
auto-install-peers=true

# 依赖提升配置
shamefully-hoist=false
hoist-pattern[]=*eslint*
hoist-pattern[]=*prettier*
hoist-pattern[]='@types/*'

# 性能优化
prefer-frozen-lockfile=false
resolution-mode=highest

# 包发布配置
link-workspace-packages=deep
prefer-workspace-packages=true

# 缓存目录（可选）
store-dir=~/.pnpm-store

# 虚拟存储目录
virtual-store-dir=node_modules/.pnpm

# 模块目录
modules-dir=node_modules
```

## 依赖管理策略

### 依赖类型和位置

| 依赖类型 | 安装位置 | 示例 | 命令 |
|----------|----------|------|------|
| **共享依赖** | 根目录 | TypeScript, ESLint | `pnpm add -D -w typescript` |
| **应用依赖** | 应用目录 | React, Next.js | `pnpm add react --filter app-web` |
| **包依赖** | 包目录 | 工具库依赖 | `pnpm add lodash --filter @org/utils` |
| **开发依赖** | 根目录（通常） | 构建工具 | `pnpm add -D -w vite` |

### Workspace 协议

使用 workspace 协议引用内部包：

```json
{
  "dependencies": {
    "@org/shared": "workspace:*",      // 总是使用最新版本
    "@org/utils": "workspace:^1.0.0",   // 兼容版本
    "@org/config": "workspace:~1.0.0"   // 补丁版本
  }
}
```

发布时的版本替换规则：

| workspace 协议 | 发布后版本 | 说明 |
|---------------|-----------|------|
| `workspace:*` | 当前实际版本 | 发布时替换为确切版本 |
| `workspace:^` | `^x.x.x` | 保持语义化版本前缀 |
| `workspace:~` | `~x.x.x` | 保持语义化版本前缀 |

## 常用命令规范

### 全局操作

```bash
# 安装所有依赖
pnpm install

# 添加根依赖
pnpm add -D -w typescript

# 更新所有包的依赖
pnpm update -r

# 递归执行命令
pnpm -r exec -- rm -rf dist

# 清理所有 node_modules
pnpm -r exec -- rm -rf node_modules
pnpm store prune
```

### 过滤操作

```bash
# 在特定包运行命令
pnpm --filter @org/app-web dev

# 包含依赖的包
pnpm --filter @org/app-web... build

# 包含被依赖的包
pnpm --filter ...@org/shared build

# 基于目录过滤
pnpm --filter "./apps/*" test

# 基于改动过滤（需要 Git）
pnpm --filter "[origin/main]" test

# 组合过滤
pnpm --filter "@org/app-*" --filter="!@org/app-admin" build
```

### 依赖管理

```bash
# 查看依赖树
pnpm list --depth=2

# 查看为什么安装了某个包
pnpm why react

# 检查过期依赖
pnpm outdated -r

# 交互式更新
pnpm update -i -r --latest

# 审计安全漏洞
pnpm audit

# 修复安全问题
pnpm audit --fix
```

## 性能优化配置

### 依赖提升策略

```ini
# .npmrc - 选择性提升
# 默认不提升，避免幽灵依赖
shamefully-hoist=false

# 只提升必要的包
hoist-pattern[]=*eslint*
hoist-pattern[]=*prettier*
hoist-pattern[]='@types/*'
hoist-pattern[]='*babel*'

# 公共依赖模式
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]='@types/*'
```

### 缓存优化

```ini
# .npmrc - 缓存配置
# 使用全局存储
store-dir=~/.pnpm-store

# 优先使用缓存
prefer-offline=true

# 网络并发数
network-concurrency=16

# 获取重试次数
fetch-retries=2
fetch-retry-factor=2
fetch-retry-mintimeout=10000
fetch-retry-maxtimeout=60000
```

### 构建优化

```json
// package.json - 并行脚本
{
  "scripts": {
    "build": "pnpm -r --parallel --filter='./packages/*' build",
    "build:apps": "pnpm --filter='./apps/*' build",
    "build:deps-first": "pnpm -r --filter='./packages/*' build && pnpm --filter='./apps/*' build"
  }
}
```

## 目录结构规范

### 标准 Monorepo 结构

```
project/
├── apps/                    # 应用程序
│   ├── web/
│   │   ├── package.json
│   │   └── node_modules/   # 应用特定依赖
│   └── mobile/
├── packages/               # 共享包
│   ├── ui/
│   │   ├── package.json
│   │   └── node_modules/  # 包特定依赖
│   └── utils/
├── node_modules/          # 根依赖和提升的依赖
│   └── .pnpm/            # pnpm 虚拟存储
├── pnpm-workspace.yaml   # Workspace 配置
├── pnpm-lock.yaml       # 锁文件
├── .npmrc              # pnpm 配置
└── package.json        # 根 package.json
```

### 包命名规范

```json
// packages/ui/package.json
{
  "name": "@org/ui",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  }
}
```

## 脚本配置规范

### 根目录脚本

```json
// 根 package.json
{
  "scripts": {
    // 开发
    "dev": "turbo dev",
    "dev:web": "pnpm --filter @org/app-web dev",
    
    // 构建
    "build": "turbo build",
    "build:packages": "pnpm -r --filter='./packages/*' build",
    
    // 测试
    "test": "turbo test",
    "test:watch": "turbo test:watch",
    "test:coverage": "turbo test:coverage",
    
    // 代码质量
    "lint": "turbo lint",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "typecheck": "turbo typecheck",
    
    // 依赖管理
    "clean": "pnpm -r exec -- rm -rf dist node_modules",
    "deps:check": "pnpm outdated -r",
    "deps:update": "pnpm update -i -r --latest",
    
    // 发布
    "changeset": "changeset",
    "version": "changeset version",
    "release": "pnpm build && changeset publish"
  }
}
```

### 包脚本规范

```json
// packages/*/package.json
{
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup",
    "test": "vitest",
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit"
  }
}
```

## 常见问题处理

### 问题 1：幽灵依赖

**问题描述**：
代码中使用了未在 package.json 中声明的依赖

**解决方案**：
```ini
# .npmrc
# 使用严格模式
shamefully-hoist=false
# 只提升必要的包
hoist-pattern[]='@types/*'
```

### 问题 2：Peer Dependencies 冲突

**问题描述**：
不同包需要不同版本的 peer dependency

**解决方案**：
```ini
# .npmrc
auto-install-peers=true
strict-peer-dependencies=false  # 开发时可以关闭
```

或使用 `.pnpmfile.cjs` 统一版本：

```javascript
// .pnpmfile.cjs
module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.peerDependencies?.react) {
        pkg.peerDependencies.react = '^18.0.0'
      }
      return pkg
    }
  }
}
```

### 问题 3：构建顺序问题

**问题描述**：
包之间有构建依赖，需要按顺序构建

**解决方案**：
```bash
# 使用 --filter 的依赖语法
# 先构建 shared 的所有依赖
pnpm --filter ...@org/shared build
# 再构建 shared
pnpm --filter @org/shared build
# 最后构建依赖 shared 的包
pnpm --filter @org/shared... build
```

### 问题 4：CI 环境优化

**问题描述**：
CI 环境安装依赖耗时过长

**解决方案**：
```yaml
# .github/workflows/ci.yml
- name: Setup pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 8

- name: Get pnpm store directory
  id: pnpm-cache
  run: echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

- name: Setup pnpm cache
  uses: actions/cache@v3
  with:
    path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-store-

- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

## 最佳实践

### 锁文件管理

✅ **推荐**：
- 始终提交 `pnpm-lock.yaml`
- CI 使用 `--frozen-lockfile`
- 定期更新依赖并测试
- 使用 `overrides` 修复版本冲突

❌ **避免**：
- 手动编辑锁文件
- 忽略锁文件警告
- 在不同环境使用不同版本的 pnpm

### 版本管理

✅ **推荐**：
- 内部包使用 `workspace:*` 协议
- 统一管理共享依赖版本
- 使用 Changesets 管理版本发布
- 遵循语义化版本规范

❌ **避免**：
- 内部包使用固定版本引用
- 不同包使用不同版本的核心依赖
- 手动修改版本号

### 性能优化

✅ **推荐**：
- 合理配置依赖提升
- 使用 `--filter` 减少操作范围
- 启用并行执行
- 定期清理存储

❌ **避免**：
- 过度使用 `shamefully-hoist`
- 忽视构建顺序依赖
- 安装不必要的依赖
- 重复的依赖声明

## 迁移指南

### 从 npm/yarn workspace 迁移

1. **安装 pnpm**：
```bash
npm install -g pnpm
```

2. **生成 pnpm-workspace.yaml**：
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

3. **转换 lock 文件**：
```bash
pnpm import  # 从 package-lock.json 或 yarn.lock 导入
```

4. **更新 workspace 协议**：
```bash
# 将 file: 协议改为 workspace:
# "dependency": "file:../package" → "dependency": "workspace:*"
```

5. **清理并重新安装**：
```bash
rm -rf node_modules
pnpm install
```

## 故障排查

### 诊断命令

```bash
# 检查 workspace 配置
pnpm list --depth=-1

# 验证包之间的依赖关系
pnpm list --depth=1 --filter @org/app-web

# 检查循环依赖
pnpm list --depth=Infinity | grep "circular"

# 查看存储状态
pnpm store status

# 清理无用的包
pnpm store prune
```

### 常见错误处理

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `ERR_PNPM_PEER_DEP_ISSUES` | Peer 依赖版本冲突 | 检查并统一 peer 依赖版本 |
| `ERR_PNPM_NO_MATCHING_VERSION` | 找不到匹配版本 | 检查私有源配置或版本号 |
| `ERR_PNPM_LINKING_FAILED` | 链接失败 | 清理 node_modules 重新安装 |
| `ERR_PNPM_FETCH_404` | 包不存在 | 检查包名或注册源 |

---

## 参考资源

- [pnpm Workspace 文档](https://pnpm.io/workspaces) - 官方 workspace 文档
- [pnpm CLI 参考](https://pnpm.io/cli/add) - 命令行参考
- [.npmrc 配置](https://pnpm.io/npmrc) - 配置文件详解
- [Changesets](https://github.com/changesets/changesets) - 版本管理工具

---

*记住：pnpm workspace 的核心优势是节省磁盘空间和保证依赖一致性，合理利用这些特性。*