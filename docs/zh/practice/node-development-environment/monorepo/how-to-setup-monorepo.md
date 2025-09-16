---
layer: Practice
type: How-to
title: 如何搭建 Monorepo
category: node-development-environment/monorepo
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - Monorepo
  - 实战指南
  - pnpm
  - Turborepo

purpose: 从零开始搭建一个生产级 Monorepo 项目
scope:
  progression:  # 递进式步骤
    1. 初始化项目结构
    2. 配置 pnpm workspace
    3. 创建第一个包
    4. 配置 TypeScript
    5. 设置 Turborepo
    6. 配置代码质量工具
    7. 实现版本管理
    8. 配置 CI/CD
outcome:
  - 拥有完整的 Monorepo 项目
  - 掌握每个配置的作用
  - 能够独立维护和扩展
---

# 如何搭建 Monorepo

## 概述

本指南将带你从零开始，一步步搭建一个生产级的 Monorepo 项目，包含完整的工具链配置。

## 前置准备

### 环境要求

```bash
# 检查 Node.js 版本（需要 >= 18）
node --version

# 安装 pnpm（如果未安装）
npm install -g pnpm@8

# 检查 pnpm 版本
pnpm --version
```

## 步骤 1：初始化项目结构

### 创建项目目录

```bash
# 创建项目
mkdir my-monorepo && cd my-monorepo

# 初始化 Git
git init

# 创建 .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/
out/
*.tsbuildinfo

# Cache
.turbo/
.cache/

# Env files
.env
.env.local
.env.*.local

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea/
*.swp
*.swo
.DS_Store

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Testing
coverage/
.nyc_output/

# Misc
*.pem
.vercel
EOF
```

### 创建基础目录结构

```bash
# 创建目录结构
mkdir -p apps packages configs tools

# 创建占位文件
touch apps/.gitkeep packages/.gitkeep configs/.gitkeep tools/.gitkeep
```

### 初始化根 package.json

```json
{
  "name": "my-monorepo",
  "private": true,
  "version": "0.0.0",
  "description": "My Monorepo Project",
  "author": "Your Name",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.0",
  "scripts": {
    "dev": "echo 'Run pnpm dev --filter <package>'",
    "build": "echo 'Run pnpm build --filter <package>'",
    "test": "echo 'Run pnpm test'",
    "lint": "echo 'Run pnpm lint'",
    "clean": "rm -rf node_modules **/node_modules **/.turbo **/dist"
  }
}
```

## 步骤 2：配置 pnpm Workspace

### 创建 pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'configs/*'
  - 'tools/*'
```

### 创建 .npmrc

```ini
# pnpm 配置
strict-peer-dependencies=true
auto-install-peers=true
shamefully-hoist=false

# 提升模式
hoist-pattern[]=*eslint*
hoist-pattern[]=*prettier*
hoist-pattern[]='@types/*'

# 性能优化
resolution-mode=highest
prefer-workspace-packages=true
link-workspace-packages=deep
```

### 安装基础依赖

```bash
# 安装根目录开发依赖
pnpm add -D -w typescript @types/node
```

## 步骤 3：创建第一个包

### 创建共享工具包

```bash
# 创建包目录
mkdir -p packages/utils/src

# 创建 package.json
cat > packages/utils/package.json << 'EOF'
{
  "name": "@my-org/utils",
  "version": "0.0.1",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "vitest": "^1.0.0"
  }
}
EOF

# 创建源文件
cat > packages/utils/src/index.ts << 'EOF'
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
EOF
```

### 创建第一个应用

```bash
# 创建应用目录
mkdir -p apps/web/src

# 创建 package.json
cat > apps/web/package.json << 'EOF'
{
  "name": "@my-org/app-web",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@my-org/utils": "workspace:*",
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0"
  }
}
EOF
```

## 步骤 4：配置 TypeScript

### 创建基础 tsconfig

```bash
# 根目录 tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": false,
    
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": true,
    
    "baseUrl": ".",
    "paths": {
      "@my-org/*": ["packages/*/src"]
    }
  },
  "exclude": ["node_modules", "dist", "build", ".turbo"]
}
EOF
```

### 为包创建 tsconfig

```bash
# packages/utils/tsconfig.json
cat > packages/utils/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules", "**/*.test.ts"]
}
EOF
```

### 配置 tsup

```bash
# packages/utils/tsup.config.ts
cat > packages/utils/tsup.config.ts << 'EOF'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true
})
EOF
```

## 步骤 5：设置 Turborepo

### 安装 Turborepo

```bash
pnpm add -D -w turbo
```

### 创建 turbo.json

```json
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
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

### 更新根目录脚本

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "clean": "turbo clean && rm -rf node_modules"
  }
}
```

## 步骤 6：配置代码质量工具

### 配置 ESLint

```bash
# 创建配置包
mkdir -p configs/eslint

# 创建 ESLint 配置包
cat > configs/eslint/package.json << 'EOF'
{
  "name": "@my-org/config-eslint",
  "version": "0.0.1",
  "private": true,
  "main": "index.js",
  "dependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.50.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0"
  }
}
EOF

# 创建 ESLint 配置
cat > configs/eslint/index.js << 'EOF'
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }]
  },
  ignorePatterns: ['dist', 'build', 'node_modules', '.turbo']
}
EOF
```

### 配置 Prettier

```bash
# 创建 .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "avoid"
}
EOF

# 创建 .prettierignore
cat > .prettierignore << 'EOF'
node_modules
dist
build
.next
.turbo
coverage
pnpm-lock.yaml
EOF
```

### 在包中使用配置

```json
// packages/utils/package.json 添加
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,md}\""
  },
  "devDependencies": {
    "@my-org/config-eslint": "workspace:*"
  }
}
```

```javascript
// packages/utils/.eslintrc.js
module.exports = {
  extends: ['@my-org/config-eslint'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  }
}
```

## 步骤 7：实现版本管理

### 安装 Changesets

```bash
pnpm add -D -w @changesets/cli
```

### 初始化 Changesets

```bash
pnpm changeset init
```

### 配置 Changesets

```json
// .changeset/config.json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@my-org/app-*"]
}
```

### 添加版本管理脚本

```json
// package.json
{
  "scripts": {
    "changeset": "changeset",
    "version": "changeset version && pnpm install --no-frozen-lockfile",
    "release": "pnpm build && changeset publish"
  }
}
```

## 步骤 8：配置 CI/CD

### GitHub Actions 配置

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    name: Build and Test
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Test
        run: pnpm test

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm typecheck
```

### 发布工作流

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 步骤 9：添加开发工具

### 配置 VS Code

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "eslint.workingDirectories": [
    { "mode": "auto" }
  ]
}
```

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma"
  ]
}
```

### 添加 Git Hooks

```bash
# 安装 husky
pnpm add -D -w husky

# 初始化 husky
pnpm exec husky install

# 添加 pre-commit hook
pnpm exec husky add .husky/pre-commit "pnpm lint-staged"

# 安装 lint-staged
pnpm add -D -w lint-staged
```

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

## 步骤 10：验证和测试

### 测试构建

```bash
# 构建所有包
pnpm build

# 运行测试
pnpm test

# 运行开发服务器
pnpm dev --filter @my-org/app-web
```

### 创建示例变更集

```bash
# 创建变更集
pnpm changeset

# 选择包、版本类型，输入描述
# 应用版本变更
pnpm version

# 查看变更
git status
```

## 完整项目结构

```
my-monorepo/
├── apps/
│   └── web/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   └── utils/
│       ├── src/
│       ├── package.json
│       ├── tsconfig.json
│       └── tsup.config.ts
├── configs/
│   └── eslint/
│       ├── index.js
│       └── package.json
├── tools/
├── .changeset/
│   └── config.json
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── .husky/
│   └── pre-commit
├── .vscode/
│   ├── settings.json
│   └── extensions.json
├── .eslintrc.js
├── .gitignore
├── .npmrc
├── .prettierrc
├── .prettierignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
└── turbo.json
```

## 下一步

### 扩展建议

1. **添加更多包**：
   - UI 组件库
   - API 服务
   - 共享配置

2. **集成更多工具**：
   - Storybook（组件文档）
   - Playwright（E2E 测试）
   - Docker（容器化）

3. **优化性能**：
   - 配置远程缓存
   - 优化构建流程
   - 添加性能监控

### 常见问题解决

| 问题 | 解决方案 |
|------|----------|
| 依赖安装失败 | 清理缓存：`pnpm store prune` |
| TypeScript 错误 | 重建引用：`pnpm typecheck` |
| 构建缓存问题 | 清理 Turbo：`rm -rf .turbo` |
| 版本冲突 | 统一版本：`pnpm dedupe` |

---

## 参考资源

- [pnpm Workspace](https://pnpm.io/workspaces) - Workspace 文档
- [Turborepo](https://turbo.build/repo/docs) - Turborepo 文档
- [Changesets](https://github.com/changesets/changesets) - 版本管理
- [Next.js](https://nextjs.org/docs) - Next.js 文档

---

*恭喜！你已经成功搭建了一个生产级的 Monorepo 项目。*