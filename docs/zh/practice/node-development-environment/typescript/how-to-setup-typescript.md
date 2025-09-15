---
layer: Practice
type: How-to
title: 如何配置 TypeScript
category: node-development-environment/typescript
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - TypeScript
  - 配置
  - 快速上手

purpose: 快速配置 TypeScript 开发环境
scope:
  progression:
    1. 安装 TypeScript
    2. 创建基础 tsconfig
    3. 启用严格模式
    4. 配置模块系统
    5. 设置路径映射
    6. 验证配置
outcome:
  - 完成 TypeScript 环境配置
  - 类型检查就绪
  - 编译配置完成
---

# 如何配置 TypeScript

## 前置要求

确保已完成 [Node.js 环境配置](../nodejs/how-to-setup-nodejs.md)。

## 步骤 1：安装 TypeScript

```bash
# 安装 TypeScript 和相关工具
pnpm add -D typescript @types/node tsx

# 验证安装
pnpm tsc --version  # Version 5.3.x
```

### 安装的包说明

- `typescript` - TypeScript 编译器
- `@types/node` - Node.js 类型定义
- `tsx` - TypeScript 执行器（替代 ts-node）

## 步骤 2：初始化 tsconfig.json

```bash
# 创建基础配置
pnpm tsc --init
```

### 替换为优化配置

创建 `tsconfig.json`：

```json
{
  "compilerOptions": {
    /* 语言和环境 */
    "target": "ES2022",                      // 编译目标
    "lib": ["ES2022"],                       // 可用的库
    "module": "NodeNext",                     // 模块系统
    "moduleResolution": "NodeNext",          // 模块解析策略
    
    /* 输出配置 */
    "outDir": "./dist",                      // 输出目录
    "rootDir": "./src",                      // 源码目录
    "declarationDir": "./dist/types",        // 声明文件目录
    
    /* 类型检查（基础） */
    "strict": false,                         // 先关闭，逐步开启
    "esModuleInterop": true,                 // ES 模块互操作
    "skipLibCheck": true,                    // 跳过库检查
    "forceConsistentCasingInFileNames": true // 文件名大小写一致
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

## 步骤 3：逐步启用严格模式

### 第一阶段：基础检查

```json
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": true,                   // 禁止隐式 any
    "strictNullChecks": true,                // 严格空值检查
    "strictFunctionTypes": true              // 严格函数类型
  }
}
```

### 第二阶段：完全严格

```json
{
  "compilerOptions": {
    "strict": true,                          // 启用所有严格检查
    "noUnusedLocals": true,                  // 未使用的局部变量
    "noUnusedParameters": true,              // 未使用的参数
    "noImplicitReturns": true,               // 隐式返回
    "noFallthroughCasesInSwitch": true,      // switch 穿透
    "noUncheckedIndexedAccess": true,        // 索引访问检查
    "exactOptionalPropertyTypes": true       // 精确可选属性
  }
}
```

## 步骤 4：配置 ESModule

### 启用 ESM（package.json）

```json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/index.js"
    }
  }
}
```

### 更新 tsconfig.json

```json
{
  "compilerOptions": {
    "module": "ESNext",                      // ESM 输出
    "moduleResolution": "Bundler",           // 打包器解析
    "resolveJsonModule": true,               // 导入 JSON
    "allowSyntheticDefaultImports": true,    // 合成默认导入
    
    /* 启用实验特性 */
    "experimentalDecorators": true,          // 装饰器
    "emitDecoratorMetadata": true           // 装饰器元数据
  }
}
```

## 步骤 5：配置路径映射

### 设置路径别名（tsconfig.json）

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@config": ["./config"],
      "@config/*": ["./config/*"],
      "@utils": ["./utils"],
      "@utils/*": ["./utils/*"],
      "@types": ["./types"],
      "@types/*": ["./types/*"],
      "@lib/*": ["./lib/*"],
      "@services/*": ["./services/*"],
      "@models/*": ["./models/*"]
    }
  }
}
```

### 配置运行时解析

安装路径解析工具：

```bash
pnpm add -D tsconfig-paths
```

更新 package.json 脚本：

```json
{
  "scripts": {
    "dev": "tsx watch --tsconfig tsconfig.json src/index.ts",
    "build": "tsc",
    "start": "node --loader tsconfig-paths/esm ./dist/index.js"
  }
}
```

## 步骤 6：创建项目结构

```bash
# 创建目录结构
mkdir -p src/{config,utils,types,lib,services,models}

# 创建入口文件
cat > src/index.ts << 'EOF'
import { config } from '@config';

console.log('TypeScript is configured!');
console.log('Node version:', process.version);
console.log('Environment:', config.nodeEnv);

export const hello = (name: string): string => {
  return `Hello, ${name}!`;
};
EOF

# 创建配置文件
cat > src/config/index.ts << 'EOF'
export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10)
} as const;
EOF

# 创建类型定义
cat > src/types/index.ts << 'EOF'
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export type Optional<T> = T | null | undefined;
EOF
```

## 步骤 7：配置开发工具

### 添加开发脚本（package.json）

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "build:clean": "rm -rf dist && tsc",
    "check": "tsc --noEmit",
    "check:watch": "tsc --noEmit --watch"
  }
}
```

### VS Code 配置（.vscode/settings.json）

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

## 步骤 8：验证配置

### 类型检查

```bash
# 运行类型检查
pnpm check

# 应该看到
# ✔ No errors
```

### 编译测试

```bash
# 编译项目
pnpm build

# 检查输出
ls -la dist/
# 应该看到:
# index.js
# index.d.ts
# config/
# types/
```

### 运行测试

```bash
# 开发模式运行
pnpm dev

# 应该输出:
# TypeScript is configured!
# Node version: v20.11.0
# Environment: development
```

## 高级配置

### 多配置文件

创建不同环境的配置：

```bash
# tsconfig.base.json - 基础配置
# tsconfig.json - 开发配置
# tsconfig.build.json - 构建配置
# tsconfig.test.json - 测试配置
```

`tsconfig.build.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": false,
    "removeComments": true,
    "declaration": true
  },
  "exclude": ["**/*.test.ts", "**/*.spec.ts"]
}
```

### 性能优化

```json
{
  "compilerOptions": {
    "incremental": true,                     // 增量编译
    "tsBuildInfoFile": ".tsbuildinfo",       // 构建信息文件
    "assumeChangesOnlyAffectDirectDependencies": true
  }
}
```

## 常见问题

### 路径别名不工作

确保安装并配置了 tsconfig-paths：

```bash
# 安装
pnpm add -D tsconfig-paths

# 在入口文件顶部添加
import 'tsconfig-paths/register';
```

### 编译错误：Cannot find module

检查 tsconfig.json 的 include 和 exclude：

```json
{
  "include": ["src/**/*", "types/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### ESM 导入错误

确保文件扩展名完整：

```typescript
// ❌ 错误
import { config } from './config';

// ✅ 正确（ESM 需要扩展名）
import { config } from './config.js';
```

## 下一步

TypeScript 配置完成！接下来可以：

1. [配置 ESLint](../linting/how-to-setup-eslint.md) - 添加代码检查
2. [配置测试框架](../testing/how-to-setup-testing.md) - 添加单元测试
3. [创建 Monorepo](../monorepo/how-to-create-monorepo.md) - 多包项目

---

*提示：逐步启用严格模式，避免一次性面对太多类型错误。*