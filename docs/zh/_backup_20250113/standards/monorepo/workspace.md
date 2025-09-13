# 工作区配置

本章介绍 Monorepo 工作区的配置，包括包管理、依赖关系、任务编排等核心机制。

## pnpm Workspace 配置

### 1.1 工作区定义

#### 1.1.1 基础配置
`pnpm-workspace.yaml`：
```yaml
packages:
  - 'apps/*'      # 应用程序
  - 'packages/*'  # 共享包
  - 'services/*'  # 后端服务
  - 'configs/*'   # 共享配置
  - 'tools/*'     # 工具脚本
```

#### 1.1.2 配置说明
- **扁平结构**：每个目录下直接放置包，避免深层嵌套
- **职责分离**：按包的用途分类，不按技术栈分类
- **命名一致**：使用复数形式，全小写

### 1.2 包命名规范

#### 1.2.1 命名空间
```json
{
  "name": "@myproject/utils",     // 共享包
  "name": "@myproject/web-app",   // 应用程序
  "name": "@myproject/api-service" // 服务
}
```

#### 1.2.2 命名原则
- 使用统一的组织名作为命名空间
- 包名使用 kebab-case
- 名称要表达包的用途，不是技术实现

## 依赖管理

### 2.1 依赖类型

#### 2.1.1 工作区协议
```json
{
  "dependencies": {
    "@myproject/utils": "workspace:*",     // 始终使用最新
    "@myproject/types": "workspace:^1.0.0" // 版本约束
  }
}
```

#### 2.1.2 依赖分类
| 类型 | 位置 | 说明 | 示例 |
|------|------|------|------|
| **开发工具** | 根目录 | 全局共享的开发依赖 | TypeScript, ESLint |
| **构建工具** | 根目录 | 构建相关工具 | Turborepo, tsup |
| **内部依赖** | 各包 | workspace 协议引用 | `workspace:*` |
| **外部依赖** | 各包 | 包特定的依赖 | React, Express |
| **Peer 依赖** | 库包 | 由使用方提供 | React (for UI库) |

### 2.2 依赖安装

#### 2.2.1 常用命令
```bash
# 根目录安装（开发依赖）
pnpm add -D typescript -w

# 特定包安装
pnpm add express --filter @myproject/api

# 安装内部依赖
pnpm add @myproject/utils --filter @myproject/web

# 递归安装所有依赖
pnpm install -r

# 清理并重装
pnpm clean && pnpm install
```

#### 2.2.2 版本管理策略
```json
// 根目录 package.json
{
  "pnpm": {
    "overrides": {
      // 统一版本
      "typescript": "^5.3.3",
      "react": "^18.2.0"
    },
    "peerDependencyRules": {
      "ignoreMissing": [
        // 忽略某些 peer 依赖警告
        "@types/react"
      ]
    }
  }
}
```

## TypeScript 项目引用

### 3.1 项目引用配置

#### 3.1.1 根目录配置
`tsconfig.json`：
```json
{
  "files": [],
  "references": [
    { "path": "./packages/utils" },
    { "path": "./packages/types" },
    { "path": "./packages/ui" },
    { "path": "./apps/web" },
    { "path": "./services/api" }
  ]
}
```

#### 3.1.2 包配置
`packages/utils/tsconfig.json`：
```json
{
  "extends": "../../configs/typescript/base.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": "./src",
    "outDir": "./dist",
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  },
  "include": ["src/**/*"],
  "references": [
    // 依赖其他内部包
    { "path": "../types" }
  ]
}
```

### 3.2 构建优化

#### 3.2.1 增量构建
```bash
# 构建所有项目（增量）
tsc --build

# 强制重建
tsc --build --force

# 清理构建缓存
tsc --build --clean
```

#### 3.2.2 路径映射
```json
{
  "compilerOptions": {
    "paths": {
      "@myproject/*": ["./packages/*/src"],
      "@/*": ["./src/*"]
    }
  }
}
```

## Turborepo 任务编排

### 4.1 任务依赖关系

#### 4.1.1 任务定义
`turbo.json`：
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],  // 先构建依赖
      "outputs": ["dist/**", ".next/**"],
      "cache": true
    },
    "dev": {
      "dependsOn": ["^build"],  // 开发模式也需要先构建依赖
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],   // 测试前先构建
      "outputs": ["coverage/**"],
      "cache": false
    },
    "lint": {
      "outputs": [],
      "cache": true
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": [],
      "cache": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

#### 4.1.2 任务依赖说明
- `^` 前缀：上游依赖的任务
- 无前缀：当前包的任务
- `[]` 空数组：无依赖，可并行执行

### 4.2 缓存策略

#### 4.2.1 缓存配置
```json
{
  "tasks": {
    "build": {
      "inputs": [
        "src/**/*",
        "package.json",
        "tsconfig.json",
        "tsup.config.ts"
      ],
      "outputs": ["dist/**"],
      "cache": true,
      "env": ["NODE_ENV"]
    }
  }
}
```

#### 4.2.2 缓存管理
```bash
# 查看缓存状态
turbo run build --dry-run

# 清理缓存
turbo daemon clean

# 禁用缓存运行
turbo run build --force

# 远程缓存（团队共享）
turbo login
turbo link
```

## 包版本管理

### 5.1 版本策略

#### 5.1.1 版本方案选择
| 方案 | 适用场景 | 版本管理 | 发布频率 |
|------|---------|----------|----------|
| **Fixed** | 紧密耦合的包 | 统一版本号 | 同步发布 |
| **Independent** | 独立演进的包 | 独立版本号 | 按需发布 |
| **Grouped** | 分组管理 | 组内统一 | 分组发布 |

#### 5.1.2 本规范推荐
```json
// 开发阶段：所有包使用 workspace:*
{
  "dependencies": {
    "@myproject/utils": "workspace:*"
  }
}

// 发布阶段：转换为实际版本
{
  "dependencies": {
    "@myproject/utils": "^1.0.0"
  }
}
```

### 5.2 发布配置

#### 5.2.1 包发布设置
```json
{
  "name": "@myproject/utils",
  "version": "1.0.0",
  "publishConfig": {
    "access": "public",    // 公开包
    "registry": "https://registry.npmjs.org/"
  },
  "files": [
    "dist",
    "README.md"
  ]
}
```

#### 5.2.2 私有包配置
```json
{
  "name": "@myproject/internal-tools",
  "private": true,  // 不发布
  "version": "0.0.0"
}
```

## 依赖关系可视化

### 6.1 分析工具

#### 6.1.1 查看依赖图
```bash
# pnpm 内置命令
pnpm why @myproject/utils

# 查看所有工作区
pnpm list -r --depth 1

# 生成依赖图
turbo run build --graph
```

#### 6.1.2 循环依赖检测
```bash
# 使用 dpdm 检测循环依赖
pnpm add -D -w dpdm
pnpm dpdm --exit-code circular:1 --tree false ./packages/*/src/index.ts
```

### 6.2 依赖原则

#### 6.2.1 分层架构
```
apps/          (顶层：应用)
    ↓
services/      (中层：服务)
    ↓
packages/      (底层：共享包)
```

#### 6.2.2 依赖规则
- ✅ 上层可以依赖下层
- ✅ 同层可以互相依赖（谨慎）
- ❌ 下层不能依赖上层
- ❌ 避免循环依赖

## Monorepo 特定配置

### 7.1 Git 配置

#### 7.1.1 稀疏检出
`.git/info/sparse-checkout`：
```bash
# 只检出特定包
/packages/utils/
/packages/types/
/apps/web/
```

#### 7.1.2 Git Hooks 配置
```yaml
# lefthook.yml
pre-commit:
  commands:
    affected-lint:
      # 只检查受影响的包
      run: turbo run lint --filter=...[HEAD^]
```

### 7.2 CI/CD 优化

#### 7.2.1 并行构建
```yaml
# GitHub Actions 示例
- name: Build affected packages
  run: |
    turbo run build --filter=...[origin/main]
```

#### 7.2.2 缓存配置
```yaml
- uses: actions/cache@v3
  with:
    path: |
      .turbo
      node_modules/.cache
    key: ${{ runner.os }}-turbo-${{ hashFiles('**/pnpm-lock.yaml') }}
```

## 常见问题

### 幽灵依赖问题？
```json
// .npmrc
{
  "shamefully-hoist": false,  // 严格模式
  "auto-install-peers": true
}
```

### 内部包热更新不生效？
```bash
# 确保开启 watch 模式
pnpm dev  # 所有包都应该有 dev script

# tsup 配置
{
  "dev": "tsup --watch"
}
```

### 构建顺序错误？
```json
// turbo.json
{
  "build": {
    "dependsOn": ["^build"]  // 确保依赖先构建
  }
}
```

## 最佳实践

### DO ✅
- 使用 workspace 协议管理内部依赖
- 配置 TypeScript 项目引用加速构建
- 利用 Turborepo 缓存提升性能
- 保持依赖关系的单向流动

### DON'T ❌
- 不要在根目录安装业务依赖
- 避免循环依赖
- 不要忽视 peer dependencies
- 避免过度的包拆分

## 下一步

完成工作区配置后，你可以：

1. **[工程化规范](/zh/standards/monorepo/engineering)** - 自动化和质量保障
2. **开始实际开发** - 使用配置好的 Monorepo 环境
3. **测试模板项目** - 验证配置是否正确