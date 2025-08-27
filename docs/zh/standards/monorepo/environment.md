# 开发环境配置

本章介绍 Monorepo 项目的开发环境配置，包括模块系统、构建工具、代码规范和测试框架的设置。

## 模块系统

### 1.1 统一使用 ESModule

#### 1.1.1 配置要求
本规范中的所有包都采用 **ESModule (ESM)** 作为模块系统：

```json
// 所有 package.json 都必须包含
{
  "type": "module"
}
```

#### 1.1.2 选择理由
- **标准化**：ESM 是 ECMAScript 官方模块系统
- **性能优化**：支持 Tree Shaking 和静态分析
- **工具支持**：现代工具链（Vite、tsup、esbuild）原生支持
- **未来兼容**：避免未来迁移成本

### 1.2 ESM 实践指南

#### 1.2.1 导入导出语法
```javascript
// ✅ 正确：ESM 语法
import { utils } from './utils.js'  // 需要文件扩展名
export { myFunction }
export default MyClass

// ❌ 错误：CommonJS 语法
const utils = require('./utils')
module.exports = MyClass
```

#### 1.2.2 Node.js 内置模块
```javascript
// 处理 __dirname 和 __filename
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 读取 JSON 文件
import { readFile } from 'node:fs/promises'
const pkg = JSON.parse(
  await readFile(new URL('./package.json', import.meta.url), 'utf-8')
)
```

#### 1.2.3 兼容性处理
```javascript
// tsup.config.ts - 同时输出 CJS 和 ESM
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],  // 同时输出两种格式
  dts: true,
  shims: true,  // 自动注入 __dirname 等 shims
})
```

## TypeScript 配置

### 2.1 分层配置策略

#### 2.1.1 配置继承结构
```
configs/typescript/
├── base.json          # 基础配置（所有项目继承）
├── node.json          # Node.js 服务配置
├── react.json         # React 应用配置
└── library.json       # 库包配置
```

#### 2.1.2 基础配置
`configs/typescript/base.json`：
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    // 目标和模块
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "moduleDetection": "force",
    
    // 严格模式
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    // 互操作性
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    
    // 输出配置
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "incremental": true
  }
}
```

### 2.2 项目引用配置

#### 2.2.1 根目录 tsconfig.json
```json
{
  "files": [],
  "references": [
    { "path": "./packages/utils" },
    { "path": "./packages/ui" },
    { "path": "./apps/web" }
  ]
}
```

#### 2.2.2 包级别 tsconfig.json
```json
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
```

## 构建工具

### 3.1 tsup 配置

#### 3.1.1 为什么选择 tsup
- **零配置**：开箱即用，基于 esbuild
- **速度快**：比 webpack/rollup 快 10-100 倍
- **功能完整**：支持 TypeScript、代码分割、Tree Shaking
- **格式灵活**：同时输出 CJS、ESM、IIFE

#### 3.1.2 标准配置
```typescript
// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    // 外部化 peerDependencies
    'react',
    'react-dom'
  ]
})
```

#### 3.1.3 package.json 配置
```json
{
  "main": "./dist/index.js",      // CJS 入口
  "module": "./dist/index.mjs",    // ESM 入口
  "types": "./dist/index.d.ts",    // 类型定义
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup",
    "build:min": "tsup --minify"
  }
}
```

### 3.2 Turborepo 配置

#### 3.2.1 任务编排
```json
// turbo.json
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
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "cache": false
    },
    "lint": {
      "outputs": [],
      "cache": true
    },
    "type-check": {
      "outputs": [],
      "cache": true
    }
  }
}
```

## 代码质量工具

### 4.1 ESLint 配置

#### 4.1.1 共享配置
`configs/eslint/base.js`：
```javascript
export default {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'  // 必须放最后，关闭与 Prettier 冲突的规则
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    // TypeScript
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    
    // Import
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc' }
    }],
    
    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }]
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true
      }
    }
  },
  ignorePatterns: ['dist', 'build', 'coverage', '*.config.js']
}
```

#### 4.1.2 包级别配置
```javascript
// packages/utils/.eslintrc.cjs
module.exports = {
  extends: ['../../configs/eslint/base.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  }
}
```

### 4.2 Prettier 配置

#### 4.2.1 全局配置
`.prettierrc.json`：
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

#### 4.2.2 忽略文件
`.prettierignore`：
```
node_modules
pnpm-lock.yaml
dist
build
.next
.turbo
coverage
```

### 4.3 Git Hooks 配置

#### 4.3.1 Lefthook 配置
`lefthook.yml`：
```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{js,ts,jsx,tsx}"
      run: pnpm lint --fix {staged_files}
    format:
      glob: "*.{js,ts,jsx,tsx,json,md}"
      run: pnpm prettier --write {staged_files}
    type-check:
      run: pnpm type-check

commit-msg:
  commands:
    validate:
      run: |
        # 提交信息格式验证
        if ! grep -qE "^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}" "$1"; then
          echo "提交信息必须符合约定式提交规范"
          echo "格式: <type>(<scope>): <subject>"
          echo "示例: feat(auth): add login functionality"
          exit 1
        fi
```

## 测试环境

### 5.1 Vitest 配置

#### 5.1.1 为什么选择 Vitest
- **速度快**：基于 Vite，使用 esbuild
- **兼容 Jest**：API 几乎一致，迁移成本低
- **原生 ESM**：无需额外配置
- **功能完整**：内置覆盖率、快照测试、模拟

#### 5.1.2 基础配置
`vitest.config.ts`：
```typescript
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',  // 或 'happy-dom' / 'jsdom'
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.ts',
        '**/*.d.ts'
      ]
    },
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', 'build']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
```

#### 5.1.3 测试脚本
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:watch": "vitest watch"
  }
}
```

## 编辑器配置

### 6.1 VSCode 配置

#### 6.1.1 工作区设置
`.vscode/settings.json`：
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "eslint.workingDirectories": [{ "mode": "auto" }],
  "files.exclude": {
    "**/node_modules": true,
    "**/.turbo": true
  }
}
```

#### 6.1.2 推荐扩展
`.vscode/extensions.json`：
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "editorconfig.editorconfig"
  ]
}
```

### 6.2 EditorConfig

`.editorconfig`：
```ini
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

[Makefile]
indent_style = tab
```

## 环境变量

### 7.1 环境配置

#### 7.1.1 Node.js 版本
`.nvmrc`：
```
18.19.0
```

#### 7.1.2 包管理器配置
`.npmrc`：
```ini
# 严格模式
engine-strict=true
auto-install-peers=true
strict-peer-dependencies=false

# 性能优化
shamefully-hoist=true
prefer-workspace-packages=true

# pnpm 特定
use-node-version=18.19.0
```

### 7.2 环境变量管理

#### 7.2.1 文件组织
```
.env                # 默认环境变量
.env.local          # 本地覆盖（不提交）
.env.development    # 开发环境
.env.production     # 生产环境
.env.test          # 测试环境
```

#### 7.2.2 TypeScript 类型支持
`env.d.ts`：
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## 常见问题

### ESM 导入路径问题？
```javascript
// tsconfig.json 中设置
{
  "compilerOptions": {
    "moduleResolution": "bundler",  // 支持无扩展名导入
    "allowImportingTsExtensions": false  // 构建时不允许 .ts 扩展名
  }
}
```

### TypeScript 编译太慢？
```bash
# 使用项目引用增量构建
tsc --build --incremental

# 清理缓存
rm -rf **/*.tsbuildinfo
```

### ESLint 性能问题？
```javascript
// 限制类型检查范围
parserOptions: {
  project: ['./tsconfig.json'],
  tsconfigRootDir: __dirname,
  ecmaVersion: 2022,
  sourceType: 'module',
  // 禁用类型感知的规则以提升性能
  programs: null
}
```

## 下一步

完成开发环境配置后，你可以：

1. **[配置工作区](/zh/standards/monorepo/workspace)** - 设置包之间的依赖关系
2. **[添加工程化规范](/zh/standards/monorepo/engineering)** - 自动化质量保障
3. **开始构建应用** - 在配置好的环境中开发