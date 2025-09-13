# 项目初始化

本章介绍如何从零开始创建一个 Monorepo 项目，包括环境准备、工具安装和基础结构搭建。

## 环境准备

### 1.1 系统要求

#### 1.1.1 必需环境
```bash
# 检查 Node.js 版本（需要 ≥18.19.0）
node --version

# 检查 npm 版本（需要 ≥9.0.0，用于安装 pnpm）
npm --version

# 检查 Git 版本
git --version
```

#### 1.1.2 推荐环境
- **操作系统**：macOS、Linux、Windows (WSL2)
- **IDE**：VSCode（推荐）或其他支持 TypeScript 的编辑器
- **终端**：支持 Unix 命令的终端

### 1.2 安装 pnpm

#### 1.2.1 安装方法
```bash
# 方法一：使用 npm 安装（推荐）
npm install -g pnpm@8

# 方法二：使用 Homebrew (macOS)
brew install pnpm

# 方法三：使用独立脚本
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### 1.2.2 验证安装
```bash
# 检查 pnpm 版本
pnpm --version
# 输出: 8.x.x

# 设置 pnpm 配置
pnpm config set store-dir ~/.pnpm-store
pnpm config set auto-install-peers true
```

## 创建项目结构

### 2.1 初始化项目

#### 2.1.1 创建项目目录
```bash
# 创建项目目录
mkdir my-monorepo
cd my-monorepo

# 初始化 Git 仓库
git init
```

#### 2.1.2 创建 package.json
```bash
# 初始化根 package.json
pnpm init
```

编辑 `package.json`：
```json
{
  "name": "my-monorepo",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@8.15.0",
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
    "fresh": "pnpm clean && pnpm install"
  }
}
```

### 2.2 配置工作区

#### 2.2.1 创建 pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
  - 'tools/*'
```

#### 2.2.2 创建目录结构
```bash
# 创建基础目录
mkdir -p apps packages services tools/scripts
mkdir -p configs/{eslint,prettier,tsconfig}
mkdir .vscode

# 创建占位文件防止空目录被忽略
touch apps/.gitkeep
touch packages/.gitkeep
touch services/.gitkeep
```

## 安装核心依赖

### 3.1 安装 Turborepo

#### 3.1.1 安装依赖
```bash
# 安装 Turborepo
pnpm add -D turbo

# 安装 TypeScript
pnpm add -D typescript @types/node
```

#### 3.1.2 创建 turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "cache": false
    },
    "lint": {},
    "type-check": {},
    "clean": {
      "cache": false
    }
  }
}
```

### 3.2 配置 Git Hooks

#### 3.2.1 安装 Lefthook
```bash
# 安装 Lefthook
pnpm add -D lefthook

# 添加 prepare 脚本
npm pkg set scripts.prepare="lefthook install"

# 执行安装
pnpm install
```

#### 3.2.2 配置 lefthook.yml
Lefthook 会自动创建配置文件，可以根据需要修改：
```yaml
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{js,ts,jsx,tsx}"
      run: pnpm lint
    type-check:
      glob: "*.{ts,tsx}"
      run: pnpm type-check

commit-msg:
  commands:
    validate:
      run: |
        # 简单的提交信息验证
        grep -qE "^(feat|fix|docs|style|refactor|test|chore):" {1} || {
          echo "提交信息必须以 feat|fix|docs|style|refactor|test|chore 开头"
          exit 1
        }
```

## 配置文件设置

### 4.1 环境配置

#### 4.1.1 Node 版本管理
```bash
# 创建 .nvmrc
echo "18.19.0" > .nvmrc

# 创建 .npmrc
cat > .npmrc << EOF
engine-strict=true
auto-install-peers=true
shamefully-hoist=true
EOF
```

#### 4.1.2 编辑器配置
```ini
# .editorconfig
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_size = 2

[Makefile]
indent_style = tab
```

### 4.2 Git 配置

#### 4.2.1 创建 .gitignore
```bash
# .gitignore 文件
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
.next/
out/
*.tsbuildinfo

# Testing
coverage/
.nyc_output/

# Turbo
.turbo/

# Environment
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
*~
.DS_Store

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Misc
.cache/
tmp/
temp/
```

#### 4.2.2 创建 .gitattributes
```bash
# .gitattributes 文件
# Auto detect text files
* text=auto

# Force LF for these files
*.js text eol=lf
*.jsx text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.json text eol=lf
*.md text eol=lf
*.yml text eol=lf
*.yaml text eol=lf

# Binary files
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.pdf binary
```

## 验证安装

### 5.1 创建测试包

#### 5.1.1 创建示例包
```bash
# 创建一个简单的工具包
mkdir -p packages/utils/src

# 创建 package.json
cat > packages/utils/package.json << EOF
{
  "name": "@myproject/utils",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "dev": "echo 'Development mode'",
    "build": "echo 'Building...'",
    "test": "echo 'Testing...'",
    "lint": "echo 'Linting...'",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  }
}
EOF

# 创建源文件
cat > packages/utils/src/index.ts << EOF
export function hello(name: string): string {
  return \`Hello, \${name}!\`
}

export function add(a: number, b: number): number {
  return a + b
}
EOF

# 创建 tsconfig.json
cat > packages/utils/tsconfig.json << EOF
{
  "extends": "../../configs/typescript/base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "composite": true,
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts", "**/*.spec.ts"]
}
EOF
```

### 5.2 验证运行

#### 5.2.1 安装依赖并测试
```bash
# 安装所有依赖
pnpm install

# 运行开发模式
pnpm dev
# 应该看到: Development mode

# 运行构建
pnpm build
# 应该看到: Building...

# 运行测试
pnpm test
# 应该看到: Testing...
```

#### 5.2.2 验证 Turborepo
```bash
# 查看任务图
pnpm turbo run build --graph

# 查看缓存状态
pnpm turbo run build --dry-run
```

## VSCode 配置（可选）

### 6.1 工作区设置

#### 6.1.1 创建 .vscode/settings.json
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "eslint.workingDirectories": [
    { "mode": "auto" }
  ],
  "files.exclude": {
    "**/node_modules": true,
    "**/.turbo": true,
    "**/dist": true
  }
}
```

#### 6.1.2 创建 .vscode/extensions.json
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "editorconfig.editorconfig"
  ]
}
```

### 6.2 调试配置

#### 6.2.1 创建 .vscode/launch.json
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Current Package",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/packages/${input:package}/src/index.ts",
      "preLaunchTask": "npm: build",
      "outFiles": ["${workspaceFolder}/packages/${input:package}/dist/**/*.js"],
      "console": "integratedTerminal"
    }
  ],
  "inputs": [
    {
      "id": "package",
      "type": "promptString",
      "description": "Package name to debug",
      "default": "utils"
    }
  ]
}
```

## 常见问题

### pnpm 安装失败？
```bash
# 清理 npm 缓存
npm cache clean --force

# 使用 npm 重新安装
npm install -g pnpm@8
```

### Turborepo 命令找不到？
```bash
# 确保在项目根目录
pwd

# 使用 npx 运行
npx turbo run build

# 或者全局安装
pnpm add -g turbo
```

### Git hooks 不工作？
```bash
# 重新安装 lefthook
pnpm run prepare

# 手动运行 hooks
lefthook run pre-commit
```

## 下一步

项目初始化完成后，你可以：

1. **[配置开发环境](./environment)** - TypeScript、构建工具、测试框架
2. **[配置工作区](./workspace)** - pnpm workspace 和包依赖管理
3. **[添加工程化规范](./engineering)** - Git Hooks、代码规范等

## 完整初始化脚本

将以上所有步骤整合为一个脚本：

```bash
#!/bin/bash
# init-monorepo.sh

set -e # 遇到错误立即退出

# 创建项目
mkdir my-monorepo && cd my-monorepo
git init

# 创建 package.json
cat > package.json << 'EOF'
{
  "name": "my-monorepo",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@8.15.0",
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
    "fresh": "pnpm clean && pnpm install"
  }
}
EOF

# 创建工作区配置
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
  - 'tools/*'
EOF

# 创建目录结构
mkdir -p apps packages services tools/scripts configs/{typescript,eslint,prettier} .vscode

# 创建 turbo.json (注意：新版本使用 tasks 而不是 pipeline)
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "cache": false
    },
    "lint": {},
    "type-check": {},
    "clean": {
      "cache": false
    }
  }
}
EOF

# 创建环境配置
echo "18.19.0" > .nvmrc

cat > .npmrc << 'EOF'
engine-strict=true
auto-install-peers=true
shamefully-hoist=true
EOF

# 创建 .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
build/
.turbo/
.env.local
*.log
.DS_Store
EOF

# 安装依赖（使用 -w 标志安装到根工作区）
pnpm add -w -D turbo typescript tsup @types/node

# 创建 TypeScript 基础配置
cat > configs/typescript/base.json << 'EOF'
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "moduleDetection": "force",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "allowJs": false,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noPropertyAccessFromIndexSignature": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "incremental": true
  },
  "exclude": ["node_modules", "dist", "build", "coverage", "*.config.ts", "*.config.js"]
}
EOF

# 创建根目录 tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "files": [],
  "references": []
}
EOF

# 安装 lefthook（单独安装避免 prepare 脚本问题）
pnpm add -w -D lefthook --ignore-scripts

# 手动初始化 lefthook
npx lefthook install

# 添加 prepare 脚本
npm pkg set scripts.prepare="lefthook install"

echo ""
echo "✅ Monorepo 初始化完成！"
echo "📁 项目结构已创建"
echo "📦 核心依赖已安装"
echo ""
echo "下一步："
echo "  cd my-monorepo"
echo "  pnpm dev"
```