---
layer: Practice
type: How-to
title: 包依赖管理指南
category: node-development-environment/monorepo
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - Monorepo
  - 依赖管理
  - pnpm
  - workspace

purpose: 解决 Monorepo 中复杂的包依赖管理问题
scope:
  includes:
    - 内部包依赖管理
    - 外部依赖优化
    - 版本冲突解决
    - 依赖更新策略
  excludes:
    - 包结构设计  # → package-structure-standard.md
    - 版本发布流程  # → version-management-guide.md
outcome:
  - 能正确管理包间依赖关系
  - 能解决版本冲突问题
  - 能优化依赖安装性能
---

# 包依赖管理指南

## 概述

在 Monorepo 中，依赖管理的复杂度随着包数量增长而急剧上升。本指南提供实用的依赖管理策略和问题解决方案。

## 依赖关系类型

### 内部依赖管理

#### 使用 Workspace 协议

```json
// packages/app/package.json
{
  "dependencies": {
    // ✅ 正确：使用 workspace 协议
    "@org/ui": "workspace:*",
    "@org/utils": "workspace:^1.0.0",
    
    // ❌ 错误：使用固定版本
    "@org/shared": "1.0.0",
    
    // ❌ 错误：使用 file 协议
    "@org/config": "file:../config"
  }
}
```

#### 依赖关系图

```mermaid
graph TD
    A[app-web] --> B[@org/ui]
    A --> C[@org/utils]
    B --> C
    B --> D[@org/styles]
    C --> E[@org/types]
    D --> E
```

### 外部依赖管理

#### 依赖位置决策

| 场景 | 安装位置 | 命令示例 |
|------|---------|----------|
| 所有包都需要 | 根目录 | `pnpm add -D -w typescript` |
| 特定包需要 | 包目录 | `pnpm add react --filter @org/ui` |
| 开发工具 | 根目录 | `pnpm add -D -w eslint` |
| 运行时依赖 | 包目录 | `pnpm add express --filter @org/api` |

## 如何管理依赖版本

### 步骤 1：统一核心依赖

创建版本catalog文件：

```javascript
// versions.js
module.exports = {
  // 核心依赖
  react: '^18.2.0',
  'react-dom': '^18.2.0',
  typescript: '^5.3.0',
  
  // 工具链
  vite: '^5.0.0',
  vitest: '^1.0.0',
  eslint: '^8.50.0',
  
  // 类型定义
  '@types/node': '^20.0.0',
  '@types/react': '^18.2.0'
}
```

使用 `.pnpmfile.cjs` 强制版本：

```javascript
// .pnpmfile.cjs
const versions = require('./versions')

module.exports = {
  hooks: {
    readPackage(pkg) {
      // 统一核心依赖版本
      for (const [name, version] of Object.entries(versions)) {
        if (pkg.dependencies?.[name]) {
          pkg.dependencies[name] = version
        }
        if (pkg.devDependencies?.[name]) {
          pkg.devDependencies[name] = version
        }
      }
      return pkg
    }
  }
}
```

### 步骤 2：配置依赖提升

```ini
# .npmrc
# 基础配置
shamefully-hoist=false
strict-peer-dependencies=true
auto-install-peers=true

# 选择性提升
hoist-pattern[]='*eslint*'
hoist-pattern[]='*prettier*'
hoist-pattern[]='@types/*'
hoist-pattern[]='*babel*'

# 公共模式
public-hoist-pattern[]='*eslint*'
public-hoist-pattern[]='@types/*'
```

### 步骤 3：处理 Peer Dependencies

```json
// packages/ui/package.json
{
  "peerDependencies": {
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0"
  },
  "peerDependenciesMeta": {
    "react-dom": {
      "optional": true
    }
  },
  "devDependencies": {
    // 开发时安装具体版本
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

## 如何解决版本冲突

### 场景 1：不同包需要不同版本

**问题**：
- Package A 需要 lodash@4
- Package B 需要 lodash@3

**解决方案**：

```json
// package.json (根目录)
{
  "pnpm": {
    "overrides": {
      "lodash@3": "4.17.21",
      "package-b>lodash": "4.17.21"
    }
  }
}
```

或使用别名：

```json
// packages/legacy/package.json
{
  "dependencies": {
    "lodash-v3": "npm:lodash@3.10.1",
    "lodash": "^4.17.21"
  }
}
```

### 场景 2：Peer Dependencies 版本不兼容

**问题**：
```
ERR_PNPM_PEER_DEP_ISSUES
@org/ui requires react@^17.0.0
@org/new-ui requires react@^18.0.0
```

**解决方案**：

选项 1 - 升级到兼容版本：
```bash
# 升级所有包到 React 18
pnpm update react react-dom -r --latest
```

选项 2 - 使用 pnpmfile 钩子：
```javascript
// .pnpmfile.cjs
module.exports = {
  hooks: {
    readPackage(pkg) {
      // 强制所有包使用 React 18
      if (pkg.peerDependencies?.react) {
        pkg.peerDependencies.react = '>=17.0.0 || ^18.0.0'
      }
      return pkg
    }
  }
}
```

### 场景 3：幽灵依赖问题

**问题**：代码能运行但未声明依赖

**检测方法**：
```bash
# 使用 depcheck 检测未声明的依赖
pnpm add -D -w depcheck
pnpm -r exec -- depcheck
```

**解决方案**：
```bash
# 添加缺失的依赖
pnpm add missing-package --filter @org/package

# 或在 .npmrc 中启用严格模式
echo "shamefully-hoist=false" >> .npmrc
```

## 如何优化依赖安装

### 使用缓存加速

```yaml
# GitHub Actions 示例
- name: Setup pnpm cache
  uses: actions/cache@v3
  with:
    path: |
      ~/.pnpm-store
      **/node_modules
    key: pnpm-${{ hashFiles('pnpm-lock.yaml') }}
```

### 并行安装优化

```ini
# .npmrc
# 增加网络并发数
network-concurrency=32

# 优先使用离线缓存
prefer-offline=true

# 减少重试次数
fetch-retries=1
```

### 精简依赖树

```bash
# 分析依赖大小
pnpm list --depth=0 --json | jq '.[] | {name, size}'

# 查找重复包
pnpm dedupe

# 清理未使用的包
pnpm prune
```

## 如何更新依赖

### 交互式更新

```bash
# 更新所有包的依赖
pnpm update -i -r --latest

# 只更新特定范围
pnpm update -i --filter "@org/*" --latest

# 更新到最新的次版本
pnpm update -i -r
```

### 自动化更新流程

```json
// package.json (根目录)
{
  "scripts": {
    "deps:check": "pnpm outdated -r",
    "deps:update": "pnpm update -i -r --latest",
    "deps:update:minor": "pnpm update -r",
    "deps:audit": "pnpm audit",
    "deps:audit:fix": "pnpm audit --fix"
  }
}
```

### 使用 Renovate 自动化

```json
// renovate.json
{
  "extends": ["config:base"],
  "packageRules": [
    {
      "matchPackagePatterns": ["*"],
      "matchUpdateTypes": ["patch"],
      "groupName": "all patch dependencies",
      "automerge": true
    },
    {
      "matchPackagePatterns": ["@org/*"],
      "matchUpdateTypes": ["minor", "patch"],
      "groupName": "internal packages",
      "automerge": true
    }
  ],
  "schedule": ["after 10pm on sunday"]
}
```

## 依赖分析工具

### 可视化依赖关系

```bash
# 生成依赖图
pnpm list --depth=2 --json > deps.json

# 使用 madge 分析
npx madge --circular packages/

# 使用 nx graph（如果安装了 nx）
npx nx graph
```

### 检测问题

```bash
# 检测循环依赖
pnpm -r exec -- npx madge --circular .

# 检测未使用的依赖
pnpm -r exec -- npx depcheck

# 检测安全漏洞
pnpm audit

# 检测许可证问题
npx license-checker --summary
```

## 最佳实践检查清单

### 版本管理

- [ ] 核心依赖版本统一
- [ ] 使用 workspace 协议引用内部包
- [ ] Peer dependencies 版本范围合理
- [ ] 定期更新依赖

### 性能优化

- [ ] 合理配置依赖提升
- [ ] CI 配置缓存
- [ ] 定期执行 `pnpm dedupe`
- [ ] 清理未使用的依赖

### 安全性

- [ ] 定期运行 `pnpm audit`
- [ ] 及时修复安全漏洞
- [ ] 检查依赖许可证
- [ ] 避免使用废弃的包

### 可维护性

- [ ] 依赖关系清晰
- [ ] 无循环依赖
- [ ] 无幽灵依赖
- [ ] 文档完善

## 故障排查

### 常见错误及解决

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `Cannot find module` | 依赖未安装或链接错误 | 重新安装：`pnpm install` |
| `Peer dep missing` | 缺少 peer 依赖 | 安装缺失的包或使用 `auto-install-peers=true` |
| `Version mismatch` | 版本冲突 | 使用 overrides 或统一版本 |
| `ENOENT` | 符号链接断开 | 清理并重装：`pnpm clean && pnpm install` |
| `Circular dependency` | 循环依赖 | 重构代码，解除循环 |

### 调试命令

```bash
# 查看实际安装的版本
pnpm list packageName

# 查看为什么安装了某个包
pnpm why packageName

# 查看包的依赖树
pnpm list --depth=3 --filter @org/package

# 验证 workspace 配置
pnpm list --depth=-1 --json

# 检查锁文件完整性
pnpm install --frozen-lockfile
```

## 进阶技巧

### 条件依赖

```json
// 根据环境安装不同依赖
{
  "optionalDependencies": {
    "fsevents": "^2.3.0"  // 仅在 macOS 安装
  }
}
```

### 依赖注入模式

```typescript
// packages/core/src/container.ts
export class Container {
  private dependencies = new Map()
  
  register(name: string, factory: () => any) {
    this.dependencies.set(name, factory)
  }
  
  resolve<T>(name: string): T {
    const factory = this.dependencies.get(name)
    if (!factory) throw new Error(`Dependency ${name} not found`)
    return factory()
  }
}
```

### 动态导入

```typescript
// 延迟加载大型依赖
async function processData(data: any) {
  const { heavyLibrary } = await import('heavy-library')
  return heavyLibrary.process(data)
}
```

---

## 参考资源

- [pnpm Workspace](https://pnpm.io/workspaces) - Workspace 文档
- [Dependency Management](https://pnpm.io/package_json) - package.json 规范
- [Renovate Docs](https://docs.renovatebot.com/) - 自动化更新工具
- [madge](https://github.com/pahen/madge) - 依赖分析工具

---

*记住：良好的依赖管理是 Monorepo 成功的基础，投入时间建立规范是值得的。*