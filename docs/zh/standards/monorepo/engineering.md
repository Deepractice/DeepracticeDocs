# 工程化规范

本章介绍 Monorepo 项目的工程化实践，包括自动化工具、质量保障、性能优化等最佳实践。

## 第一条 Git Hooks 自动化

### 1.1 Lefthook 配置

#### 1.1.1 为什么选择 Lefthook
- **零依赖**：Go 编写的单二进制文件，无需 Node.js 依赖
- **速度快**：并行执行，支持文件过滤
- **配置简单**：YAML 配置，易于理解和维护
- **跨平台**：完美支持 Windows/Mac/Linux

#### 1.1.2 安装和初始化
```bash
# 安装 Lefthook
pnpm add -D -w lefthook

# 初始化配置
npx lefthook install

# 添加到 prepare 脚本（自动安装）
{
  "scripts": {
    "prepare": "lefthook install"
  }
}
```

### 1.2 Hook 配置策略

#### 1.2.1 完整配置
`lefthook.yml`：
```yaml
# 提交前检查
pre-commit:
  parallel: true
  commands:
    # 代码格式化
    format:
      glob: "*.{js,ts,tsx,json,md}"
      run: pnpm prettier --write {staged_files}
      stage_fixed: true  # 自动暂存修复的文件
    
    # 代码检查
    lint:
      glob: "*.{js,ts,tsx}"
      run: pnpm eslint --fix {staged_files}
      stage_fixed: true
    
    # 类型检查（仅检查改动的包）
    type-check:
      run: |
        files="{staged_files}"
        packages=$(echo $files | tr ' ' '\n' | grep -E '^(packages|apps|services)/' | cut -d'/' -f1-2 | sort -u)
        if [ ! -z "$packages" ]; then
          for pkg in $packages; do
            pnpm --filter "./$pkg" type-check
          done
        fi

# 提交信息检查
commit-msg:
  commands:
    validate:
      run: |
        # 检查提交信息格式
        commit_regex='^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .{1,50}'
        if ! grep -qE "$commit_regex" "$1"; then
          echo "❌ 提交信息必须符合约定式提交规范"
          echo "格式: <type>(<scope>): <subject>"
          echo ""
          echo "类型说明:"
          echo "  feat:     新功能"
          echo "  fix:      修复问题"
          echo "  docs:     文档更新"
          echo "  style:    代码格式"
          echo "  refactor: 重构代码"
          echo "  perf:     性能优化"
          echo "  test:     测试相关"
          echo "  build:    构建系统"
          echo "  ci:       CI 配置"
          echo "  chore:    其他改动"
          echo ""
          echo "示例: feat(auth): add login functionality"
          exit 1
        fi

# 推送前检查
pre-push:
  parallel: false
  commands:
    test:
      run: turbo run test --filter=[origin/main]
    build:
      run: turbo run build --filter=[origin/main]

# 自定义跳过条件
skip:
  - merge: true      # 合并时跳过
  - rebase: true     # rebase 时跳过
```

#### 1.2.2 性能优化配置
```yaml
# 只检查改动的文件
pre-commit:
  commands:
    affected-only:
      run: turbo run lint test build --filter=[HEAD^]
      
# 使用缓存
pre-push:
  commands:
    cached-test:
      run: turbo run test --cache-dir=.turbo
```

## 第二条 代码质量自动化

### 2.1 自动格式化

#### 2.1.1 VSCode 保存时格式化
`.vscode/settings.json`：
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.turbo/**": true,
    "**/dist/**": true
  }
}
```

#### 2.1.2 Import 自动排序
`.eslintrc.js`：
```javascript
{
  rules: {
    'import/order': ['error', {
      groups: [
        'builtin',    // Node.js 内置
        'external',   // 外部包
        'internal',   // 内部别名
        'parent',     // 父级目录
        'sibling',    // 同级文件
        'index',      // 索引文件
        'type'        // 类型导入
      ],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      },
      pathGroups: [
        {
          pattern: '@myproject/**',
          group: 'internal',
          position: 'before'
        }
      ]
    }]
  }
}
```

### 2.2 自动化测试

#### 2.2.1 测试覆盖率门禁
`vitest.config.ts`：
```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      },
      exclude: [
        'node_modules',
        'dist',
        '**/*.config.ts',
        '**/*.d.ts',
        '**/*.test.ts'
      ]
    }
  }
})
```

#### 2.2.2 自动化测试脚本
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest watch",
    "test:changed": "vitest --changed --passWithNoTests"
  }
}
```

## 第三条 构建优化

### 3.1 缓存策略

#### 3.1.1 Turborepo 缓存配置
`turbo.json`：
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": [
        "src/**/*",
        "package.json",
        "tsconfig.json",
        "tsup.config.ts",
        "!**/*.test.ts",
        "!**/*.spec.ts",
        "!**/*.md"
      ],
      "outputs": [
        "dist/**",
        ".next/**"
      ],
      "cache": true,
      "env": [
        "NODE_ENV",
        "API_URL"
      ]
    }
  },
  "globalEnv": [
    "NODE_ENV"
  ],
  "globalDependencies": [
    "pnpm-lock.yaml",
    ".env",
    "tsconfig.json"
  ]
}
```

#### 3.1.2 构建性能监控
```bash
# 分析构建性能
turbo run build --profile=profile.json

# 可视化分析结果
pnpm add -D -w turbo-profiler
npx turbo-profiler profile.json
```

### 3.2 Bundle 优化

#### 3.2.1 Tree Shaking 配置
`tsup.config.ts`：
```typescript
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  treeshake: true,  // 启用 tree shaking
  splitting: true,  // 代码分割
  minify: true,     // 生产环境压缩
  clean: true,
  dts: {
    resolve: true   // 解析类型依赖
  },
  external: [
    // 外部化 peer dependencies
    'react',
    'react-dom'
  ],
  esbuildOptions(options) {
    options.conditions = ['import', 'module']
    options.platform = 'neutral'
  }
})
```

#### 3.2.2 Bundle 分析
```json
{
  "scripts": {
    "analyze": "pnpm build && npx bundle-buddy dist/**/*.js",
    "size": "size-limit",
    "why": "pnpm build && npx source-map-explorer dist/index.js"
  }
}

// .size-limit.json
[
  {
    "path": "dist/index.js",
    "limit": "10 KB"
  },
  {
    "path": "dist/index.mjs",
    "limit": "8 KB"
  }
]
```

## 第四条 开发体验优化

### 4.1 自动补全和类型提示

#### 4.1.1 路径别名配置
`tsconfig.json`：
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@myproject/*": ["./packages/*/src"],
      "@config/*": ["./configs/*"],
      "@test/*": ["./test/*"]
    }
  }
}
```

#### 4.1.2 自动生成类型
```json
{
  "scripts": {
    // 自动生成 API 类型
    "generate:api-types": "openapi-typescript ./api-spec.yaml -o ./packages/types/src/api.d.ts",
    
    // 自动生成环境变量类型
    "generate:env-types": "node ./tools/scripts/generate-env-types.js"
  }
}
```

### 4.2 开发服务器优化

#### 4.2.1 并发启动配置
```json
{
  "scripts": {
    "dev": "turbo run dev --concurrency=10",
    "dev:apps": "turbo run dev --filter=./apps/*",
    "dev:packages": "turbo run dev --filter=./packages/*"
  }
}
```

#### 4.2.2 热更新优化
```typescript
// vite.config.ts (for apps)
export default defineConfig({
  server: {
    hmr: {
      overlay: true
    },
    watch: {
      // 监听 workspace 包
      ignored: ['!**/node_modules/@myproject/**']
    }
  },
  optimizeDeps: {
    include: [
      '@myproject/utils',
      '@myproject/ui'
    ]
  }
})
```

## 第五条 文档自动化

### 5.1 文档生成

#### 5.1.1 API 文档
```json
{
  "scripts": {
    // 生成 TypeDoc 文档
    "docs:api": "typedoc --out docs/api src/index.ts",
    
    // 生成 README
    "docs:readme": "node ./tools/scripts/generate-readme.js"
  }
}
```

#### 5.1.2 变更日志
```bash
# 使用 changesets
pnpm changeset init

# 配置
// .changeset/config.json
{
  "changelog": [
    "@changesets/changelog-github",
    { "repo": "myorg/myrepo" }
  ],
  "commit": false,
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch"
}
```

### 5.2 文档检查

#### 5.2.1 Markdown 规范
```yaml
# .markdownlint.json
{
  "default": true,
  "MD013": false,  // 行长度
  "MD033": false,  // 允许 HTML
  "MD041": false   // 首行标题
}
```

#### 5.2.2 链接检查
```json
{
  "scripts": {
    "docs:check-links": "markdown-link-check ./docs/**/*.md"
  }
}
```


## 第六条 命令管理规范

### 6.1 命令命名标准

#### 6.1.1 标准命令集
所有包都应该实现以下标准命令：
```json
{
  "scripts": {
    // 核心命令（必须）
    "dev": "开发模式",
    "build": "构建生产版本",
    "test": "运行测试",
    "lint": "代码检查",
    "type-check": "类型检查",
    
    // 扩展命令（可选）
    "test:watch": "监听模式测试",
    "test:coverage": "测试覆盖率",
    "build:watch": "监听模式构建",
    "clean": "清理构建产物"
  }
}
```

#### 6.1.2 命名约定
```json
{
  "scripts": {
    // ✅ 正确：使用冒号分隔子命令
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    
    // ❌ 错误：避免使用下划线或驼峰
    "test_watch": "vitest watch",
    "testWatch": "vitest watch",
    
    // ✅ 正确：动词开头
    "build": "tsup",
    "generate:types": "tsc",
    
    // ❌ 错误：名词开头
    "types": "tsc",
    "production": "npm run build"
  }
}
```

### 6.2 命令分层策略

#### 6.2.1 根目录命令
`package.json` (根目录)：
```json
{
  "scripts": {
    // 全局操作
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    
    // 工作区管理
    "clean": "turbo run clean && rm -rf node_modules",
    "fresh": "pnpm clean && pnpm install",
    "update:deps": "pnpm update -r --interactive --latest",
    
    // 工具命令
    "create:package": "node tools/scripts/create-package.js",
    "check:deps": "pnpm outdated -r",
    "analyze": "turbo run build --profile",
    
    // Git hooks
    "prepare": "lefthook install",
    "pre-commit": "lefthook run pre-commit",
    
    // 版本管理
    "changeset": "changeset",
    "version": "changeset version",
    "release": "pnpm build && changeset publish"
  }
}
```

#### 6.2.2 包级别命令
`packages/*/package.json`：
```json
{
  "scripts": {
    // 核心命令（与根目录保持一致）
    "dev": "tsup --watch",
    "build": "tsup",
    "test": "vitest run",
    "lint": "eslint src",
    "type-check": "tsc --noEmit",
    
    // 包特定命令
    "prebuild": "rm -rf dist",
    "postbuild": "size-limit",
    
    // 不应该出现在包级别的命令
    // ❌ "prepare": "...",  // 只在根目录
    // ❌ "install": "...",  // 由包管理器处理
    // ❌ "publish": "..."   // 由根目录统一发布
  }
}
```

### 6.3 命令组织原则

#### 6.3.1 命令分类
```json
{
  "scripts": {
    // 1. 开发命令（dev:*）
    "dev": "主开发命令",
    "dev:debug": "调试模式",
    "dev:prod": "生产模式本地测试",
    
    // 2. 构建命令（build:*）
    "build": "主构建命令",
    "build:watch": "监听构建",
    "build:analyze": "构建分析",
    
    // 3. 测试命令（test:*）
    "test": "主测试命令",
    "test:unit": "单元测试",
    "test:e2e": "端到端测试",
    "test:coverage": "覆盖率测试",
    
    // 4. 检查命令（check:* 或具体工具名）
    "lint": "ESLint 检查",
    "type-check": "TypeScript 检查",
    "check:circular": "循环依赖检查",
    "check:size": "包大小检查",
    
    // 5. 工具命令（tool:* 或 generate:*）
    "generate:types": "生成类型",
    "generate:docs": "生成文档",
    
    // 6. 维护命令（clean:*, fix:*）
    "clean": "清理",
    "clean:cache": "清理缓存",
    "fix": "自动修复",
    "fix:lint": "修复 lint 问题"
  }
}
```

#### 6.3.2 命令依赖关系
```json
{
  "scripts": {
    // 使用 pre/post 钩子
    "prebuild": "pnpm clean",
    "build": "tsup",
    "postbuild": "pnpm size-check",
    
    // 使用 && 串联相关命令
    "ci": "pnpm lint && pnpm type-check && pnpm test && pnpm build",
    
    // 使用 npm-run-all 并行执行
    "validate": "run-p lint type-check test"
  }
}
```

### 6.4 环境变量管理

#### 6.4.1 命令中的环境变量
```json
{
  "scripts": {
    // 显式设置环境变量
    "dev": "NODE_ENV=development vite",
    "build": "NODE_ENV=production vite build",
    "test": "NODE_ENV=test vitest",
    
    // 跨平台环境变量（使用 cross-env）
    "dev:cross": "cross-env NODE_ENV=development vite",
    "build:cross": "cross-env NODE_ENV=production vite build"
  }
}
```

#### 6.4.2 环境特定命令
```json
{
  "scripts": {
    // 根据环境选择配置
    "dev": "vite --config vite.dev.config.ts",
    "build:staging": "vite build --config vite.staging.config.ts",
    "build:prod": "vite build --config vite.prod.config.ts"
  }
}
```

### 6.5 命令文档化

#### 6.5.1 命令说明
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test"
  },
  "scripts-info": {
    "dev": "启动所有包的开发服务器，支持热更新",
    "build": "构建所有包的生产版本",
    "test": "运行所有包的测试套件"
  }
}
```

#### 6.5.2 README 文档
```markdown
## 命令说明

### 开发命令
- `pnpm dev` - 启动开发环境
- `pnpm dev --filter @myproject/web` - 只启动特定包

### 构建命令
- `pnpm build` - 构建所有包
- `pnpm build:analyze` - 构建并分析 bundle 大小

### 测试命令
- `pnpm test` - 运行测试
- `pnpm test:watch` - 监听模式
- `pnpm test:coverage` - 生成覆盖率报告
```

### 6.6 命令性能优化

#### 6.6.1 并行执行
```json
{
  "scripts": {
    // 串行执行（慢）
    "validate:serial": "pnpm lint && pnpm type-check && pnpm test",
    
    // 并行执行（快）
    "validate:parallel": "run-p lint type-check test",
    
    // Turbo 并行（最优）
    "validate:turbo": "turbo run lint type-check test"
  }
}
```

#### 6.6.2 条件执行
```json
{
  "scripts": {
    // 只在文件存在时执行
    "test": "[ -d src ] && vitest run || echo 'No tests'",
    
    // 只在 CI 环境执行
    "test:ci": "[ \"$CI\" = \"true\" ] && vitest run --coverage || vitest run"
  }
}
```

## 常见问题

### Lefthook 不执行？
```bash
# 检查是否安装
ls -la .git/hooks/

# 重新安装
npx lefthook install --force

# 手动执行测试
npx lefthook run pre-commit
```

### 构建缓存失效？
```bash
# 查看缓存 key
turbo run build --dry-run=json | jq '.tasks[].hash'

# 清理缓存
turbo daemon clean
rm -rf .turbo
```


## 最佳实践

### DO ✅
- 使用 Git Hooks 保证代码质量
- 配置缓存策略提升构建速度
- 自动化所有重复性工作
- 保持构建配置的简洁性

### DON'T ❌
- 不要禁用 Git Hooks
- 避免过度复杂的自动化
- 不要忽略构建警告
- 避免在 hooks 中执行耗时操作

## 下一步

完成工程化配置后：

1. **测试所有 Hooks** - `npx lefthook run pre-commit`
2. **验证构建流程** - `pnpm build`
3. **检查代码质量** - `pnpm lint && pnpm test`
4. **团队培训** - 确保团队了解工程化规范