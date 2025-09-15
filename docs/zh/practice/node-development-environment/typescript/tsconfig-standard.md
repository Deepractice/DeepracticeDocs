---
layer: Practice
type: Reference
title: TypeScript 编译配置标准
category: node-development-environment/typescript
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - TypeScript
  - tsconfig
  - 编译配置
  - 配置继承

purpose: 定义 tsconfig.json 的标准配置和最佳实践
scope:
  includes:
    - tsconfig 文件结构
    - 编译选项详解
    - 配置继承策略
    - 常用配置模板
  excludes:
    - 具体框架配置
    - 构建工具集成
    - IDE 特定设置
outcome:
  - 规范的 tsconfig 配置
  - 类型安全的编译设置
  - 优化的编译性能
---

# TypeScript 编译配置标准

## 配置文件结构

### tsconfig.json 层级

```
project/
├── tsconfig.json           # 根配置（IDE 使用）
├── tsconfig.base.json      # 基础配置（共享）
├── tsconfig.build.json     # 构建配置
├── tsconfig.test.json      # 测试配置
└── packages/
    └── app/
        └── tsconfig.json   # 继承根配置
```

### 基础结构

```json
{
  "extends": "./tsconfig.base.json",  // 继承配置
  "compilerOptions": {                // 编译选项
    // 配置项
  },
  "include": ["src/**/*"],            // 包含文件
  "exclude": ["node_modules"],        // 排除文件
  "references": []                     // 项目引用
}
```

## 核心编译选项

### 语言和环境

```json
{
  "compilerOptions": {
    // 目标版本
    "target": "ES2022",              // 编译目标：ES2022 支持顶层 await
    "lib": ["ES2022"],               // 可用库：与 target 匹配
    
    // 模块系统
    "module": "NodeNext",            // Node.js 原生 ESM 支持
    "moduleResolution": "NodeNext",  // Node.js 模块解析
    
    // JavaScript 支持
    "allowJs": true,                // 允许 JS 文件
    "checkJs": false,               // 不检查 JS（可选开启）
    
    // 实验性功能
    "experimentalDecorators": true,     // 装饰器支持
    "emitDecoratorMetadata": true      // 装饰器元数据
  }
}
```

### 严格模式配置

```json
{
  "compilerOptions": {
    // 🛡️ 一键开启所有严格检查
    "strict": true,
    
    // strict: true 包含的选项：
    // "noImplicitAny": true,           // 禁止隐式 any
    // "strictNullChecks": true,        // 严格空值检查
    // "strictFunctionTypes": true,     // 严格函数类型
    // "strictBindCallApply": true,     // 严格 bind/call/apply
    // "strictPropertyInitialization": true,  // 严格属性初始化
    // "noImplicitThis": true,          // 禁止隐式 this
    // "alwaysStrict": true,            // 始终严格模式
    
    // 额外的严格选项
    "noUnusedLocals": true,            // 未使用的局部变量
    "noUnusedParameters": true,        // 未使用的参数
    "noImplicitReturns": true,         // 隐式返回
    "noFallthroughCasesInSwitch": true, // switch 穿透
    "noUncheckedIndexedAccess": true,   // 索引访问检查
    "exactOptionalPropertyTypes": true, // 精确可选属性
    "noImplicitOverride": true         // 显式 override
  }
}
```

### 模块互操作

```json
{
  "compilerOptions": {
    // CommonJS 互操作
    "esModuleInterop": true,           // ES 模块互操作
    "allowSyntheticDefaultImports": true, // 合成默认导入
    
    // 模块解析
    "resolveJsonModule": true,         // 导入 JSON
    "forceConsistentCasingInFileNames": true, // 文件名大小写一致
    
    // 模块检测
    "moduleDetection": "force",        // 强制模块模式
    
    // 导入辅助
    "importHelpers": true,             // 使用 tslib
    "isolatedModules": true            // 独立模块（esbuild 兼容）
  }
}
```

### 输出配置

```json
{
  "compilerOptions": {
    // 输出目录
    "outDir": "./dist",                // 输出目录
    "rootDir": "./src",                // 源码根目录
    
    // 声明文件
    "declaration": true,               // 生成 .d.ts
    "declarationMap": true,            // 生成 .d.ts.map
    "declarationDir": "./types",       // 声明文件目录
    
    // Source Maps
    "sourceMap": true,                 // 生成 .js.map
    "inlineSources": true,             // 内联源码到 map
    "inlineSourceMap": false,          // 内联 map 到 JS
    
    // 输出选项
    "removeComments": false,           // 保留注释（文档需要）
    "preserveConstEnums": false,       // 不保留 const enum
    "newLine": "lf",                   // 换行符：LF
    
    // 不生成输出（仅类型检查）
    "noEmit": false,                   // 正常生成
    "noEmitOnError": true             // 错误时不生成
  }
}
```

## 配置模板

### 基础配置 (tsconfig.base.json)

```json
{
  "compilerOptions": {
    // 语言
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    
    // 严格
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    
    // 互操作
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    
    // 性能
    "skipLibCheck": true,
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```

### Node.js 应用配置

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    
    // Node.js 特定
    "types": ["node"],
    "lib": ["ES2022"],
    
    // 路径映射
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@lib/*": ["src/lib/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src/**/*.ts"],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.spec.ts",
    "**/*.test.ts"
  ]
}
```

### 库项目配置

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    
    // 声明文件
    "declaration": true,
    "declarationMap": true,
    "declarationDir": "./dist/types",
    
    // 兼容性
    "target": "ES2020",  // 更广的兼容性
    "lib": ["ES2020"],
    
    // 不包含 polyfills
    "importHelpers": false,
    
    // 严格导出
    "stripInternal": true  // 移除 @internal 标记
  },
  "include": ["src/**/*.ts"],
  "exclude": ["**/*.test.ts", "**/*.spec.ts"]
}
```

### Monorepo 配置

根目录 tsconfig.json:
```json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/cli" },
    { "path": "./packages/web" }
  ]
}
```

子包 tsconfig.json:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true,           // 启用项目引用
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  },
  "references": [
    { "path": "../core" }        // 依赖其他包
  ]
}
```

## 特殊配置

### 仅类型检查

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true,              // 不生成文件
    "skipLibCheck": false        // 检查所有声明文件
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

### 测试配置

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "types": ["node", "vitest/globals"],
    "noEmit": true,
    
    // 测试环境放宽限制
    "noUnusedLocals": false,
    "noUnusedParameters": false
  },
  "include": [
    "src/**/*.ts",
    "test/**/*.ts",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

### Watch 模式配置

```json
{
  "watchOptions": {
    "watchFile": "useFsEvents",           // 使用原生事件
    "watchDirectory": "useFsEvents",      // 使用原生事件
    "fallbackPolling": "dynamicPriority", // 降级轮询策略
    "synchronousWatchDirectory": true,    // 同步监听
    "excludeDirectories": [                // 排除目录
      "**/node_modules",
      "dist"
    ]
  }
}
```

## 性能优化

### 增量编译

```json
{
  "compilerOptions": {
    "incremental": true,                    // 启用增量编译
    "tsBuildInfoFile": "./.tsbuildinfo",   // 构建信息文件
    "assumeChangesOnlyAffectDirectDependencies": true
  }
}
```

### 项目引用

```bash
# 构建所有项目
tsc --build

# 清理构建
tsc --build --clean

# 强制重建
tsc --build --force

# 监听模式
tsc --build --watch
```

## 常见问题

### 路径映射不工作

```json
{
  "compilerOptions": {
    // 确保设置了 baseUrl
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

运行时需要配置路径解析：
```bash
# 使用 tsx
tsx --tsconfig ./tsconfig.json src/index.ts

# 或使用 tsconfig-paths
node -r tsconfig-paths/register dist/index.js
```

### 类型检查太慢

```json
{
  "compilerOptions": {
    "skipLibCheck": true,        // 跳过库类型检查
    "incremental": true,         // 增量编译
    "disableSourceOfProjectReferenceRedirect": true
  }
}
```

### ESM 配置

package.json:
```json
{
  "type": "module"
}
```

tsconfig.json:
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

## 最佳实践

### ✅ 推荐做法

1. **使用配置继承**减少重复
2. **始终开启 strict**
3. **配置路径映射**改善导入
4. **启用增量编译**提升性能
5. **生成声明文件**支持类型

### ❌ 避免做法

1. **关闭 strict 模式**
2. **使用过旧的 target**
3. **忽略类型错误**
4. **混用模块系统**
5. **过度使用 any**

---

*记住：好的 TypeScript 配置是类型安全的基础，宁可严格也不要宽松。*