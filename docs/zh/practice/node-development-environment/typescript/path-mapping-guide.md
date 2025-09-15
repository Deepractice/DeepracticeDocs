---
layer: Practice
type: How-to
title: 路径映射配置指南
category: node-development-environment/typescript
status: published
version: 1.0.0
date: 2025-01-15

purpose: 配置 TypeScript 路径别名
scope:
  progression:
    1. 配置 tsconfig paths
    2. 配置运行时解析
    3. 配置构建工具
outcome:
  - 简洁的导入路径
  - 统一的路径管理
---

# 路径映射配置指南

## 步骤 1：配置 tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@config": ["./config"],
      "@utils": ["./utils"],
      "@types": ["./types"],
      "@services/*": ["./services/*"],
      "@models/*": ["./models/*"]
    }
  }
}
```

## 步骤 2：安装运行时支持

```bash
pnpm add -D tsconfig-paths tsx
```

## 步骤 3：配置脚本

```json
{
  "scripts": {
    "dev": "tsx watch --tsconfig tsconfig.json src/index.ts",
    "build": "tsc && tsc-alias",
    "start": "node --loader tsconfig-paths/esm ./dist/index.js"
  }
}
```

## 使用示例

```typescript
// 之前
import { config } from '../../../config';
import { logger } from '../../../utils/logger';

// 之后
import { config } from '@config';
import { logger } from '@utils/logger';
```

---

*提示：路径别名提高代码可读性，但不要过度使用。*
