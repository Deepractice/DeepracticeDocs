# 快速开始

本章提供 Monorepo 项目的快速启动指南，让你在 5 分钟内创建一个可工作的项目。

## 使用模板项目

### 方式一：克隆模板仓库

```bash
# 克隆模板项目
git clone https://github.com/Deepractice/MonorepoTemplate.git my-project
cd my-project

# 安装依赖
pnpm install

# 启动开发模式
pnpm dev
```

### 方式二：使用本地模板

本文档仓库包含了一个完整的模板项目：

```bash
# 复制模板到你的项目
cp -r docs/templates/monorepo my-project
cd my-project

# 移除 Git 历史
rm -rf .git

# 初始化新仓库
git init

# 安装依赖
pnpm install
```

## 从零创建项目

如果你想了解每一步的细节，可以按照以下步骤从零创建：

### 1. 初始化项目

```bash
# 创建项目目录
mkdir my-monorepo && cd my-monorepo

# 初始化 pnpm
pnpm init

# 创建标准目录结构
mkdir -p apps packages services tools/scripts configs/{typescript,eslint,prettier}
```

### 2. 安装核心依赖

```bash
# 安装基础工具（使用 -w 安装到工作区根目录）
pnpm add -D -w turbo typescript tsup @types/node

# 安装 Git Hooks 管理工具
pnpm add -D -w lefthook
```

### 3. 创建基础配置

创建 `pnpm-workspace.yaml`：
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
  - 'configs/*'
  - 'tools/*'
```

创建 `turbo.json`：
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"],
      "cache": true
    },
    "dev": {
      "dependsOn": ["^build"],
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "cache": false
    }
  }
}
```

### 4. 配置 TypeScript

创建 `configs/typescript/base.json`：
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "incremental": true
  }
}
```

根目录 `tsconfig.json`：
```json
{
  "files": [],
  "references": []
}
```

## 创建第一个包

### 使用脚本创建

```bash
# 运行创建脚本
node tools/scripts/create-package.js my-utils

# 安装依赖
pnpm install

# 构建包
pnpm build --filter @myproject/my-utils
```

### 手动创建

```bash
# 创建包目录
mkdir -p packages/my-utils/src

# 创建 package.json
cat > packages/my-utils/package.json << EOF
{
  "name": "@myproject/my-utils",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup",
    "test": "vitest",
    "type-check": "tsc --noEmit"
  }
}
EOF

# 创建 tsconfig.json
cat > packages/my-utils/tsconfig.json << EOF
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

# 创建源文件
cat > packages/my-utils/src/index.ts << EOF
export const hello = (name: string) => \`Hello, \${name}!\`
EOF
```

## 验证安装

### 检查项目结构

```bash
# 查看项目结构
tree -L 2 -I node_modules

# 输出应该类似：
# .
# ├── apps/
# ├── configs/
# │   ├── typescript/
# │   ├── eslint/
# │   └── prettier/
# ├── packages/
# ├── services/
# ├── tools/
# │   └── scripts/
# ├── package.json
# ├── pnpm-workspace.yaml
# ├── tsconfig.json
# └── turbo.json
```

### 运行基本命令

```bash
# 开发模式（监听文件变化）
pnpm dev

# 构建所有包
pnpm build

# 运行测试
pnpm test

# 类型检查
pnpm type-check

# 清理构建产物
pnpm clean
```

### 查看 Turbo 任务图

```bash
# 查看构建任务的依赖关系
pnpm build --graph

# 查看哪些包会被构建
pnpm build --dry-run
```

## 常见问题

### pnpm 版本不兼容？

```bash
# 安装指定版本的 pnpm
corepack prepare pnpm@8.15.0 --activate

# 或使用 npm
npm install -g pnpm@8.15.0
```

### TypeScript 编译错误？

确保 `tsconfig.json` 中包含 `tsBuildInfoFile`：
```json
{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  }
}
```

### Turbo 缓存问题？

```bash
# 清理 Turbo 缓存
turbo daemon clean
rm -rf .turbo

# 禁用缓存运行
pnpm build --force
```

## 下一步

- 阅读[项目初始化](/zh/standards/monorepo/initialization)了解详细配置
- 学习[工作区配置](/zh/standards/monorepo/workspace)管理包依赖
- 配置[工程化规范](/zh/standards/monorepo/engineering)提升代码质量