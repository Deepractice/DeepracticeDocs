---
layer: Practice
type: Reference
title: 基础配置文件模板
category: node-development-environment/initialization
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude

purpose: 提供项目基础配置文件的标准模板
scope:
  includes:
    - .gitignore 模板
    - .editorconfig 模板
    - .nvmrc 配置
    - .npmrc 配置
    - .prettierrc 模板
    - .eslintignore 模板
  excludes:
    - 框架特定配置  # 属于框架规范
    - CI/CD 配置  # 属于 DevOps 规范
    - IDE 配置  # 属于开发环境规范
outcome:
  - 快速创建标准配置文件
  - 统一的项目配置
  - 避免配置遗漏
---

# 基础配置文件模板

## .gitignore

### 标准模板

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js
.yarn/install-state.gz

# Build outputs
dist/
build/
out/
*.tsbuildinfo
.next/
.nuxt/
.vuepress/dist/
.cache/
.parcel-cache/
.turbo/

# Logs
logs/
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Environment files
.env
.env.local
.env.*.local
.env.development
.env.production
.env.test

# IDE and Editor
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
!.vscode/launch.json
!.vscode/tasks.json
.idea/
*.swp
*.swo
*~
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/
*.lcov

# Package manager
.npm/
.yarn/
.pnpm-store/

# Temporary files
*.tmp
*.temp
.tmp/
.temp/

# Version management (DO NOT IGNORE)
# .changeset/  # Changesets 配置，用于版本管理，必须提交！

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
```

### Monorepo 额外配置

```gitignore
# Monorepo specific
.turbo/
apps/*/dist/
packages/*/dist/
services/*/dist/

# Changesets (不要忽略！用于版本管理)
# .changeset/  # 注意：保留 .changeset 用于版本发布
```

## .editorconfig

### 标准模板

```ini
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

# Universal settings
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

# Markdown files
[*.md]
trim_trailing_whitespace = false
max_line_length = 80

# TypeScript/JavaScript files
[*.{ts,tsx,js,jsx,mjs,cjs}]
indent_size = 2
max_line_length = 100

# JSON files
[*.json]
indent_size = 2

# YAML files
[*.{yml,yaml}]
indent_size = 2

# Package files
[package.json]
indent_size = 2

# Makefile
[Makefile]
indent_style = tab
indent_size = 4

# Shell scripts
[*.sh]
indent_size = 2

# Batch files
[*.{cmd,bat}]
end_of_line = crlf
```

## .nvmrc

### 标准配置

```bash
20.11.0
```

### 使用说明

```bash
# 自动使用项目 Node 版本
nvm use

# 安装并使用
nvm install
```

## .npmrc

### 开发环境配置

```ini
# pnpm 配置
shamefully-hoist=false
strict-peer-dependencies=true
auto-install-peers=false
prefer-frozen-lockfile=true

# 性能优化
resolution-mode=time-based
save-exact=false

# 安全设置
engine-strict=true
fund=false
audit-level=moderate

# 网络配置
fetch-retries=3
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
fetch-timeout=300000

# 缓存配置
store-dir=~/.pnpm-store
cache-dir=~/.pnpm-cache

# 镜像源（中国地区）
# registry=https://registry.npmmirror.com/
```

### Monorepo 配置

```ini
# Monorepo 额外配置
link-workspace-packages=deep
prefer-workspace-packages=true
shared-workspace-lockfile=true
recursive-install=true

# Hoisting 配置
public-hoist-pattern[]=*types*
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
```

## .prettierrc

### 标准模板

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "jsxSingleQuote": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "proseWrap": "preserve",
  "htmlWhitespaceSensitivity": "css",
  "endOfLine": "lf",
  "embeddedLanguageFormatting": "auto",
  "singleAttributePerLine": false
}
```

### 扩展配置（支持更多文件类型）

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "overrides": [
    {
      "files": "*.md",
      "options": {
        "printWidth": 80,
        "proseWrap": "always"
      }
    },
    {
      "files": ["*.json", "*.jsonc"],
      "options": {
        "printWidth": 80
      }
    },
    {
      "files": "*.yaml",
      "options": {
        "singleQuote": false
      }
    }
  ]
}
```

## .prettierignore

### 标准模板

```gitignore
# Build outputs
dist/
build/
out/
coverage/
.next/
.nuxt/

# Dependencies
node_modules/
.pnpm-store/

# Cache
.turbo/
.cache/
.parcel-cache/

# Generated files
*.min.js
*.min.css
*-lock.json
*.lock
pnpm-lock.yaml

# Large files
*.svg
*.ico
*.png
*.jpg
*.jpeg
*.gif
*.webp

# Specific files
CHANGELOG.md
LICENSE
```

## .eslintignore

### 标准模板

```gitignore
# Build outputs
dist/
build/
out/
coverage/
.next/
.nuxt/

# Dependencies
node_modules/

# Configuration
*.config.js
*.config.mjs
*.config.cjs
*.config.ts
vite.config.ts
vitest.config.ts
jest.config.js

# Generated
*.min.js
*.d.ts
generated/

# Cache
.turbo/
.cache/
```

## tsconfig.json（基础）

### Node.js 应用模板

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    // Language and Environment
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    
    // Emit
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    
    // Interop Constraints
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    
    // Type Checking
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    
    // Skip Lib Check
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

## 配置文件创建脚本

### init-configs.sh

```bash
#!/bin/bash
# 快速创建所有基础配置文件

echo "📝 Creating configuration files..."

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
out/
*.tsbuildinfo

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

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
.DS_Store

# Testing
coverage/
.nyc_output/

# Cache
.turbo/
.parcel-cache/
EOF

# Create .editorconfig
cat > .editorconfig << 'EOF'
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
EOF

# Create .nvmrc
echo "20.11.0" > .nvmrc

# Create .npmrc
cat > .npmrc << 'EOF'
shamefully-hoist=false
strict-peer-dependencies=true
auto-install-peers=false
engine-strict=true
EOF

# Create .prettierrc
cat > .prettierrc << 'EOF'
{
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
EOF

echo "✅ Configuration files created successfully!"
```

## 使用指南

### 快速开始

1. 复制需要的配置文件模板
2. 根据项目需求调整配置
3. 提交到版本控制

### 配置优先级

1. `.editorconfig` - 编辑器基础配置
2. `.gitignore` - 版本控制忽略
3. `.nvmrc` + `.npmrc` - Node.js 和包管理器
4. `.prettierrc` - 代码格式化
5. `.eslintignore` - 代码检查忽略

### 维护建议

- 定期更新 Node.js 版本（.nvmrc）
- 根据项目发展调整 .gitignore
- 团队统一使用相同的配置文件
- 配置文件纳入版本控制

---

*提示：可以将常用配置保存为模板，使用脚本快速初始化。*