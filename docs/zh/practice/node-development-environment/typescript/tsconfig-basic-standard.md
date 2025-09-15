---
layer: Practice
type: Reference
title: TypeScript 基础配置标准
category: node-development-environment/typescript
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - TypeScript
  - tsconfig
  - 配置

purpose: 定义 TypeScript 基础配置的标准模板
scope:
  includes:
    - 编译器选项
    - 目标环境配置
    - 模块系统设置
    - 文件包含规则
  excludes:
    - 框架特定配置
    - 构建工具集成
outcome:
  - 标准的 tsconfig 配置
  - 可运行的最小配置
  - 清晰的配置结构
---

# TypeScript 基础配置标准

## 最小可运行配置

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 配置选项详解

### 语言和环境

| 选项 | 推荐值 | 说明 |
|------|--------|------|
| `target` | ES2022 | ECMAScript 目标版本 |
| `lib` | ["ES2022"] | 可用的标准库 |
| `module` | NodeNext | 模块系统（Node.js 16+） |
| `moduleResolution` | NodeNext | 模块解析策略 |

### 输出控制

| 选项 | 推荐值 | 说明 |
|------|--------|------|
| `outDir` | ./dist | 编译输出目录 |
| `rootDir` | ./src | 源码根目录 |
| `sourceMap` | true | 生成 source map |
| `declaration` | true | 生成类型声明 |
| `declarationMap` | true | 生成声明 map |
| `removeComments` | false | 保留注释（文档需要） |

### 模块互操作

| 选项 | 推荐值 | 说明 |
|------|--------|------|
| `esModuleInterop` | true | ES 模块互操作 |
| `allowSyntheticDefaultImports` | true | 合成默认导入 |
| `resolveJsonModule` | true | 导入 JSON 文件 |
| `isolatedModules` | true | 单文件转译兼容 |

## 标准配置模板

### 开发环境（tsconfig.json）

```json
{
  "compilerOptions": {
    /* 语言和环境 */
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    
    /* 输出 */
    "outDir": "./dist",
    "rootDir": "./src",
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "removeComments": false,
    
    /* 互操作 */
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    
    /* 类型检查 */
    "strict": false,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    
    /* 完整性 */
    "noEmitOnError": true,
    "preserveConstEnums": true,
    "preserveWatchOutput": true,
    
    /* 高级 */
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.json"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

### 生产构建（tsconfig.build.json）

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": false,
    "declaration": true,
    "removeComments": true,
    "noEmitOnError": true
  },
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/__tests__/**",
    "**/__mocks__/**"
  ]
}
```

## Node.js 版本对应

| Node.js | Target | Lib | 说明 |
|---------|--------|-----|------|
| 18.x | ES2022 | ES2022 | LTS，推荐 |
| 20.x | ES2022 | ES2023 | Current LTS |
| 22.x | ES2023 | ES2023 | Latest |

## 项目类型配置

### 库项目

```json
{
  "compilerOptions": {
    "target": "ES2020",  // 更广泛的兼容性
    "module": "ESNext",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": true
  }
}
```

### 应用项目

```json
{
  "compilerOptions": {
    "target": "ES2022",  // 使用最新特性
    "module": "NodeNext",
    "declaration": false,  // 应用不需要声明
    "sourceMap": true
  }
}
```

### Monorepo 项目

```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "incremental": true
  },
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" }
  ]
}
```

## 文件组织最佳实践

```
project/
├── tsconfig.json           # 基础配置
├── tsconfig.build.json     # 构建配置
├── tsconfig.test.json      # 测试配置
├── src/
│   ├── index.ts
│   └── types/
│       └── global.d.ts
├── dist/                   # 编译输出
└── types/                  # 类型声明输出
```

## 配置继承策略

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true
  }
}

// tsconfig.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

## 性能优化配置

```json
{
  "compilerOptions": {
    "incremental": true,              // 增量编译
    "tsBuildInfoFile": ".tsbuildinfo", // 构建信息缓存
    "assumeChangesOnlyAffectDirectDependencies": true,
    "skipLibCheck": true,             // 跳过 .d.ts 检查
    "skipDefaultLibCheck": true       // 跳过默认库检查
  }
}
```

## 常见问题配置

### 解决路径问题

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 解决 Node.js 类型

```json
{
  "compilerOptions": {
    "types": ["node"],
    "typeRoots": ["./node_modules/@types"]
  }
}
```

---

*记住：从最小配置开始，根据需要逐步添加选项。*