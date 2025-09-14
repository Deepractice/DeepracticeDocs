---
layer: Practice
type: How-to
title: 如何初始化生产级 Monorepo
category: node-development-environment
status: published
version: 2.1.0
date: 2025-01-14
author: Sean Jiang & Claude
tags:
  - Monorepo
  - How-to
  - 初始化
purpose: 指导完成 Monorepo 项目从零到生产就绪的初始化过程
scope:
  includes:
    - 环境准备步骤
    - 目录结构创建
    - 必要配置文件生成
    - 依赖安装和验证
    - 第一个包的创建示例
    - CI/CD 基础配置
  excludes:
    - 配置文件详解（→ monorepo-configuration.md）
    - 架构设计决策（→ monorepo-standard.md）
    - 高级特性配置
outcome:
  - 完成一个生产级 Monorepo 项目初始化
  - 所有工具链正常工作
  - 能够添加新的包和应用
dependencies:
  - ./monorepo-standard.md
  - /zh/practice/node-development-environment/nodejs/
related:
  - ./monorepo-configuration.md
  - ./understanding-monorepo-architecture.md
---

# 如何初始化生产级 Monorepo

## 任务目标

初始化一个包含完整工具链的生产级 Monorepo 项目。

## 前置条件

- Node.js >= 18.19.0
- pnpm >= 8.0.0
- Git 已初始化

## 步骤 1：创建基础结构

```bash
# 创建项目
mkdir my-project && cd my-project
git init

# 创建目录
mkdir -p apps packages services configs tools

# 创建 .gitignore
cat > .gitignore << 'EOF'
node_modules
dist
build
.turbo
.next
coverage
*.log
.DS_Store
.env.local
EOF
```

## 步骤 2：配置包管理器

```bash
# 设置 Node 版本
echo "18.19.0" > .nvmrc

# 配置 pnpm
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
  - 'configs/*'
  - 'tools/*'
EOF

# 配置 npmrc
cat > .npmrc << 'EOF'
shamefully-hoist=true
prefer-workspace-packages=true
auto-install-peers=true
strict-peer-dependencies=false
EOF
```

## 步骤 3：初始化根包

```bash
# 创建根 package.json
cat > package.json << 'EOF'
{
  "name": "my-project",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@8.14.0",
  "engines": {
    "node": ">=18.19.0",
    "pnpm": ">=8.0.0"
  },
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules",
    "fresh": "pnpm clean && pnpm install",
    "prepare": "lefthook install"
  }
}
EOF

# 安装基础依赖
pnpm add -D -w typescript@5 turbo lefthook prettier eslint
```

## 步骤 4：配置 TypeScript

```bash
# 根 tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "files": [],
  "references": []
}
EOF

# 基础配置
mkdir -p configs/typescript
cat > configs/typescript/base.json << 'EOF'
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "incremental": true,
    "isolatedModules": true
  },
  "exclude": ["node_modules", "dist", "build"]
}
EOF
```

## 步骤 5：配置 Turborepo

```bash
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"],
      "cache": true
    },
    "dev": {
      "dependsOn": ["^build"],
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "cache": false
    },
    "lint": {
      "cache": true
    },
    "type-check": {
      "dependsOn": ["^build"],
      "cache": true
    }
  }
}
EOF
```

## 步骤 6：配置代码质量工具

```bash
# ESLint 配置
cat > .eslintrc.json << 'EOF'
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "ignorePatterns": ["dist", "build", "node_modules"]
}
EOF

# Prettier 配置
cat > .prettierrc << 'EOF'
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all"
}
EOF

# 安装 ESLint 依赖
pnpm add -D -w @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier
```

## 步骤 7：配置 Git Hooks

```bash
cat > lefthook.yml << 'EOF'
pre-commit:
  parallel: true
  commands:
    format:
      glob: "*.{js,ts,tsx,json,md}"
      run: pnpm prettier --write {staged_files}
      stage_fixed: true
    lint:
      glob: "*.{js,ts,tsx}"
      run: pnpm eslint --fix {staged_files}
      stage_fixed: true

commit-msg:
  commands:
    validate:
      run: |
        commit_regex='^(feat|fix|docs|style|refactor|test|build|ci|chore)(\(.+\))?: .{1,50}'
        if ! grep -qE "$commit_regex" "$1"; then
          echo "❌ 提交信息必须符合约定式提交规范"
          exit 1
        fi
EOF

# 安装 Git Hooks
pnpm prepare
```

## 步骤 8：创建第一个包

```bash
# 创建 utils 包
mkdir -p packages/utils/src
cd packages/utils

# package.json
cat > package.json << 'EOF'
{
  "name": "@my-project/utils",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "dev": "tsc --watch",
    "build": "tsc",
    "lint": "eslint src",
    "type-check": "tsc --noEmit"
  }
}
EOF

# tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "extends": "../../configs/typescript/base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "composite": true,
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  },
  "include": ["src/**/*"]
}
EOF

# 示例代码
cat > src/index.ts << 'EOF'
export const hello = (name: string): string => {
  return `Hello, ${name}!`
}
EOF

cd ../..
```

## 步骤 9：验证设置

```bash
# 安装所有依赖
pnpm install

# 构建项目
pnpm build

# 运行类型检查
pnpm type-check

# 运行 lint
pnpm lint

# 测试 Git Hooks
git add -A
git commit -m "feat: initialize monorepo"
```

## 步骤 10：添加 CI/CD（可选）

```bash
# GitHub Actions
mkdir -p .github/workflows
cat > .github/workflows/ci.yml << 'EOF'
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm test
EOF
```

## 完成检查清单

- [ ] 目录结构创建完成
- [ ] pnpm workspace 配置完成
- [ ] TypeScript 配置完成
- [ ] Turborepo 配置完成
- [ ] ESLint + Prettier 配置完成
- [ ] Git Hooks 配置完成
- [ ] 第一个包创建成功
- [ ] 所有命令运行正常

## 常见问题解决

### pnpm 安装失败

```bash
# 清理缓存
pnpm store prune
rm -rf node_modules
pnpm install
```

### TypeScript 构建失败

```bash
# 清理构建缓存
tsc --build --clean
rm -rf packages/*/dist
pnpm build
```

### Git Hooks 不生效

```bash
# 重新安装
npx lefthook uninstall
npx lefthook install --force
```

## 下一步

- 查看[配置规范](./monorepo-configuration.md)了解完整配置选项
- 阅读[架构理解](./understanding-monorepo-architecture.md)深入理解原理
- 参考[基础架构规范](./monorepo-standard.md)了解核心概念

---

*记住：好的初始化决定了项目的长期可维护性。*