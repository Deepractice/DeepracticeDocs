---
layer: Practice
type: Index
title: 代码检查标准 ⭐
category: node-development-environment/linting
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - ESLint
  - Prettier
  - 代码质量
  - 代码规范
  - 自动化检查

# 目录级 PSO
purpose: 实现代码质量的自动化保证，作为父级 PSO 中"代码质量保证"的第一道防线
scope:
  includes:
    - ESLint 规则配置（错误预防、风格统一）
    - Prettier 格式化配置（代码美化）
    - TypeScript ESLint 规则（类型相关检查）
    - 编辑器集成配置（保存时自动修复）
    - Git hooks 集成（提交前检查）
    - 自定义规则开发（团队特定规范）
  excludes:
    - 具体业务逻辑检查
    - 性能分析工具
    - 安全扫描工具
    - 测试覆盖率检查
outcome:
  - 零配置的代码质量保证
  - 统一的代码风格
  - 编码时即时反馈
  - 减少 90% 的代码审查时间
---

# 代码检查标准 ⭐

## 为什么最重要

代码检查是保证代码质量的**第一道防线**，比其他任何工具都重要：

- 🛡️ **预防胜于治疗** - 在问题产生时就发现，而不是在生产环境
- ⏱️ **即时反馈** - 写代码时就知道问题，不用等到 PR
- 🤝 **团队一致性** - 自动统一代码风格，避免风格争论
- 📈 **复利效应** - 每天节省 10 分钟，一年节省 40 小时

## 核心理念

### 🎯 自动化优先
能自动的绝不手动，能预防的绝不修复。

### 🔧 渐进式严格
开始可以宽松，但要逐步严格，不能反向。

### 💡 开发者体验
规则应该帮助开发者，而不是阻碍开发者。

## ESLint 配置

### 基础配置（eslint.config.js）

使用 ESLint 9.x Flat Config：

```javascript
// eslint.config.js
import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'

export default [
  // 基础 JavaScript 规则
  js.configs.recommended,
  
  // TypeScript 配置
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      // TypeScript 严格规则
      ...typescript.configs['recommended-type-checked'].rules,
      ...typescript.configs['stylistic-type-checked'].rules,
      
      // 自定义 TypeScript 规则
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': ['error', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true
      }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error'
    }
  },
  
  // 通用规则
  {
    files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    rules: {
      // 错误预防
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'no-param-reassign': 'error',
      
      // 代码质量
      'complexity': ['error', 10],
      'max-depth': ['error', 4],
      'max-nested-callbacks': ['error', 3],
      'max-lines-per-function': ['error', 50],
      
      // ES6+ 最佳实践
      'arrow-body-style': ['error', 'as-needed'],
      'object-shorthand': 'error',
      'prefer-destructuring': ['error', {
        array: true,
        object: true
      }],
      
      // 导入规则
      'no-duplicate-imports': 'error',
      'sort-imports': ['error', {
        ignoreCase: true,
        ignoreDeclarationSort: true
      }]
    }
  },
  
  // 忽略文件
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/node_modules/**',
      '**/*.config.js',
      '**/*.config.ts'
    ]
  },
  
  // Prettier 兼容（必须放最后）
  prettier
]
```

### 规则分级

| 级别 | 使用场景 | 示例规则 |
|------|---------|----------|
| **error** | 必须修复的问题 | no-unused-vars、no-undef |
| **warn** | 应该注意的问题 | no-console、complexity |
| **off** | 不适用的规则 | no-mixed-spaces-and-tabs（Prettier 处理） |

## Prettier 配置

### 基础配置（.prettierrc）

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "useTabs": false,
  "quoteProps": "as-needed",
  "jsxSingleQuote": false,
  "bracketSameLine": false,
  "proseWrap": "preserve",
  "htmlWhitespaceSensitivity": "css",
  "vueIndentScriptAndStyle": false,
  "embeddedLanguageFormatting": "auto",
  "singleAttributePerLine": false
}
```

### 忽略文件（.prettierignore）

```
# 依赖
node_modules
pnpm-lock.yaml
package-lock.json
yarn.lock

# 构建产物
dist
build
coverage
.turbo

# 其他
*.md
*.mdx
.gitignore
.prettierignore
.eslintignore
```

## 编辑器集成

### VSCode 配置

```json
// .vscode/settings.json
{
  // ESLint
  "eslint.enable": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  
  // Prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": false,
  "editor.formatOnType": false,
  
  // 编辑器
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.organizeImports": "explicit"
  },
  
  // 文件
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true
}
```

### 必装扩展

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "streetsidesoftware.code-spell-checker",
    "usernamehw.errorlens"
  ]
}
```

## Git Hooks 集成

### Lefthook 配置

```yaml
# .lefthook.yml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{js,ts,jsx,tsx}"
      run: npx eslint {staged_files} --fix
    format:
      glob: "*.{js,ts,jsx,tsx,json,css,md}"
      run: npx prettier --write {staged_files}
    typecheck:
      glob: "*.{ts,tsx}"
      run: npx tsc --noEmit

commit-msg:
  commands:
    commitlint:
      run: npx commitlint --edit {1}
```

### lint-staged 配置（备选）

```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

## 自定义规则

### 团队特定规则示例

```javascript
// eslint-rules/no-hardcoded-env.js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: '禁止硬编码环境变量'
    },
    fixable: null,
    schema: []
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          if (node.value.includes('localhost:') || 
              node.value.includes('127.0.0.1:')) {
            context.report({
              node,
              message: '不要硬编码环境相关的值，使用环境变量'
            })
          }
        }
      }
    }
  }
}
```

## 性能优化

### ESLint 缓存

```json
// package.json
{
  "scripts": {
    "lint": "eslint . --cache --cache-location .eslintcache",
    "lint:fix": "eslint . --fix --cache"
  }
}
```

### 增量检查

```bash
# 只检查变更的文件
git diff --name-only --diff-filter=ACM | grep -E '\\.(js|ts|jsx|tsx)$' | xargs eslint

# 只检查暂存的文件
git diff --cached --name-only --diff-filter=ACM | grep -E '\\.(js|ts|jsx|tsx)$' | xargs eslint
```

## 规则选择指南

### 必须启用的规则

```javascript
{
  // 错误预防
  'no-unused-vars': 'error',
  'no-undef': 'error',
  'no-unreachable': 'error',
  
  // TypeScript
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/strict-boolean-expressions': 'error',
  
  // 异步错误
  'no-async-promise-executor': 'error',
  'require-await': 'error',
  
  // 安全性
  'no-eval': 'error',
  'no-implied-eval': 'error'
}
```

### 推荐启用的规则

```javascript
{
  // 代码质量
  'complexity': ['warn', 10],
  'max-depth': ['warn', 4],
  
  // 最佳实践
  'prefer-const': 'warn',
  'prefer-template': 'warn',
  
  // 可读性
  'max-lines-per-function': ['warn', 100],
  'max-nested-callbacks': ['warn', 3]
}
```

### 可选规则

```javascript
{
  // 风格偏好
  'arrow-body-style': 'off',
  'object-shorthand': 'off',
  
  // 团队决定
  'no-console': 'off',
  'no-debugger': 'off'
}
```

## 迁移策略

### 1. 基础配置
```bash
# 安装依赖
pnpm add -D eslint @eslint/js prettier eslint-config-prettier

# 生成配置
npx eslint --init
```

### 2. 逐步严格
```javascript
// 第一阶段：仅错误
extends: ['eslint:recommended']

// 第二阶段：加入 TypeScript
extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended']

// 第三阶段：严格模式
extends: ['eslint:recommended', 'plugin:@typescript-eslint/strict']
```

### 3. 自动修复
```bash
# 修复所有可自动修复的问题
npx eslint . --fix

# 格式化所有文件
npx prettier --write .
```

## 故障排查

### 常见问题

**Q: ESLint 和 Prettier 冲突**
```javascript
// 确保 prettier 配置在最后
export default [
  // ... 其他配置
  prettier // 必须最后
]
```

**Q: 解析错误**
```javascript
// 检查 parser 配置
{
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      project: './tsconfig.json' // 确保路径正确
    }
  }
}
```

**Q: 性能太慢**
```bash
# 使用缓存
eslint . --cache

# 减少检查范围
eslint src --ext .ts,.tsx
```

## 最佳实践

### ✅ 应该做的

1. **尽早配置** - 项目开始就配置，不要等到后期
2. **团队共识** - 规则要团队讨论决定
3. **自动修复** - 能自动修复的都配置上
4. **持续改进** - 定期评估和调整规则

### ❌ 不应该做的

1. **过度配置** - 不要配置几百条规则
2. **忽略警告** - 警告要么修复，要么关闭规则
3. **禁用检查** - 不要大量使用 eslint-disable
4. **风格战争** - 风格问题交给 Prettier

## 相关资源

### 内部文档
- [Node.js 开发环境规范](../index.md) - 父级规范
- [TypeScript 配置](../typescript/index.md) - 类型检查配置
- [Git Hooks 配置](../toolchain/index.md) - 提交前检查

### 外部资源
- [ESLint 官方文档](https://eslint.org) - 最新文档
- [Prettier 官方文档](https://prettier.io) - 格式化配置
- [TypeScript ESLint](https://typescript-eslint.io) - TypeScript 规则

---

*记住：代码检查是投资回报率最高的工具。今天配置一次，明天节省无数时间。*