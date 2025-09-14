---
layer: Practice
type: Reference
title: npm/pnpm 配置标准
category: nodejs-environment  
status: published
version: 1.0.0
date: 2025-01-14
author: Sean Jiang & Claude
tags:
  - npm
  - pnpm
  - 包管理
  - 依赖管理
  - Registry

purpose: 统一组织内 npm/pnpm 包管理器的配置和使用标准
scope:
  includes:
    - 包管理器选择策略
    - Registry 配置规范
    - 依赖安装配置
    - 缓存和存储优化
    - 发布配置标准
    - 安全配置
  excludes:
    - 具体包的使用方法  # 属于各包文档
    - 私有 Registry 搭建  # 属于 DevOps
outcome:
  - 统一的包管理器配置
  - 快速可靠的依赖安装
  - 规范的包发布流程
---

# npm/pnpm 配置标准

## 包管理器选择

### 选择矩阵

| 项目类型 | 推荐工具 | 理由 |
|----------|----------|------|
| **Monorepo 项目** | pnpm | 原生 workspace、高效存储 |
| **单体应用** | pnpm | 速度快、节省空间 |
| **简单项目** | npm | Node.js 自带、零配置 |
| **遗留项目** | 保持原有 | 避免迁移风险 |

### 版本要求

```bash
# 最低版本要求
npm >= 10.0.0   # Node.js 20 自带
pnpm >= 8.0.0   # 最新稳定版

# 推荐版本
pnpm 8.14.0     # 2025-01 最新稳定版
```

## pnpm 配置（推荐）

### 全局配置

```bash
# ~/.npmrc 或 ~/.config/pnpm/rc
# pnpm 全局配置

# 存储配置
store-dir=~/.pnpm-store                    # 全局存储位置
package-import-method=auto                 # 自动选择最佳导入方式
prefer-symlinked-executables=true         # 优先使用符号链接

# 性能优化
prefer-offline=true                       # 优先使用缓存
network-concurrency=16                    # 并发请求数
fetch-retries=3                          # 重试次数
fetch-retry-factor=2                     # 重试延迟因子
fetch-retry-mintimeout=10000            # 最小重试延迟
fetch-retry-maxtimeout=60000            # 最大重试延迟

# 安全配置
strict-peer-dependencies=false            # 宽松的 peer 依赖（按需调整）
auto-install-peers=true                  # 自动安装 peer 依赖
resolve-peers-from-workspace-root=true   # 从工作区根解析 peer

# 输出配置
loglevel=warn                            # 日志级别
color=auto                               # 自动颜色输出
```

### 项目配置

```yaml
# .npmrc (项目根目录)
# Registry 配置
registry=https://registry.npmmirror.com
@mycompany:registry=https://npm.mycompany.com

# pnpm 特定配置
shamefully-hoist=false                   # 不提升依赖（推荐）
public-hoist-pattern[]=*eslint*         # 选择性提升
public-hoist-pattern[]=*prettier*
enable-pre-post-scripts=true            # 启用 pre/post 脚本

# 工作区配置
shared-workspace-lockfile=true          # 共享 lockfile
link-workspace-packages=true            # 链接工作区包
prefer-workspace-packages=true          # 优先使用工作区包
```

### pnpm-workspace.yaml

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'tools/*'
  - '!**/test/**'
  
# 目录结构示例
# monorepo/
# ├── pnpm-workspace.yaml
# ├── package.json
# ├── packages/
# │   ├── package-a/
# │   └── package-b/
# └── apps/
#     ├── web/
#     └── api/
```

## npm 配置

### 全局配置

```bash
# ~/.npmrc
# npm 全局配置

# Registry 配置
registry=https://registry.npmmirror.com

# 缓存配置
cache=~/.npm                            # 缓存目录
cache-min=3600                          # 缓存最短时间（秒）
prefer-offline=true                     # 优先离线

# 安全配置
audit-level=moderate                    # 审计级别
fund=false                              # 不显示资金信息

# 行为配置
save-exact=false                        # 不使用精确版本
engine-strict=true                      # 严格引擎检查
scripts-prepend-node-path=true         # 脚本使用项目 node
```

### 项目配置对比

| 配置项 | npm | pnpm | 说明 |
|--------|-----|------|------|
| **lockfile** | package-lock.json | pnpm-lock.yaml | 锁定文件 |
| **node_modules** | 嵌套/扁平 | 符号链接 | 依赖结构 |
| **workspace** | workspaces 字段 | pnpm-workspace.yaml | 工作区配置 |
| **存储** | 缓存 | 全局存储 | 包存储方式 |

## Registry 配置

### 镜像源选择

| 源名称 | 地址 | 推荐场景 |
|--------|------|----------|
| **npm 官方** | https://registry.npmjs.org | 发布包 |
| **淘宝镜像** | https://registry.npmmirror.com | 国内安装 |
| **腾讯镜像** | https://mirrors.cloud.tencent.com/npm | 腾讯云 |
| **私有 Registry** | https://npm.company.com | 企业内部包 |

### 多 Registry 配置

```bash
# .npmrc
# 默认 Registry
registry=https://registry.npmmirror.com

# Scope 级别配置
@company:registry=https://npm.company.com
@vue:registry=https://registry.npmjs.org

# 认证配置（私有 Registry）
//npm.company.com/:_authToken=${NPM_TOKEN}
//npm.company.com/:always-auth=true
```

### Registry 切换工具

```bash
# 使用 nrm 管理 Registry
npm install -g nrm

# 列出所有 Registry
nrm ls

# 切换 Registry
nrm use taobao
nrm use npm

# 添加自定义 Registry
nrm add company https://npm.company.com
```

## 依赖管理

### 依赖类型规范

| 类型 | 用途 | 安装到 | 示例 |
|------|------|--------|------|
| **dependencies** | 运行时依赖 | 生产 | express, react |
| **devDependencies** | 开发时依赖 | 开发 | eslint, jest |
| **peerDependencies** | 宿主依赖 | 由宿主提供 | react (插件包) |
| **optionalDependencies** | 可选依赖 | 失败不影响 | fsevents |

### 版本范围策略

```json
{
  "dependencies": {
    "express": "^4.18.0",      // 次版本兼容（推荐）
    "lodash": "~4.17.21",      // 补丁版本兼容
    "react": "18.2.0",         // 精确版本（框架类）
    "beta-lib": "next",        // 标签版本（谨慎）
    "@company/lib": "workspace:*"  // 工作区版本（pnpm）
  }
}
```

### 依赖安装优化

```bash
# pnpm 安装优化
pnpm install --frozen-lockfile    # CI 环境（不更新 lockfile）
pnpm install --prefer-offline     # 优先离线（加速）
pnpm install --ignore-scripts     # 跳过脚本（安全）

# npm 安装优化  
npm ci                            # CI 环境（清洁安装）
npm install --prefer-offline     # 优先离线
npm install --no-audit           # 跳过审计（加速）
```

## 发布配置

### 发布前检查

```json
// package.json
{
  "scripts": {
    "prepublishOnly": "npm run test && npm run build",
    "preversion": "npm test",
    "version": "npm run build && git add -A dist",
    "postversion": "git push && git push --tags"
  },
  "files": [
    "dist",
    "src",
    "!src/**/*.test.js"
  ],
  "publishConfig": {
    "registry": "https://registry.npmjs.org",
    "access": "public"
  }
}
```

### .npmignore 规范

```bash
# .npmignore
# 开发文件
.vscode/
.idea/
*.log
.env*

# 测试文件
**/*.test.js
**/*.spec.js
coverage/
.nyc_output/

# 源码（如果只发布构建后的）
src/
!dist/

# 文档和示例
docs/
examples/
*.md
!README.md

# 配置文件
.eslintrc*
.prettierrc*
jest.config.js
```

## 安全配置

### 审计和修复

```bash
# pnpm 审计
pnpm audit                      # 检查漏洞
pnpm audit --fix               # 自动修复
pnpm update --latest --interactive  # 交互式更新

# npm 审计
npm audit                       # 检查漏洞
npm audit fix                  # 自动修复
npm audit fix --force          # 强制修复（谨慎）
```

### 安全最佳实践

```bash
# 1. 使用 lockfile
git add pnpm-lock.yaml         # 始终提交 lockfile

# 2. 定期更新依赖
pnpm update --interactive      # 交互式选择更新

# 3. 检查过时包
pnpm outdated                  # 列出过时包

# 4. 使用安全 Registry
registry=https://registry.npmjs.org  # 官方源
strict-ssl=true                      # 强制 SSL
```

## 性能优化

### pnpm 性能配置

```bash
# 并发优化
network-concurrency=32         # 提高并发数（带宽充足时）

# 存储优化
package-import-method=clone   # 克隆方式（某些文件系统更快）
prefer-frozen-lockfile=false  # 开发时允许更新

# 缓存优化
store-dir=/ssd/.pnpm-store   # SSD 存储位置
verify-store-integrity=false  # 跳过完整性检查（信任环境）
```

### 磁盘空间管理

```bash
# pnpm 存储管理
pnpm store prune              # 清理未使用的包
pnpm store status            # 查看存储状态
pnpm store path              # 显示存储路径

# npm 缓存管理
npm cache verify             # 验证缓存
npm cache clean --force      # 清理缓存
```

## CI/CD 配置

### GitHub Actions

```yaml
# .github/workflows/ci.yml
- name: Setup pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 8.14.0

- name: Install dependencies
  run: pnpm install --frozen-lockfile
  
- name: Run build
  run: pnpm run build
```

### 通用 CI 配置

```bash
# CI 环境变量
CI=true
NPM_CONFIG_LOGLEVEL=error
NPM_CONFIG_PROGRESS=false
NPM_CONFIG_AUDIT=false
```

## 故障排除

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| **EACCES 权限错误** | 全局安装权限 | 使用 pnpm 或修改 npm prefix |
| **peer deps 警告** | peer 依赖未满足 | pnpm 设置 auto-install-peers |
| **lockfile 冲突** | 并发修改 | 重新生成 lockfile |
| **安装速度慢** | 网络或镜像问题 | 使用国内镜像 |

### 诊断命令

```bash
# 查看配置
pnpm config list
npm config list

# 查看 Registry
npm config get registry
pnpm config get registry

# 查看缓存位置
npm config get cache
pnpm store path

# 调试安装
pnpm install --reporter=append-only
npm install --verbose
```

## 迁移指南

### 从 npm 迁移到 pnpm

```bash
# 1. 安装 pnpm
npm install -g pnpm

# 2. 导入项目
rm -rf node_modules package-lock.json
pnpm import  # 从 package-lock.json 生成 pnpm-lock.yaml
pnpm install

# 3. 更新脚本
# package.json 中 npm 命令改为 pnpm

# 4. 配置 CI/CD
# 更新 CI 配置使用 pnpm
```

---

## 参考资源

- [pnpm Documentation](https://pnpm.io)
- [npm Documentation](https://docs.npmjs.com)
- [Node.js Package Manager Comparison](https://pnpm.io/benchmarks)

---

*记住：选择合适的包管理器并正确配置，能显著提升开发效率。*