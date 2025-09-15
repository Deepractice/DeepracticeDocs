---
layer: Practice
type: Reference
title: 环境变量配置标准
category: node-development-environment/nodejs
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - Node.js
  - 环境变量
  - NODE_ENV
  - 配置管理

purpose: 定义 Node.js 应用环境变量的命名、管理和使用标准
scope:
  includes:
    - 系统环境变量配置
    - 应用环境变量规范
    - 环境文件管理策略
    - 敏感信息处理
  excludes:
    - 具体业务配置值
    - 云平台特定变量
    - CI/CD 密钥管理
outcome:
  - 规范的环境变量命名
  - 安全的配置管理
  - 清晰的环境隔离
---

# 环境变量配置标准

## 核心环境变量

### NODE_ENV

**定义**：指定 Node.js 应用的运行环境

| 值 | 用途 | 特点 |
|----|------|------|
| `development` | 本地开发 | 详细日志、热重载、源码映射 |
| `test` | 测试环境 | 模拟数据、测试配置 |
| `staging` | 预发布环境 | 接近生产、真实数据 |
| `production` | 生产环境 | 性能优化、错误监控 |

**使用规范**：
```javascript
// 正确：使用明确的环境值
if (process.env.NODE_ENV === 'production') {
  // 生产环境逻辑
}

// 错误：使用模糊判断
if (process.env.NODE_ENV) {
  // 不明确的逻辑
}
```

### NODE_OPTIONS

**定义**：Node.js 运行时选项

```bash
# 内存配置
NODE_OPTIONS="--max-old-space-size=4096"

# 调试配置
NODE_OPTIONS="--inspect=0.0.0.0:9229"

# 实验性功能
NODE_OPTIONS="--experimental-specifier-resolution=node"

# 多个选项
NODE_OPTIONS="--max-old-space-size=4096 --enable-source-maps"
```

### PATH 相关

```bash
# Node.js 相关路径
NODE_PATH=/usr/local/lib/node_modules
NPM_CONFIG_PREFIX=~/.npm-global
PATH=$NPM_CONFIG_PREFIX/bin:$PATH
```

## 环境变量命名规范

### 命名规则

| 类型 | 格式 | 示例 |
|------|------|------|
| **系统变量** | `大写_下划线` | `NODE_ENV`, `NODE_OPTIONS` |
| **应用配置** | `APP_大写_下划线` | `APP_PORT`, `APP_HOST` |
| **服务连接** | `服务名_属性` | `DATABASE_URL`, `REDIS_HOST` |
| **特性开关** | `FEATURE_功能名` | `FEATURE_NEW_UI`, `FEATURE_BETA` |
| **API 密钥** | `服务_API_KEY` | `GITHUB_API_KEY`, `AWS_ACCESS_KEY` |

### 分组组织

```bash
# .env.example
# ==========================================
# Application
# ==========================================
APP_NAME=my-application
APP_PORT=3000
APP_HOST=localhost

# ==========================================
# Database
# ==========================================
DATABASE_URL=postgresql://user:pass@localhost:5432/db
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# ==========================================
# Redis
# ==========================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# ==========================================
# Feature Flags
# ==========================================
FEATURE_NEW_DASHBOARD=false
FEATURE_ENHANCED_SEARCH=true

# ==========================================
# External Services
# ==========================================
SENTRY_DSN=
STRIPE_SECRET_KEY=
SENDGRID_API_KEY=
```

## 环境文件管理

### 文件结构

```
project/
├── .env                  # 默认配置（Git 忽略）
├── .env.example         # 示例配置（提交到 Git）
├── .env.development     # 开发环境（Git 忽略）
├── .env.test           # 测试环境（Git 忽略）
├── .env.production     # 生产配置（绝不提交）
└── .env.local          # 本地覆盖（Git 忽略）
```

### 加载优先级

```javascript
// 使用 dotenv
require('dotenv').config(); // 加载 .env

// 按环境加载
const env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `.env.${env}` });

// 多文件加载顺序（优先级从高到低）
// 1. .env.{NODE_ENV}.local
// 2. .env.local
// 3. .env.{NODE_ENV}
// 4. .env
```

### .gitignore 配置

```gitignore
# 环境文件
.env
.env.local
.env.*.local
.env.development
.env.test
.env.staging
.env.production

# 保留示例文件
!.env.example
!.env.*.example
```

## 敏感信息处理

### 安全原则

1. **永不提交密钥** - 所有密钥必须在环境变量中
2. **使用密钥管理服务** - 生产环境使用 KMS/Vault
3. **最小权限原则** - 每个环境使用独立的凭证
4. **定期轮换** - 定期更新密钥和密码

### 密钥验证

```javascript
// utils/env-validator.js
const requiredEnvVars = {
  production: [
    'DATABASE_URL',
    'REDIS_URL',
    'JWT_SECRET',
    'SENTRY_DSN'
  ],
  development: [
    'DATABASE_URL'
  ]
};

function validateEnv() {
  const env = process.env.NODE_ENV || 'development';
  const required = requiredEnvVars[env] || [];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// 应用启动时验证
validateEnv();
```

## 类型安全配置

### TypeScript 支持

```typescript
// types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Node.js
      NODE_ENV: 'development' | 'test' | 'staging' | 'production';
      NODE_OPTIONS?: string;
      
      // Application
      APP_PORT: string;
      APP_HOST: string;
      
      // Database
      DATABASE_URL: string;
      DATABASE_POOL_MIN?: string;
      DATABASE_POOL_MAX?: string;
      
      // Feature Flags
      FEATURE_NEW_DASHBOARD?: string;
    }
  }
}

export {};
```

### 配置对象

```typescript
// config/index.ts
export const config = {
  app: {
    port: parseInt(process.env.APP_PORT || '3000', 10),
    host: process.env.APP_HOST || 'localhost',
    env: process.env.NODE_ENV || 'development',
  },
  database: {
    url: process.env.DATABASE_URL,
    pool: {
      min: parseInt(process.env.DATABASE_POOL_MIN || '2', 10),
      max: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),
    },
  },
  features: {
    newDashboard: process.env.FEATURE_NEW_DASHBOARD === 'true',
  },
} as const;
```

## 开发工具

### direnv 集成

```bash
# .envrc（direnv 配置文件）
export NODE_ENV=development
export APP_PORT=3000

# 加载 .env 文件
dotenv .env.development

# 自定义函数
use_nodejs() {
  local version=${1:-20}
  fnm use $version
}

use_nodejs 20
```

### cross-env 使用

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx src/index.ts",
    "dev:windows": "cross-env NODE_ENV=development tsx src/index.ts",
    "build": "cross-env NODE_ENV=production tsc",
    "test": "cross-env NODE_ENV=test vitest"
  }
}
```

## 最佳实践

### ✅ 推荐做法

1. **使用 .env.example**
   ```bash
   # 创建示例文件
   cp .env .env.example
   # 清空敏感值
   sed -i 's/=.*/=/' .env.example
   ```

2. **环境变量文档化**
   ```markdown
   ## Environment Variables
   
   | Variable | Required | Default | Description |
   |----------|----------|---------|-------------|
   | APP_PORT | No | 3000 | Application port |
   | DATABASE_URL | Yes | - | PostgreSQL connection string |
   ```

3. **使用配置对象**
   ```javascript
   // 不要直接使用 process.env
   // ❌ 错误
   app.listen(process.env.PORT);
   
   // ✅ 正确
   app.listen(config.app.port);
   ```

### ❌ 避免做法

1. **硬编码配置** - 不要在代码中硬编码任何配置
2. **提交密钥** - 绝不提交包含真实密钥的文件
3. **混用环境** - 不要在同一配置文件中混合多个环境
4. **忽略验证** - 不要跳过环境变量验证

## 故障排查

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 环境变量未生效 | 加载顺序问题 | 检查 dotenv 加载位置 |
| 类型错误 | 字符串类型 | 使用 parseInt/parseFloat |
| 生产环境泄露 | .env 文件提交 | 检查 .gitignore |
| Windows 兼容性 | 命令差异 | 使用 cross-env |

### 调试方法

```javascript
// 打印所有环境变量
console.log(process.env);

// 检查特定变量
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Is Production:', process.env.NODE_ENV === 'production');

// 使用 debug 包
const debug = require('debug')('app:config');
debug('Loading config for %s environment', process.env.NODE_ENV);
```

---

*记住：环境变量是配置管理的第一道防线，正确使用能避免 90% 的部署问题。*