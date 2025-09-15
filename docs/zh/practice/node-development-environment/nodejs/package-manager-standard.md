---
layer: Practice
type: Reference
title: 包管理器配置标准
category: node-development-environment/nodejs
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - pnpm
  - 包管理
  - 依赖管理

purpose: 定义 pnpm 作为标准包管理器的配置规范
scope:
  includes:
    - pnpm 配置标准
    - 依赖管理策略
    - 工作空间配置
    - 性能优化设置
  excludes:
    - 其他包管理器详细配置
    - 私有仓库搭建
outcome:
  - 统一的包管理器配置
  - 优化的依赖管理
  - 高效的磁盘使用
---

# 包管理器配置标准

## 为什么选择 pnpm

### 核心优势

| 特性 | pnpm | npm | yarn |
|------|------|-----|------|
| **磁盘空间** | 共享存储 ✅ | 重复安装 ❌ | 重复安装 ❌ |
| **安装速度** | 最快 ⚡ | 较慢 🐌 | 快 ⚡ |
| **依赖隔离** | 严格 ✅ | 宽松 ⚠️ | 宽松 ⚠️ |
| **Monorepo** | 原生支持 ✅ | workspace ✅ | workspace ✅ |
| **安全性** | 最高 🔒 | 标准 🔓 | 标准 🔓 |

### 磁盘使用对比

```
项目数量: 100个
平均依赖: 1000个包

npm:  100 × 1GB = 100GB
yarn: 100 × 1GB = 100GB  
pnpm: 1GB + 100 × 0.1GB = 11GB (节省 89%)
```

## pnpm 配置标准

### 全局配置（~/.npmrc）

```ini
# 存储设置
store-dir=~/.pnpm-store
package-import-method=auto
use-store-server=false

# 性能优化
prefer-frozen-lockfile=true
resolution-mode=highest
fetch-retries=3
fetch-retry-factor=2
fetch-retry-mintimeout=10000
fetch-retry-maxtimeout=60000

# 安全设置
audit-level=moderate
engine-strict=true

# 镜像配置（国内用户）
registry=https://registry.npmmirror.com
```

### 项目配置（.npmrc）

```ini
# 依赖管理
shamefully-hoist=false
strict-peer-dependencies=true
auto-install-peers=false
dedupe-peer-dependents=true

# 性能设置
prefer-frozen-lockfile=true
resolution-mode=highest

# 版本控制
save-exact=false
save-prefix=^

# 安全
engine-strict=true
```

### 配置详解

| 配置项 | 默认值 | 推荐值 | 说明 |
|--------|--------|--------|------|
| `shamefully-hoist` | false | **false** | 不提升依赖，保持隔离 |
| `strict-peer-dependencies` | false | **true** | 严格检查 peer 依赖 |
| `auto-install-peers` | false | **false** | 不自动安装 peer 依赖 |
| `prefer-frozen-lockfile` | false | **true** | CI 环境优先使用锁文件 |
| `resolution-mode` | lowest | **highest** | 使用最高兼容版本 |
| `save-exact` | false | **false** | 使用语义化版本 |
| `engine-strict` | false | **true** | 强制引擎版本检查 |

## 依赖管理策略

### 依赖类型

| 类型 | 用途 | 安装命令 | package.json 字段 |
|------|------|----------|-------------------|
| **生产依赖** | 运行时需要 | `pnpm add` | dependencies |
| **开发依赖** | 开发时需要 | `pnpm add -D` | devDependencies |
| **Peer 依赖** | 宿主提供 | 手动添加 | peerDependencies |
| **可选依赖** | 可有可无 | `pnpm add -O` | optionalDependencies |

### 版本策略

```json
{
  "dependencies": {
    "express": "^4.18.0",      // 次版本更新
    "lodash": "~4.17.21",       // 补丁更新
    "critical-lib": "4.2.1",    // 锁定版本
    "local-pkg": "workspace:*"  // 工作空间包
  }
}
```

### 依赖更新策略

| 更新类型 | 命令 | 风险等级 | 建议频率 |
|----------|------|----------|----------|
| **补丁更新** | `pnpm update` | 低 ✅ | 每周 |
| **次版本更新** | `pnpm update --latest` | 中 ⚠️ | 每月 |
| **主版本更新** | `pnpm add pkg@latest` | 高 ⛔ | 按需 |

## 工作空间配置

### pnpm-workspace.yaml

```yaml
packages:
  # 应用
  - 'apps/*'
  # 包
  - 'packages/*'
  # 工具
  - 'tools/*'
  # 排除
  - '!**/test/**'
```

### 工作空间依赖

```json
{
  "dependencies": {
    "@myorg/shared": "workspace:*",
    "@myorg/utils": "workspace:^1.0.0"
  }
}
```

### 工作空间命令

```bash
# 在所有包中执行
pnpm -r build

# 在特定包中执行
pnpm --filter @myorg/app build

# 并行执行
pnpm -r --parallel build

# 拓扑顺序执行
pnpm -r --workspace-concurrency=1 build
```

## 性能优化

### 缓存设置

```ini
# .npmrc
# 缓存目录
cache-dir=~/.pnpm-cache
# 缓存时间（分钟）
cache-min=10080
# 离线模式
prefer-offline=true
```

### 并发设置

```ini
# 网络并发
network-concurrency=16
# 子进程并发
child-concurrency=5
# 工作空间并发
workspace-concurrency=4
```

### 磁盘优化

```bash
# 清理未使用的包
pnpm store prune

# 查看存储状态
pnpm store status

# 验证存储完整性
pnpm store verify
```

## 安全配置

### 审计设置

```json
{
  "scripts": {
    "audit": "pnpm audit",
    "audit:fix": "pnpm audit --fix",
    "audit:ci": "pnpm audit --audit-level=moderate"
  }
}
```

### 锁文件管理

```bash
# 生成锁文件
pnpm install --lockfile-only

# 验证锁文件
pnpm install --frozen-lockfile

# 更新锁文件
pnpm update --lockfile-only
```

### 依赖检查

```bash
# 检查过时依赖
pnpm outdated

# 检查未使用依赖
pnpm prune

# 检查重复依赖
pnpm dedupe
```

## 迁移指南

### 从 npm 迁移

```bash
# 1. 删除 node_modules 和锁文件
rm -rf node_modules package-lock.json

# 2. 安装 pnpm
npm install -g pnpm

# 3. 创建配置
echo "packageManager=pnpm@8.15.0" >> package.json

# 4. 安装依赖
pnpm install
```

### 从 yarn 迁移

```bash
# 1. 导入 yarn.lock
pnpm import

# 2. 删除 yarn 文件
rm yarn.lock .yarnrc.yml

# 3. 更新脚本
sed -i 's/yarn/pnpm/g' package.json
```

## 常见命令对照

| 操作 | npm | yarn | pnpm |
|------|-----|------|------|
| 安装依赖 | `npm install` | `yarn` | `pnpm install` |
| 添加依赖 | `npm install pkg` | `yarn add pkg` | `pnpm add pkg` |
| 删除依赖 | `npm uninstall pkg` | `yarn remove pkg` | `pnpm remove pkg` |
| 更新依赖 | `npm update` | `yarn upgrade` | `pnpm update` |
| 运行脚本 | `npm run dev` | `yarn dev` | `pnpm dev` |
| 清理缓存 | `npm cache clean` | `yarn cache clean` | `pnpm store prune` |

## 故障排除

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| EACCES 权限错误 | 全局目录权限 | 修改 store-dir 位置 |
| peer deps 警告 | 缺少 peer 依赖 | 手动安装或设置 auto-install-peers |
| 幽灵依赖 | 依赖提升问题 | 设置 shamefully-hoist=false |
| 安装速度慢 | 网络或镜像 | 使用国内镜像源 |

### 调试命令

```bash
# 查看配置
pnpm config list

# 查看包信息
pnpm list --depth=0

# 查看依赖树
pnpm list --depth=999

# 验证项目
pnpm install --verify-store-integrity
```

## 最佳实践

1. **始终提交锁文件** - pnpm-lock.yaml 必须进入版本控制
2. **CI 使用 frozen-lockfile** - 确保依赖版本一致
3. **定期清理存储** - 每月执行 pnpm store prune
4. **使用工作空间** - Monorepo 项目使用 workspace
5. **严格模式** - 启用 strict-peer-dependencies
6. **版本约束** - 使用 packageManager 字段
7. **定期审计** - 集成安全审计到 CI

---

*记住：pnpm 不仅节省磁盘空间，更重要的是提供了严格的依赖隔离和更好的安全性。*