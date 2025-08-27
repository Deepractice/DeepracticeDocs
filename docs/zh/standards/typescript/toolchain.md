# 开发工具配置

本章介绍 TypeScript 项目的本地开发工具配置，确保开发效率和代码质量。

## TypeScript 运行和编译

### 1.1 tsx - 零配置 TypeScript 运行器（推荐）

#### 1.1.1 为什么选择 tsx
- **零配置**：无需任何配置文件即可运行 TypeScript
- **极速启动**：基于 esbuild，比 ts-node 快 10-100x
- **完美兼容**：支持 ESM 和 CommonJS，自动处理路径别名
- **开发友好**：内置 watch 模式，支持环境变量加载

#### 1.1.2 安装和基础使用
```bash
# 安装（推荐作为开发依赖）
pnpm add -D tsx

# 直接运行 TypeScript 文件
tsx src/index.ts

# Watch 模式（文件变化自动重启）
tsx watch src/index.ts

# 运行测试文件
tsx test/example.test.ts

# REPL 模式
tsx
```

#### 1.1.3 package.json 脚本配置
```json
// package.json - 单包项目
{
  "scripts": {
    // 开发脚本（使用 tsx）
    "dev": "tsx watch src/index.ts",
    "start": "tsx src/index.ts",
    "test": "tsx --test src/**/*.test.ts",
    
    // 脚本运行
    "script": "tsx",
    "seed": "tsx scripts/seed.ts",
    "migrate": "tsx scripts/migrate.ts",
    
    // 类型检查（仍需要 tsc）
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    
    // 构建（用其他工具）
    "build": "tsup",
    "build:types": "tsc --emitDeclarationOnly --declaration"
  }
}

// 🔍 Monorepo 场景下的协调
// 在 Monorepo 中，包级别可以选择：
// 1. 库包：使用 tsup --watch（需要构建）
// 2. 应用包：使用 tsx watch（直接运行）
// 3. 脚本包：使用 tsx（无需构建）
// 详见 Monorepo 规范：/zh/standards/monorepo
```

#### 1.1.4 tsx 高级配置
```json
// package.json - Node.js 选项传递
{
  "scripts": {
    // 增加内存限制
    "dev": "NODE_OPTIONS='--max-old-space-size=4096' tsx watch src/index.ts",
    
    // 启用源码映射
    "dev:inspect": "tsx watch --inspect src/index.ts",
    
    // 加载环境变量
    "dev:env": "tsx watch --env-file=.env.local src/index.ts",
    
    // 忽略特定文件
    "dev:ignore": "tsx watch --ignore='**/*.test.ts' src/index.ts"
  }
}
```

### 1.2 tsc - 类型检查专用

#### 1.2.1 类型检查配置
```json
// tsconfig.json - 开发环境优化
{
  "compilerOptions": {
    // 增量编译
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo",
    
    // 跳过库文件检查
    "skipLibCheck": true,
    
    // 只编译修改的文件
    "assumeChangesOnlyAffectDirectDependencies": true
  },
  
  // 包含和排除优化
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "**/*.test.ts",
    "**/*.spec.ts",
    "dist",
    "coverage"
  ]
}
```

#### 1.2.2 Watch 模式配置
```json
// tsconfig.json
{
  "watchOptions": {
    "watchFile": "useFsEvents",  // 使用文件系统事件
    "watchDirectory": "useFsEvents",
    "fallbackPolling": "dynamicPriority",
    "synchronousWatchDirectory": false,
    
    // 排除监听
    "excludeDirectories": [
      "node_modules",
      "dist",
      ".git"
    ],
    "excludeFiles": [
      "**/*.test.ts",
      "**/*.spec.ts"
    ]
  }
}
```

### 1.3 类型检查集成

#### 1.3.1 Pre-commit 类型检查
```yaml
# .lefthook.yml 或 .huskyrc
pre-commit:
  commands:
    type-check:
      run: npx tsc --noEmit
      glob: "*.{ts,tsx}"
```

#### 1.3.2 VS Code 集成
```json
// .vscode/settings.json
{
  "typescript.tsdk": "./node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  
  // 实时类型检查
  "typescript.validate.enable": true,
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  
  // 代码提示增强
  "typescript.suggest.completeFunctionCalls": true,
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.preferences.importModuleSpecifier": "shortest",
  
  // 格式化选项
  "typescript.format.enable": true,
  "typescript.format.semicolons": "remove",
  "typescript.preferences.quoteStyle": "single"
}
```

### 1.4 增量编译优化

#### 1.4.1 项目引用配置
```json
// 根目录 tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" },
    { "path": "./apps/web" }
  ]
}

// packages/core/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "references": [
    { "path": "../utils" }
  ]
}
```

#### 1.4.2 缓存策略
```bash
# 利用 TypeScript 缓存
export TSC_COMPILE_ON_ERROR=true  # 即使有错误也继续编译
export TSC_NONPOLLING_WATCHER=true  # 使用非轮询监听器

# 构建脚本中的缓存处理
#!/bin/bash
# build.sh

# 检查缓存有效性
if [ -f ".tsbuildinfo" ]; then
  echo "Using incremental compilation"
else
  echo "First build, no cache available"
fi

# 构建
tsc --build

# 保存缓存信息
echo "Build completed at $(date)" > .build-timestamp
```

## 代码质量工具

### 2.1 ESLint 配置

#### 2.1.1 TypeScript ESLint 配置
```javascript
// .eslintrc.js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  
  plugins: [
    '@typescript-eslint',
    'import',
    'unicorn',
    'prettier'
  ],
  
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/typescript',
    'prettier'  // 必须放最后
  ],
  
  rules: {
    // TypeScript 规则
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/consistent-type-imports': ['error', {
      prefer: 'type-imports',
      fixStyle: 'inline-type-imports'
    }],
    '@typescript-eslint/no-non-null-assertion': 'warn',
    
    // Import 规则
    'import/order': ['error', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'type'
      ],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      }
    }],
    
    // 通用规则
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-param-reassign': 'error'
  },
  
  overrides: [
    // 测试文件规则
    {
      files: ['*.test.ts', '*.spec.ts'],
      env: {
        jest: true
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ],
  
  ignorePatterns: [
    'dist',
    'coverage',
    'node_modules',
    '*.js',
    '*.d.ts'
  ]
}
```

#### 2.1.2 自定义 ESLint 规则
```javascript
// .eslintrc-custom-rules.js
module.exports = {
  rules: {
    // 禁止使用特定的导入
    'no-restricted-imports': ['error', {
      paths: [
        {
          name: 'lodash',
          message: 'Use lodash-es instead'
        },
        {
          name: 'moment',
          message: 'Use date-fns instead'
        }
      ],
      patterns: [
        {
          group: ['../*'],
          message: 'Avoid relative imports from parent directories'
        }
      ]
    }],
    
    // 文件命名规范
    'unicorn/filename-case': ['error', {
      cases: {
        kebabCase: true,  // 文件名使用 kebab-case
        pascalCase: true  // React 组件可以用 PascalCase
      }
    }],
    
    // 强制使用 Node.js 前缀
    'unicorn/prefer-node-protocol': 'error'  // import fs from 'node:fs'
  }
}
```

### 2.2 Prettier 配置

#### 2.2.1 Prettier 配置文件
```javascript
// .prettierrc.js
module.exports = {
  // 基础格式
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  
  // 尾随逗号
  trailingComma: 'es5',
  
  // 括号
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  
  // 其他
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
  singleAttributePerLine: false,
  
  // 覆盖规则
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200
      }
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always'
      }
    }
  ]
}
```

```
# .prettierignore
dist/
coverage/
.next/
.turbo/
*.min.js
*.d.ts
pnpm-lock.yaml
CHANGELOG.md
```

#### 2.2.2 ESLint 与 Prettier 集成
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    // 其他配置...
    'prettier'  // 禁用与 Prettier 冲突的规则
  ],
  plugins: [
    'prettier'
  ],
  rules: {
    'prettier/prettier': ['error', {}, {
      usePrettierrc: true  // 使用 .prettierrc 的配置
    }]
  }
}
```

### 2.3 lint-staged 配置

#### 2.3.1 基础配置
```javascript
// .lintstagedrc.js
module.exports = {
  // TypeScript 文件
  '*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    () => 'tsc --noEmit'  // 类型检查
  ],
  
  // JavaScript 文件
  '*.{js,jsx}': [
    'eslint --fix',
    'prettier --write'
  ],
  
  // 样式文件
  '*.{css,scss,less}': [
    'stylelint --fix',
    'prettier --write'
  ],
  
  // JSON 文件
  '*.json': [
    'prettier --write'
  ],
  
  // Markdown 文件
  '*.md': [
    'prettier --write',
    'markdownlint --fix'
  ]
}
```

#### 2.3.2 高级配置
```javascript
// .lintstagedrc.advanced.js
const micromatch = require('micromatch')

module.exports = {
  // 动态命令生成
  '*.ts': async (files) => {
    // 过滤测试文件
    const testFiles = micromatch(files, ['**/*.test.ts', '**/*.spec.ts'])
    const sourceFiles = files.filter(f => !testFiles.includes(f))
    
    const commands = []
    
    if (sourceFiles.length > 0) {
      commands.push(`eslint --fix ${sourceFiles.join(' ')}`)
      commands.push(`prettier --write ${sourceFiles.join(' ')}`)
    }
    
    if (testFiles.length > 0) {
      commands.push(`jest --findRelatedTests ${testFiles.join(' ')}`)
    }
    
    // 类型检查（针对整个项目）
    commands.push('tsc --noEmit')
    
    return commands
  },
  
  // 包大小检查
  'package.json': () => [
    'size-limit'
  ]
}
```

## IDE 配置

### 3.1 VS Code 设置

#### 3.1.1 工作区设置
```json
// .vscode/settings.json
{
  // TypeScript
  "typescript.tsdk": "./node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.tsserver.maxTsServerMemory": 4096,
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.preferences.importModuleSpecifier": "shortest",
  "typescript.updateImportsOnFileMove.enabled": "always",
  
  // 编辑器
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"  // ESLint 处理 import 排序
  },
  
  // ESLint
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.workingDirectories": [
    { "mode": "auto" }
  ],
  
  // 文件排除
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/dist": true,
    "**/.turbo": true
  },
  
  // 搜索排除
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/*.tsbuildinfo": true,
    "**/coverage": true
  }
}
```

#### 3.1.2 推荐扩展
```json
// .vscode/extensions.json
{
  "recommendations": [
    // TypeScript 核心
    "ms-vscode.vscode-typescript-next",
    
    // 代码质量
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "stylelint.vscode-stylelint",
    
    // 开发体验
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "streetsidesoftware.code-spell-checker",
    
    // Git
    "eamodio.gitlens",
    "mhutchie.git-graph",
    
    // 调试
    "ms-vscode.js-debug-nightly",
    
    // 测试
    "orta.vscode-jest",
    "firsttris.vscode-jest-runner",
    
    // 其他
    "yoavbls.pretty-ts-errors",
    "usernamehw.errorlens",
    "aaron-bond.better-comments"
  ]
}
```

### 3.2 WebStorm 设置

#### 3.2.1 代码风格配置
```xml
<!-- .idea/codeStyles/Project.xml -->
<component name="ProjectCodeStyleConfiguration">
  <code_scheme name="Project" version="173">
    <TypeScriptCodeStyleSettings version="0">
      <option name="USE_SEMICOLON_AFTER_STATEMENT" value="false" />
      <option name="FORCE_SEMICOLON_STYLE" value="true" />
      <option name="FILE_NAME_STYLE" value="KEBAB_CASE" />
      <option name="USE_DOUBLE_QUOTES" value="false" />
      <option name="FORCE_QUOTE_STYLE" value="true" />
      <option name="SPACES_WITHIN_IMPORTS" value="true" />
    </TypeScriptCodeStyleSettings>
  </code_scheme>
</component>
```

#### 3.2.2 TypeScript 配置
```xml
<!-- .idea/typescript-compiler.xml -->
<project version="4">
  <component name="TypeScriptCompiler">
    <option name="typeScriptServiceDirectory" value="$PROJECT_DIR$/node_modules/typescript/lib" />
    <option name="versionType" value="SERVICE_DIRECTORY" />
    <option name="nodeInterpreterTextField" value="$PROJECT_DIR$/node_modules/.bin/node" />
  </component>
</project>
```

### 3.3 必备插件推荐

#### 3.3.1 VS Code 插件配置
```json
// 插件的用户设置示例
{
  // Error Lens
  "errorLens.enabledDiagnosticLevels": ["warning", "error"],
  "errorLens.excludeBySource": ["eslint(prettier/prettier)"],
  
  // Better Comments
  "better-comments.tags": [
    {
      "tag": "!",
      "color": "#FF2D00",
      "strikethrough": false,
      "backgroundColor": "transparent"
    },
    {
      "tag": "?",
      "color": "#3498DB",
      "strikethrough": false,
      "backgroundColor": "transparent"
    },
    {
      "tag": "//",
      "color": "#474747",
      "strikethrough": true,
      "backgroundColor": "transparent"
    },
    {
      "tag": "todo",
      "color": "#FF8C00",
      "strikethrough": false,
      "backgroundColor": "transparent"
    },
    {
      "tag": "*",
      "color": "#98C379",
      "strikethrough": false,
      "backgroundColor": "transparent"
    }
  ],
  
  // GitLens
  "gitlens.codeLens.enabled": false,  // 减少视觉干扰
  "gitlens.currentLine.enabled": false
}
```

## TypeScript 构建配置

### 4.1 构建工具选择（优先简单易用）

#### 4.1.1 推荐工具优先级
```typescript
// 🥇 开发首选：tsx（零配置，即用即走）
// 用途：开发环境运行、脚本执行、测试运行
// 优势：无需任何配置，启动速度极快
npm install -D tsx
tsx src/index.ts  // 直接运行

// 🥈 构建首选：tsup（一行配置搞定）
// 用途：打包库、CLI 工具、生产构建
// 优势：基于 esbuild，快速且能生成 .d.ts
npm install -D tsup
tsup src/index.ts  // 自动输出多种格式

// 🥉 前端应用：Vite（开发体验最佳）
// 用途：React/Vue/Svelte 应用
// 优势：HMR 极快，生态完善
npm create vite@latest

// ⚠️ 仅在必要时使用
// tsc - 仅用于类型检查和生成纯声明文件
// webpack - 仅在需要复杂配置时使用
// rollup - 仅在需要极致优化库体积时使用
```

### 4.2 简单配置示例

#### 4.2.1 tsup 零配置使用
```bash
# 最简单：零配置直接使用
tsup src/index.ts

# 指定输出格式
tsup src/index.ts --format cjs,esm

# 生成类型声明
tsup src/index.ts --dts

# Watch 模式
tsup src/index.ts --watch
```

```json
// package.json - 最简配置
{
  "scripts": {
    "build": "tsup",  // 默认会找 src/index.ts
    "build:watch": "tsup --watch"
  }
}
```

#### 4.2.2 tsup.config.ts（只在需要时创建）
```typescript
// tsup.config.ts - 只包含必要配置
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,  // 生成 .d.ts
  clean: true,  // 清理 dist 目录
  // 其他保持默认即可！
})
```

#### 4.2.3 最简单的构建流程
```json
// package.json - 最简单的完整流程
{
  "scripts": {
    // 🎯 核心三件套
    "dev": "tsx watch src/index.ts",     // 开发：tsx
    "build": "tsup",                      // 构建：tsup
    "type-check": "tsc --noEmit",        // 类型检查：tsc
    
    // 其他常用脚本
    "test": "tsx --test src/**/*.test.ts",
    "lint": "eslint . --fix",
    "format": "prettier --write ."
  },
  
  // tsup 默认会读取这些字段
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/index.js",
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  }
```

### 4.3 与 Monorepo 集成

#### 4.3.1 工具选择策略
```json
// Monorepo 中不同类型包的工具选择

// 🏗️ 库包（packages/utils, packages/ui）
{
  "scripts": {
    "dev": "tsup --watch",  // 需要构建产物供其他包使用
    "build": "tsup"
  }
}

// 🚀 应用包（apps/web, apps/admin）  
{
  "scripts": {
    "dev": "tsx watch src/index.ts",  // 直接运行，无需构建
    "build": "tsup"
  }
}

// 🛠️ 工具包（tools/scripts, tools/cli）
{
  "scripts": {
    "dev": "tsx src/index.ts",  // 脚本直接执行
    "start": "tsx src/index.ts"
    // 通常不需要 build
  }
}

// 📦 根目录统一调度
{
  "scripts": {
    "dev": "turbo run dev",  // Turbo 会并行运行所有包的 dev
    "build": "turbo run build"
  }
}
```

关于构建优化的详细配置，参考 [Monorepo 工程化规范](/zh/standards/monorepo/engineering#第三条-构建优化)。

#### 4.3.2 TypeScript 特定的缓存配置
```json
// turbo.json - TypeScript 特定任务
{
  "pipeline": {
    "type-check": {
      "inputs": [
        "**/*.ts",
        "**/*.tsx",
        "tsconfig.json",
        "tsconfig.*.json"
      ],
      "outputs": [
        ".tsbuildinfo"
      ],
      "cache": true
    },
    
    "build:types": {
      "dependsOn": ["^build:types"],
      "inputs": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "!src/**/*.test.ts",
        "!src/**/*.spec.ts",
        "tsconfig.build.json"
      ],
      "outputs": [
        "dist/**/*.d.ts",
        "dist/**/*.d.ts.map"
      ],
      "cache": true
    }
  }
}
```

## 常见问题

### tsx 运行报错？
```bash
# 常见问题：路径别名不识别
# 解决方案：tsx 会自动读取 tsconfig.json 的 paths
# 确保 tsconfig.json 中有正确的配置
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# 常见问题：环境变量不加载
# 解决方案：使用 --env-file 参数
tsx --env-file=.env src/index.ts

# 常见问题：内存不足
# 解决方案：增加 Node.js 内存
NODE_OPTIONS='--max-old-space-size=4096' tsx src/index.ts
```

### tsx vs ts-node？
```typescript
// tsx 优势：
// ✅ 速度快 10-100x（基于 esbuild）
// ✅ 零配置，开箱即用
// ✅ 原生支持 ESM 和 CommonJS
// ✅ 自动处理 .ts/.tsx/.mts/.cts

// ts-node 场景：
// - 需要类型检查时（tsx 不检查类型）
// - 需要特定的 TypeScript 转换器
// - 旧项目兼容性

// 迁移建议：
// package.json
{
  "scripts": {
    // 旧：ts-node
    "dev:old": "ts-node src/index.ts",
    // 新：tsx
    "dev": "tsx src/index.ts"
  }
}
```

### ESLint 性能慢？
```javascript
// .eslintrc.js - 性能优化
module.exports = {
  parserOptions: {
    project: './tsconfig.eslint.json',  // 使用精简的 tsconfig
    tsconfigRootDir: __dirname,
    ecmaVersion: 2022,
    sourceType: 'module',
    // 性能优化
    EXPERIMENTAL_useProjectService: true  // 实验性功能
  },
  
  // 避免昂贵的规则
  rules: {
    // 这些规则需要类型信息，比较慢
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-misused-promises': 'off'
  }
}
```

### Prettier 与 ESLint 冲突？
```bash
# 安装冲突解决包
npm install -D eslint-config-prettier

# 检查冲突
npx eslint-config-prettier .eslintrc.js
```

### TypeScript 内存溢出？
```json
// .vscode/settings.json
{
  "typescript.tsserver.maxTsServerMemory": 8192  // 增加内存限制
}

// package.json
{
  "scripts": {
    "type-check": "node --max-old-space-size=8192 ./node_modules/.bin/tsc"
  }
}
```

## 最佳实践

### DO ✅
- **优先使用 tsx** 进行开发，零配置最重要
- **使用 tsup** 进行构建，一行命令搞定
- **保持简单**：能用默认配置就不要自定义
- 配置 ESLint 和 Prettier 协同工作
- 使用 lint-staged 进行渐进式代码质量改进
- 类型检查与构建分离（tsc 只管类型，构建用其他工具）

### DON'T ❌
- 不要过度配置，大部分项目默认配置就够了
- 不要在开发环境用 tsc 编译（用 tsx 更快）
- 避免 ts-node，除非有特殊需求
- 不要禁用 skipLibCheck（影响性能）
- 避免过度的 ESLint 规则（影响开发体验）
- 不要忽略工具的默认配置（通常是最佳实践）

## 下一步

完成工具链配置后：
- 运行 `npm run type-check` 验证类型配置
- 运行 `npm run lint` 检查代码规范
- 在 IDE 中测试自动补全和类型提示
- 参考 [Monorepo 规范](/zh/standards/monorepo) 了解更大规模的项目组织