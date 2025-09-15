---
layer: Practice
type: Reference
title: 包管理器配置规范
category: node-development-environment/nodejs
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - npm
  - pnpm
  - yarn
  - 包管理器

purpose: 定义 npm、pnpm、yarn 等包管理器的配置和使用标准
scope:
  includes:
    - 包管理器选择策略
    - 配置文件规范
    - 镜像源管理
    - 性能优化配置
  excludes:
    - 具体包的使用
    - 私有仓库搭建
    - CI/CD 缓存配置
outcome:
  - 统一的包管理器配置
  - 优化的安装速度
  - 一致的依赖管理
---

# 包管理器配置规范

## 包管理器选择

### 对比矩阵

| 特性 | npm | pnpm | yarn | 推荐场景 |
|------|-----|------|------|----------|
| **磁盘效率** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | pnpm（节省 50%+） |
| **安装速度** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | pnpm > yarn > npm |
| **Monorepo** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | pnpm workspace |
| **生态兼容** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | npm（最广泛） |
| **锁文件** | ✅ | ✅ | ✅ | 都支持 |
| **学习曲线** | ⭐ | ⭐⭐ | ⭐⭐ | npm 最简单 |

### 选择决策

```mermaid
graph TD
    A[选择包管理器] --> B{项目类型}
    B -->|Monorepo| C[pnpm]
    B -->|单体应用| D{团队偏好}
    D -->|性能优先| E[pnpm]
    D -->|稳定优先| F[npm]
    D -->|功能丰富| G[yarn]
    B -->|开源库| H[npm]
```

## pnpm 配置（推荐）

### 全局配置

```bash
# ~/.npmrc 或 ~/.config/pnpm/rc
# 镜像源
registry=https://registry.npmmirror.com

# 存储路径
store-dir=~/.pnpm-store
cache-dir=~/.pnpm-cache

# 性能优化
prefer-frozen-lockfile=true
strict-peer-dependencies=false
auto-install-peers=true

# 安全设置
audit-level=moderate
fund=false

# 网络设置
network-timeout=60000
fetch-retries=3
fetch-retry-factor=2
fetch-retry-mintimeout=10000
fetch-retry-maxtimeout=60000
```

### 项目配置

```ini
# .npmrc
# 基础设置
auto-install-peers=true
shamefully-hoist=true
strict-peer-dependencies=false
enable-pre-post-scripts=true

# Monorepo 设置
shared-workspace-lockfile=true
link-workspace-packages=deep
prefer-workspace-packages=true

# 性能优化
side-effects-cache=true
package-import-method=auto

# 输出设置
loglevel=warn
```

### pnpm-workspace.yaml

```yaml
packages:
  # 所有直接子包
  - 'packages/*'
  # 所有嵌套包
  - 'packages/**'
  # 排除测试目录
  - '!**/test/**'
  # 应用目录
  - 'apps/*'
  # 共享配置
  - 'configs/*'
```

## npm 配置

### 全局配置

```bash
# 查看所有配置
npm config list

# 基础配置
npm config set registry https://registry.npmmirror.com
npm config set cache ~/.npm-cache
npm config set prefix ~/.npm-global

# 性能配置
npm config set fetch-retries 5
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000

# 安全配置
npm config set audit-level moderate
npm config set fund false

# 日志配置
npm config set loglevel warn
```

### 项目 .npmrc

```ini
# .npmrc
# 镜像源
registry=https://registry.npmmirror.com

# 版本管理
save-exact=true
engine-strict=true

# 安装行为
legacy-peer-deps=false
install-links=false
prefer-offline=false

# 脚本执行
scripts-prepend-node-path=true
```

## yarn 配置

### 全局配置

```bash
# Yarn 1.x
yarn config set registry https://registry.npmmirror.com
yarn config set cache-folder ~/.yarn-cache
yarn config set prefix ~/.yarn-global

# Yarn Berry (2.x+)
yarn config set npmRegistryServer https://registry.npmmirror.com
yarn config set enableGlobalCache true
yarn config set globalFolder ~/.yarn/berry
```

### .yarnrc.yml (Yarn 2+)

```yaml
# .yarnrc.yml
npmRegistryServer: "https://registry.npmmirror.com"

nodeLinker: node-modules

enableGlobalCache: true
enableTelemetry: false

packageExtensions:
  # 修复已知的依赖问题
  "package-name@*":
    dependencies:
      missing-dep: "*"

yarnPath: .yarn/releases/yarn-3.6.0.cjs
```

## 镜像源管理

### 常用镜像源

| 源名称 | URL | 说明 |
|--------|-----|------|
| **npm 官方** | https://registry.npmjs.org | 原始源，国内慢 |
| **淘宝镜像** | https://registry.npmmirror.com | 国内首选 |
| **腾讯云** | https://mirrors.cloud.tencent.com/npm | 备选方案 |
| **华为云** | https://mirrors.huaweicloud.com/npm | 备选方案 |

### nrm 工具

```bash
# 安装
npm install -g nrm

# 列出所有源
nrm ls

# 切换源
nrm use taobao
nrm use npm

# 添加自定义源
nrm add company http://npm.company.com

# 测试速度
nrm test
```

### 项目级镜像配置

```ini
# .npmrc
# 主镜像
registry=https://registry.npmmirror.com

# 特定 scope 使用不同源
@company:registry=http://npm.company.com
@types:registry=https://registry.npmjs.org

# 特定包使用不同源
sqlite3:registry=https://registry.npmjs.org
```

## 性能优化

### 并发设置

```bash
# npm
npm config set maxsockets 10

# pnpm
pnpm config set network-concurrency 16

# yarn
yarn config set network-concurrency 10
```

### 缓存优化

```bash
# 清理缓存
npm cache clean --force
pnpm store prune
yarn cache clean

# 离线模式
npm install --prefer-offline
pnpm install --offline
yarn install --offline
```

### 安装优化

```json
{
  "scripts": {
    // 生产环境只安装 dependencies
    "install:prod": "npm ci --production",
    
    // 使用锁文件快速安装
    "install:ci": "npm ci",
    
    // 强制重新安装
    "install:fresh": "rm -rf node_modules package-lock.json && npm install"
  }
}
```

## 锁文件管理

### 锁文件对比

| 文件 | 包管理器 | 特点 |
|------|----------|------|
| `package-lock.json` | npm | 详细、体积大 |
| `pnpm-lock.yaml` | pnpm | YAML 格式、可读性好 |
| `yarn.lock` | yarn 1.x | 自定义格式 |
| `.yarn/cache` | yarn 2+ | Zero-Install |

### 最佳实践

1. **必须提交锁文件**
   ```gitignore
   # ✅ 正确：不忽略锁文件
   node_modules/
   
   # ❌ 错误：忽略锁文件
   # package-lock.json
   # pnpm-lock.yaml
   ```

2. **使用 CI 命令**
   ```json
   {
     "scripts": {
       "install:ci": "pnpm install --frozen-lockfile",
       "install:dev": "pnpm install"
     }
   }
   ```

3. **锁文件冲突解决**
   ```bash
   # 删除并重新生成
   rm pnpm-lock.yaml
   pnpm install
   
   # 或使用专用命令
   pnpm install --force
   ```

## 私有包配置

### 认证配置

```ini
# .npmrc
# 私有仓库地址
@company:registry=https://npm.company.com

# 认证 token
//npm.company.com/:_authToken=${NPM_TOKEN}

# 始终认证
always-auth=true
```

### 发布配置

```json
{
  "publishConfig": {
    "registry": "https://npm.company.com",
    "access": "restricted",
    "tag": "latest"
  }
}
```

## 安全配置

### 审计设置

```bash
# 运行审计
npm audit
pnpm audit
yarn audit

# 自动修复
npm audit fix
pnpm audit fix

# 设置审计级别
npm config set audit-level moderate
```

### 安全最佳实践

1. **定期更新依赖**
   ```bash
   # 检查过期包
   npm outdated
   pnpm outdated
   
   # 更新依赖
   npm update
   pnpm update
   ```

2. **使用 lock 文件**
   ```bash
   # CI 环境使用
   npm ci
   pnpm install --frozen-lockfile
   ```

3. **限制脚本执行**
   ```ini
   # .npmrc
   ignore-scripts=true
   ```

## 故障排查

### 常见问题

| 问题 | 解决方案 |
|------|----------|
| 安装超时 | 切换镜像源、增加超时时间 |
| 权限错误 | 修改 npm prefix、使用 sudo |
| 缓存损坏 | 清理缓存、删除 node_modules |
| 版本冲突 | 使用 overrides/resolutions |
| 锁文件冲突 | 删除并重新生成 |

### 调试命令

```bash
# 查看配置
npm config list
pnpm config list

# 查看缓存位置
npm config get cache
pnpm store path

# 详细日志
npm install --verbose
pnpm install --reporter=append-only

# 清理环境
rm -rf node_modules package-lock.json
npm cache clean --force
```

---

*记住：选择合适的包管理器并正确配置，可以节省 50% 的安装时间和磁盘空间。*