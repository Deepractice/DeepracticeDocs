---
layer: Practice
type: How-to
title: Turborepo 配置指南
category: node-development-environment/monorepo
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - Turborepo
  - 构建优化
  - 任务编排
  - Monorepo

purpose: 配置 Turborepo 实现高效的任务编排和构建缓存
scope:
  includes:
    - Turborepo 基础配置
    - Pipeline 任务编排
    - 缓存策略优化
    - 远程缓存配置
  excludes:
    - Monorepo 架构设计  # → monorepo-standard.md
    - pnpm workspace 配置  # → pnpm-workspace-standard.md
outcome:
  - 能配置高效的构建流水线
  - 能实现智能缓存和增量构建
  - 能优化 CI/CD 性能
---

# Turborepo 配置指南

## 概述

Turborepo 是一个高性能的构建系统，专为 Monorepo 设计，提供智能缓存、并行执行和增量构建能力。

## 快速开始

### 安装 Turborepo

```bash
# 在根目录安装
pnpm add -D -w turbo

# 初始化配置
npx turbo init
```

### 基础配置文件

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**", "tests/**"],
      "outputs": ["coverage/**"]
    }
  }
}
```

## Pipeline 配置详解

### 任务定义

```json
{
  "pipeline": {
    "build": {
      // 任务依赖关系
      "dependsOn": ["^build"],  // ^ 表示依赖的包先构建
      
      // 输出文件
      "outputs": [
        "dist/**",
        "build/**",
        ".next/**"
      ],
      
      // 输入文件（影响缓存）
      "inputs": [
        "src/**",
        "package.json",
        "tsconfig.json"
      ],
      
      // 环境变量
      "env": ["NODE_ENV", "API_URL"],
      
      // 缓存配置
      "cache": true
    }
  }
}
```

### 依赖关系类型

| 语法 | 含义 | 示例 |
|------|------|------|
| `[]` | 无依赖 | 可以立即执行 |
| `["build"]` | 同包依赖 | 先执行本包的 build |
| `["^build"]` | 依赖包优先 | 依赖的包先 build |
| `["..."]` | 所有依赖 | 依赖链上所有任务 |
| `["task1", "task2"]` | 多个依赖 | 等待所有任务完成 |

### 完整的 Pipeline 示例

```json
{
  "pipeline": {
    // 开发任务
    "dev": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^build"]
    },
    
    // 构建任务
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"],
      "env": ["NODE_ENV"]
    },
    
    // 类型检查
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": [],
      "inputs": ["src/**", "*.config.ts"]
    },
    
    // 代码检查
    "lint": {
      "outputs": [],
      "inputs": [
        "src/**",
        "*.config.js",
        ".eslintrc.*"
      ]
    },
    
    // 测试任务
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**", "tests/**"]
    },
    
    // 端到端测试
    "test:e2e": {
      "dependsOn": ["build"],
      "outputs": [],
      "env": ["BASE_URL", "CI"]
    },
    
    // 部署任务
    "deploy": {
      "dependsOn": ["build", "test", "lint"],
      "cache": false,
      "env": ["VERCEL_TOKEN", "AWS_ACCESS_KEY"]
    }
  }
}
```

## 缓存配置

### 本地缓存

```json
{
  "pipeline": {
    "build": {
      "cache": true,  // 启用缓存
      
      // 定义缓存键的输入
      "inputs": [
        "src/**",
        "package.json",
        "tsconfig.json",
        "!**/*.test.ts"  // 排除测试文件
      ],
      
      // 定义缓存的输出
      "outputs": [
        "dist/**",
        ".next/**",
        "!dist/**/*.map"  // 排除 source maps
      ]
    }
  }
}
```

### 环境变量处理

```json
{
  "globalEnv": [
    "NODE_ENV",
    "CI"
  ],
  "pipeline": {
    "build": {
      // 任务特定的环境变量
      "env": [
        "NEXT_PUBLIC_*",  // 通配符支持
        "API_URL"
      ],
      
      // 从文件读取环境变量
      "dependsOn": ["^build"],
      "globalDependencies": [
        ".env",
        ".env.production"
      ]
    }
  }
}
```

### 远程缓存配置

#### 使用 Vercel Remote Cache

```bash
# 登录 Vercel
npx turbo login

# 链接到 Vercel 团队
npx turbo link
```

配置 CI 环境：

```yaml
# .github/workflows/ci.yml
env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

#### 自建远程缓存

```json
// turbo.json
{
  "remoteCache": {
    "signature": true  // 启用签名验证
  }
}
```

配置环境变量：

```bash
# .env.local
TURBO_API=https://cache.example.com
TURBO_TOKEN=your-token
TURBO_TEAM=your-team
```

## 执行优化

### 并行执行配置

```json
// package.json
{
  "scripts": {
    // 最大并行度
    "build": "turbo build --concurrency=10",
    
    // 基于 CPU 核心数
    "build:auto": "turbo build --concurrency=100%",
    
    // 串行执行
    "build:serial": "turbo build --concurrency=1"
  }
}
```

### 过滤执行

```bash
# 只构建特定包
turbo build --filter=@org/app-web

# 包含依赖
turbo build --filter=@org/app-web...

# 包含被依赖
turbo build --filter=...@org/shared

# 基于改动
turbo build --filter=[origin/main]

# 组合过滤
turbo build --filter=@org/app-* --filter=!@org/app-admin
```

### 增量构建

```bash
# 只构建变更的包
turbo build --filter=[HEAD^1]

# CI 中的增量构建
turbo build --filter=[origin/main...HEAD]

# 跳过缓存
turbo build --force

# 只使用远程缓存
turbo build --remote-only
```

## 实战配置示例

### Next.js + API 项目

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "dev": {
      "dependsOn": ["^build"],
      "cache": false,
      "persistent": true,
      "env": ["PORT", "DATABASE_URL"]
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"],
      "env": ["NODE_ENV", "NEXT_PUBLIC_*"]
    },
    "start": {
      "dependsOn": ["build"],
      "cache": false
    },
    "lint": {
      "outputs": [],
      "inputs": [
        "src/**",
        "app/**",
        "pages/**",
        "components/**",
        ".eslintrc.*"
      ]
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

### 组件库项目

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "inputs": ["src/**", "!src/**/*.stories.tsx", "!src/**/*.test.tsx"]
    },
    "test": {
      "outputs": ["coverage/**"],
      "inputs": ["src/**", "tests/**"],
      "env": ["CI"]
    },
    "storybook": {
      "cache": false,
      "persistent": true,
      "env": ["STORYBOOK_*"]
    },
    "build:storybook": {
      "outputs": ["storybook-static/**"],
      "env": ["STORYBOOK_*"]
    }
  }
}
```

## CI/CD 集成

### GitHub Actions

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build and Test
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ vars.TURBO_TEAM }}
        run: |
          pnpm turbo build lint test \
            --filter=[origin/main] \
            --cache-dir=.turbo \
            --concurrency=2
```

### 缓存优化

```yaml
- name: Turbo Cache
  uses: actions/cache@v3
  with:
    path: .turbo
    key: turbo-${{ github.job }}-${{ github.ref_name }}-${{ github.sha }}
    restore-keys: |
      turbo-${{ github.job }}-${{ github.ref_name }}-
      turbo-${{ github.job }}-
```

## 监控和调试

### 分析构建性能

```bash
# 生成构建分析
turbo build --profile=profile.json

# 查看任务图
turbo build --graph

# 输出详细日志
turbo build --log-level=debug

# 试运行（不实际执行）
turbo build --dry-run
```

### 性能指标

```json
// turbo.json - 添加性能追踪
{
  "experimentalUI": true,
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],
      "outputMode": "new-only"  // 只显示新输出
    }
  }
}
```

### 故障排查

```bash
# 清理缓存
turbo daemon clean

# 停止后台进程
turbo daemon stop

# 验证配置
turbo run build --dry-run=json

# 检查缓存状态
turbo run build --summarize
```

## 高级配置

### 自定义缓存行为

```javascript
// turbo-cache.js
module.exports = {
  // 自定义缓存键生成
  hashFiles: (files) => {
    // 自定义哈希逻辑
    return customHash(files)
  },
  
  // 缓存存储位置
  cacheDir: '.turbo/cache',
  
  // 缓存有效期
  cacheTTL: 7 * 24 * 60 * 60 // 7天
}
```

### 任务编排策略

```json
{
  "pipeline": {
    // 瀑布流模式
    "release": {
      "dependsOn": [
        "build",
        "test",
        "lint",
        "typecheck"
      ],
      "cache": false
    },
    
    // 并行模式
    "validate": {
      "dependsOn": [
        "//#lint",      // 并行 lint
        "//#typecheck", // 并行 typecheck
        "//#test"       // 并行 test
      ]
    },
    
    // 条件执行
    "deploy:prod": {
      "dependsOn": ["build"],
      "cache": false,
      "env": ["DEPLOY_ENV"],
      "outputs": []
    }
  }
}
```

### 工作空间配置

```json
// apps/web/turbo.json - 包级别配置
{
  "extends": ["//"],
  "pipeline": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

## 最佳实践

### DO - 推荐做法

✅ **合理设置缓存**
- 准确定义 inputs 和 outputs
- 使用环境变量控制缓存
- 配置远程缓存加速 CI

✅ **优化任务依赖**
- 最小化依赖关系
- 合理使用 `^` 前缀
- 避免不必要的串行

✅ **监控性能**
- 定期分析构建时间
- 监控缓存命中率
- 优化慢任务

### DON'T - 避免做法

❌ **过度缓存**
- 不要缓存开发任务
- 避免缓存频繁变化的内容
- 不要忽视缓存失效

❌ **复杂依赖**
- 避免循环依赖
- 不要创建过深的依赖链
- 防止全量重建

❌ **忽视优化**
- 不要忽略构建性能
- 避免串行执行所有任务
- 不要禁用所有缓存

## 迁移指南

### 从 Lerna 迁移

```bash
# 1. 安装 Turborepo
pnpm add -D -w turbo

# 2. 创建 turbo.json
npx turbo init

# 3. 迁移脚本
# Lerna: lerna run build
# Turbo: turbo build

# 4. 更新 package.json
{
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "test": "turbo test"
  }
}
```

### 从 Nx 迁移

主要差异：
- Nx 使用 `nx.json` + `project.json`
- Turbo 使用 `turbo.json`
- Nx 有更多内置功能
- Turbo 更轻量和灵活

---

## 参考资源

- [Turborepo Docs](https://turbo.build/repo/docs) - 官方文档
- [Pipeline API](https://turbo.build/repo/docs/reference/configuration) - 配置参考
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) - 远程缓存
- [Monorepo Handbook](https://turbo.build/repo/docs/handbook) - 最佳实践

---

*记住：Turborepo 的核心价值在于智能缓存和并行执行，合理配置可以大幅提升构建效率。*