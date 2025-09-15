---
layer: Practice
type: Index
title: 包管理策略规范
category: node-development-environment/package-management
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - 包管理
  - 依赖管理
  - pnpm
  - npm
  - 版本控制

# 目录级 PSO
purpose: 定义依赖包的管理策略和最佳实践，作为父级 PSO 中包管理部分的具体实施指南
scope:
  includes:
    - 包管理器选择和配置（pnpm、npm、yarn）
    - 依赖版本策略（锁定、范围、更新）
    - 依赖分类管理（dependencies、devDependencies、peerDependencies）
    - 私有包管理（scope、registry、发布）
    - 依赖安全扫描（audit、更新策略）
    - Monorepo 依赖管理（workspace、版本同步）
  excludes:
    - 具体包的使用方法
    - 框架特定的依赖
    - CDN 资源管理
    - Docker 镜像管理
outcome:
  - 统一的包管理策略
  - 可控的依赖版本
  - 安全的依赖更新流程
  - 高效的包安装速度
---

# 包管理策略规范

## 概述

包管理是 Node.js 项目的核心环节。良好的包管理策略能够：
- 确保依赖版本的一致性
- 提高安装速度和效率
- 减少安全漏洞风险
- 简化依赖更新流程

## 包管理器选择

### pnpm（推荐）

**优势**：
- 🚀 **速度最快** - 通过硬链接节省时间
- 💾 **磁盘占用最少** - 全局存储，项目共享
- 🔒 **严格的依赖** - 杜绝幽灵依赖
- 📦 **原生 Workspace** - Monorepo 最佳选择

**配置**：
```bash
# 安装
npm install -g pnpm

# 配置
pnpm config set store-dir ~/.pnpm-store
pnpm config set registry https://registry.npmmirror.com
```

### npm（备选）

**适用场景**：
- 简单项目
- CI/CD 默认环境
- 无需 Workspace 功能

### 包管理器强制

```json
// package.json
{
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "pnpm": ">=8.15.0",
    "npm": "please-use-pnpm",
    "yarn": "please-use-pnpm"
  }
}
```

## 依赖分类

### dependencies vs devDependencies

| 类型 | 用途 | 示例 | 安装时机 |
|------|------|------|----------|
| **dependencies** | 运行时需要 | express、react | 生产环境 |
| **devDependencies** | 开发时需要 | eslint、vitest | 开发环境 |
| **peerDependencies** | 宿主提供 | react（组件库） | 不自动安装 |
| **optionalDependencies** | 可选功能 | fsevents | 失败不影响 |

### 正确分类示例

```json
{
  "dependencies": {
    // 运行时必需
    "express": "^4.18.0",
    "dotenv": "^16.3.0",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    // 开发工具
    "@types/node": "^20.11.0",
    "@types/express": "^4.17.0",
    "typescript": "^5.3.0",
    "vitest": "^1.2.0",
    "eslint": "^9.0.0",
    "prettier": "^3.2.0"
  },
  "peerDependencies": {
    // 要求宿主提供
    "react": ">=18.0.0"
  },
  "peerDependenciesMeta": {
    // 标记为可选
    "react": {
      "optional": true
    }
  }
}
```

## 版本策略

### 语义化版本

```
主版本.次版本.修订版本
MAJOR.MINOR.PATCH
```

| 变更类型 | 版本部分 | 示例 | 说明 |
|---------|---------|------|------|
| 破坏性变更 | MAJOR | 1.0.0 → 2.0.0 | API 不兼容 |
| 新功能 | MINOR | 1.0.0 → 1.1.0 | 向后兼容的新功能 |
| Bug 修复 | PATCH | 1.0.0 → 1.0.1 | 向后兼容的修复 |

### 版本范围策略

```json
{
  "dependencies": {
    // 精确版本（推荐用于关键依赖）
    "critical-lib": "1.2.3",
    
    // 补丁版本更新（推荐默认策略）
    "normal-lib": "~1.2.3",  // >=1.2.3 <1.3.0
    
    // 次版本更新（适用于活跃维护的库）
    "trusted-lib": "^1.2.3",  // >=1.2.3 <2.0.0
    
    // 范围指定（特殊需求）
    "special-lib": ">=1.2.3 <1.5.0",
    
    // 最新版本（仅用于开发依赖）
    "dev-tool": "latest"
  }
}
```

### 锁文件管理

**pnpm-lock.yaml 最佳实践**：

1. **必须提交** - 锁文件必须进入版本控制
2. **不要手动编辑** - 通过命令更新
3. **定期更新** - 每周检查更新
4. **冲突解决** - 删除后重新安装

```bash
# 更新锁文件
pnpm install --lockfile-only

# 根据锁文件安装
pnpm install --frozen-lockfile

# CI 环境安装
pnpm install --frozen-lockfile --prefer-offline
```

## 依赖安装优化

### .npmrc 配置

```ini
# .npmrc
# 镜像源
registry=https://registry.npmmirror.com

# pnpm 特定配置
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=true
prefer-workspace-packages=true

# 性能优化
network-concurrency=16
fetch-retries=3
fetch-retry-mintimeout=10000
fetch-retry-maxtimeout=60000

# 安全设置
engine-strict=true
save-exact=false

# 缓存设置
store-dir=~/.pnpm-store
cache-dir=~/.pnpm-cache
```

### 安装脚本

```json
// package.json
{
  "scripts": {
    // 开发环境安装
    "install:dev": "pnpm install",
    
    // 生产环境安装
    "install:prod": "pnpm install --prod --frozen-lockfile",
    
    // CI 环境安装
    "install:ci": "pnpm install --frozen-lockfile --prefer-offline",
    
    // 清理安装
    "install:clean": "rm -rf node_modules pnpm-lock.yaml && pnpm install"
  }
}
```

## Workspace 依赖管理

### 内部包引用

```json
// packages/ui/package.json
{
  "name": "@monorepo/ui",
  "version": "1.0.0"
}

// apps/web/package.json
{
  "dependencies": {
    // workspace 协议
    "@monorepo/ui": "workspace:*",
    
    // 指定版本
    "@monorepo/utils": "workspace:^1.0.0",
    
    // 精确版本
    "@monorepo/types": "workspace:1.0.0"
  }
}
```

### 共享依赖管理

```json
// 根 package.json
{
  "pnpm": {
    "overrides": {
      // 统一版本
      "react": "^18.2.0",
      "typescript": "^5.3.0",
      
      // 修复漏洞
      "vulnerable-package": "^2.0.0",
      
      // 强制使用 fork
      "broken-package": "npm:fixed-package@1.0.0"
    },
    "peerDependencyRules": {
      "ignoreMissing": ["@types/react"],
      "allowedVersions": {
        "react": "18"
      }
    }
  }
}
```

## 依赖更新策略

### 更新工具

```bash
# 安装更新工具
pnpm add -g npm-check-updates

# 检查更新
ncu

# 更新 package.json
ncu -u

# 交互式更新
ncu -i

# 只更新补丁版本
ncu -t patch
```

### 更新流程

```bash
# 1. 检查过期依赖
pnpm outdated

# 2. 更新依赖
pnpm update              # 在版本范围内更新
pnpm update --latest     # 更新到最新版本

# 3. 更新特定包
pnpm update express

# 4. 递归更新（Monorepo）
pnpm update -r

# 5. 交互式更新
pnpm update -i --latest
```

### 自动化更新

使用 Renovate 配置：

```json
// renovate.json
{
  "extends": ["config:base"],
  "packageRules": [
    {
      "matchPackagePatterns": ["*"],
      "matchUpdateTypes": ["minor", "patch"],
      "groupName": "all non-major dependencies",
      "automerge": true
    },
    {
      "matchPackagePatterns": ["eslint", "prettier"],
      "groupName": "linting tools"
    }
  ],
  "schedule": ["before 3am on Monday"],
  "timezone": "Asia/Shanghai"
}
```

## 安全管理

### 漏洞扫描

```bash
# pnpm 审计
pnpm audit

# 修复漏洞
pnpm audit --fix

# 生产依赖审计
pnpm audit --prod

# 设置审计级别
pnpm audit --audit-level=moderate
```

### 安全策略

1. **定期扫描** - 每周运行 audit
2. **及时更新** - 高危漏洞 24 小时内修复
3. **版本锁定** - 关键依赖使用精确版本
4. **最小依赖** - 定期清理无用依赖

## 私有包管理

### 私有 Registry

```bash
# 设置私有源
pnpm config set @company:registry https://npm.company.com

# 登录私有源
pnpm login --registry https://npm.company.com

# 发布到私有源
pnpm publish --registry https://npm.company.com
```

### Scope 配置

```ini
# .npmrc
@company:registry=https://npm.company.com
@another:registry=https://npm.another.com
//npm.company.com/:_authToken=${NPM_TOKEN}
```

## 故障排查

### 常见问题

**Q: 安装速度慢**
```bash
# 使用镜像
pnpm config set registry https://registry.npmmirror.com

# 增加并发
pnpm config set network-concurrency 16

# 使用离线模式
pnpm install --prefer-offline
```

**Q: 幽灵依赖**
```bash
# 检查依赖
pnpm why package-name

# 严格模式
echo "hoist=false" >> .npmrc
```

**Q: 版本冲突**
```bash
# 查看依赖树
pnpm list

# 强制重新安装
pnpm install --force
```

## 最佳实践

### ✅ 应该做的

1. **提交锁文件** - pnpm-lock.yaml 必须进入 Git
2. **定期更新** - 每周检查和更新依赖
3. **分类正确** - 区分 dependencies 和 devDependencies
4. **使用 workspace** - Monorepo 项目使用 workspace 协议

### ❌ 不应该做的

1. **混用包管理器** - 不要在同一项目混用 npm/yarn/pnpm
2. **忽略漏洞** - 不要忽视 audit 警告
3. **滥用 latest** - 生产依赖不要使用 latest
4. **手动改锁文件** - 不要手动编辑 lock 文件

## 迁移指南

### 从 npm 迁移到 pnpm

```bash
# 1. 删除 npm 文件
rm -rf node_modules package-lock.json

# 2. 安装 pnpm
npm install -g pnpm

# 3. 安装依赖
pnpm install

# 4. 更新脚本
# package.json 中的 npm 改为 pnpm
```

## 相关资源

### 内部文档
- [Node.js 开发环境规范](../index.md) - 父级规范
- [Node.js 环境配置](../nodejs/index.md) - 包管理器安装
- [Monorepo 项目组织](../monorepo/index.md) - Workspace 管理

### 外部资源
- [pnpm 文档](https://pnpm.io) - 官方文档
- [npm 文档](https://docs.npmjs.com) - npm 官方文档
- [语义化版本](https://semver.org/lang/zh-CN/) - 版本规范

---

*记住：依赖管理如同项目的血液系统，保持健康的依赖关系是项目长期成功的关键。*