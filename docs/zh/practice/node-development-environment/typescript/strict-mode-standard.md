---
layer: Practice
type: Reference
title: TypeScript 严格模式标准
category: node-development-environment/typescript
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude

purpose: 定义 TypeScript 严格模式的配置标准
scope:
  includes:
    - 严格模式选项
    - 迁移策略
    - 错误处理
  excludes:
    - 具体代码修改
    - 业务逻辑重构
outcome:
  - 零妥协的类型安全
  - 渐进式迁移方案
---

# TypeScript 严格模式标准

## 严格模式选项

### 核心严格选项

| 选项 | 默认 | 推荐 | 说明 |
|------|------|------|------|
| `strict` | false | **true** | 启用所有严格检查 |
| `noImplicitAny` | false | **true** | 禁止隐式 any |
| `strictNullChecks` | false | **true** | 严格空值检查 |
| `strictFunctionTypes` | false | **true** | 严格函数类型 |
| `strictBindCallApply` | false | **true** | 严格 bind/call/apply |
| `strictPropertyInitialization` | false | **true** | 严格属性初始化 |
| `noImplicitThis` | false | **true** | 禁止隐式 this |
| `alwaysStrict` | false | **true** | 始终严格模式 |

### 额外质量选项

| 选项 | 推荐 | 说明 |
|------|------|------|
| `noUnusedLocals` | true | 未使用的局部变量 |
| `noUnusedParameters` | true | 未使用的参数 |
| `noImplicitReturns` | true | 隐式返回 |
| `noFallthroughCasesInSwitch` | true | switch 穿透 |
| `noUncheckedIndexedAccess` | true | 索引访问检查 |
| `exactOptionalPropertyTypes` | true | 精确可选属性 |
| `noImplicitOverride` | true | 显式 override |
| `noPropertyAccessFromIndexSignature` | true | 索引签名访问 |

## 完整严格配置

```json
{
  "compilerOptions": {
    /* 核心严格模式 */
    "strict": true,
    
    /* 额外严格检查 */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    
    /* 一致性检查 */
    "forceConsistentCasingInFileNames": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false
  }
}
```

## 渐进式迁移策略

### 阶段 1：基础（第 1 周）

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "strictNullChecks": false
  }
}
```

### 阶段 2：空值安全（第 2-3 周）

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### 阶段 3：完全严格（第 4 周）

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### 阶段 4：质量提升（第 5 周）

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## 常见错误处理

### 隐式 any

```typescript
// ❌ 错误
function process(data) { }

// ✅ 修复
function process(data: unknown) { }
```

### 空值检查

```typescript
// ❌ 错误
const value = obj.prop.nested;

// ✅ 修复
const value = obj?.prop?.nested;
```

### 索引访问

```typescript
// ❌ 错误
const item = arr[index];

// ✅ 修复
const item = arr[index];
if (item !== undefined) {
  // 使用 item
}
```

---

*记住：严格模式是 TypeScript 的精髓，逐步迁移比一次性启用更实际。*