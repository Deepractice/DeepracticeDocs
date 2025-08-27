# 技术栈版本兼容性矩阵

## 概述

本文档维护 Deepractice 技术规范体系中所有工具和框架的版本要求，确保技术栈的兼容性和一致性。

## 核心运行环境

| 环境 | 最低版本 | 推荐版本 | 备注 |
|------|---------|----------|------|
| Node.js | 18.19.0 | 20.x LTS | 使用 LTS 版本保证稳定性 |
| npm | 9.0.0 | 10.x | 用于安装 pnpm |
| pnpm | 8.0.0 | 8.15.0 | 主要包管理器 |

## TypeScript 生态

| 工具 | 最低版本 | 推荐版本 | 备注 |
|------|---------|----------|------|
| TypeScript | 4.5 | 5.x 最新稳定版 | 每季度评估升级 |
| tsx | 3.0.0 | 最新版 | 开发时执行工具 |
| tsup | 6.0.0 | 最新版 | 构建工具 |
| @types/node | 与 Node.js 版本对应 | 20.x | 类型定义包 |

## Monorepo 工具链

| 工具 | 最低版本 | 推荐版本 | 备注 |
|------|---------|----------|------|
| Turborepo | 1.10.0 | 最新版 | 任务编排工具 |
| Lefthook | 1.4.0 | 最新版 | Git hooks 管理 |
| Changesets | 2.26.0 | 最新版 | 版本管理（可选） |

## 代码质量工具

| 工具 | 最低版本 | 推荐版本 | 备注 |
|------|---------|----------|------|
| ESLint | 8.40.0 | 8.x 最新 | 代码检查 |
| @typescript-eslint/parser | 6.0.0 | 6.x 最新 | TypeScript 解析器 |
| @typescript-eslint/eslint-plugin | 6.0.0 | 6.x 最新 | TypeScript 规则 |
| Prettier | 3.0.0 | 3.x 最新 | 代码格式化 |
| Vitest | 0.34.0 | 1.x 最新 | 测试框架 |

## 前端框架（参考）

| 框架 | 最低版本 | 推荐版本 | 备注 |
|------|---------|----------|------|
| React | 18.0.0 | 18.2.0+ | 支持并发特性 |
| Vue | 3.3.0 | 3.4.0+ | Composition API |
| Vite | 4.0.0 | 5.x | 开发服务器和构建工具 |
| Next.js | 13.4.0 | 14.x | React 全栈框架 |

## 版本升级策略

### 升级周期
- **安全更新**：立即升级
- **补丁版本**：每月评估
- **次版本**：每季度评估
- **主版本**：每半年评估，需要充分测试

### 兼容性原则
1. 保持主要依赖的版本一致性
2. 优先使用 LTS 版本
3. 新项目使用推荐版本
4. 现有项目满足最低版本即可

### 版本锁定
```json
// package.json 示例
{
  "engines": {
    "node": ">=18.19.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

## 版本检查脚本

```bash
#!/bin/bash
# check-versions.sh

echo "🔍 检查环境版本..."

# 检查 Node.js
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
echo "Node.js: $NODE_VERSION"

# 检查 pnpm
PNPM_VERSION=$(pnpm -v)
echo "pnpm: $PNPM_VERSION"

# 检查 TypeScript
TS_VERSION=$(npx tsc -v | cut -d ' ' -f 2)
echo "TypeScript: $TS_VERSION"

# 版本比较函数
version_ge() {
  [ "$(printf '%s\n' "$1" "$2" | sort -V | head -n1)" = "$2" ]
}

# 验证最低版本
if version_ge "$NODE_VERSION" "18.19.0"; then
  echo "✅ Node.js 版本满足要求"
else
  echo "❌ Node.js 版本过低，需要 >= 18.19.0"
  exit 1
fi

if version_ge "$PNPM_VERSION" "8.0.0"; then
  echo "✅ pnpm 版本满足要求"
else
  echo "❌ pnpm 版本过低，需要 >= 8.0.0"
  exit 1
fi

echo "✨ 环境检查完成"
```

## 更新记录

| 日期 | 更新内容 | 影响范围 |
|------|---------|----------|
| 2024-01 | 初始版本发布 | 全部 |
| 2024-02 | TypeScript 升级到 5.x | TypeScript 项目 |
| 2024-03 | pnpm 版本统一为 8.15.0 | Monorepo 项目 |

## 常见问题

### 版本冲突如何解决？
1. 检查 `pnpm-lock.yaml` 文件
2. 运行 `pnpm why <package>` 查看依赖关系
3. 使用 `overrides` 字段统一版本

### 如何处理破坏性更新？
1. 查看官方迁移指南
2. 在独立分支进行升级
3. 完整运行测试套件
4. 逐步迁移，不要一次性升级所有依赖

## 相关文档

- [Monorepo 环境配置](./monorepo/environment)
- [TypeScript 配置规范](./typescript/config)
- [开发工具配置](./typescript/toolchain)