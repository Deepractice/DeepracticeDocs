---
layer: Practice
type: Reference
title: ESModule 配置标准
category: node-development-environment/typescript
status: published
version: 1.0.0
date: 2025-01-15

purpose: 定义 ESModule 在 TypeScript 项目中的配置标准
scope:
  includes:
    - ESM 配置选项
    - 导入导出规范
    - 兼容性处理
  excludes:
    - CommonJS 详细说明
outcome:
  - 标准的 ESM 配置
  - 正确的模块系统
---

# ESModule 配置标准

## package.json 配置

```json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## tsconfig.json 配置

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "target": "ES2022",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
```

## 导入规范

```typescript
// 使用完整扩展名
import { util } from './util.js';

// 导入 JSON
import config from './config.json' assert { type: 'json' };

// 动态导入
const module = await import('./dynamic.js');
```

---

*记住：ESM 是 JavaScript 的未来，尽早迁移。*
