# 协作流程

本章定义团队协作的流程规范，包括 Pull Request 流程、代码审查标准、冲突解决等。

## Pull Request 流程

### PR 创建流程

```mermaid
flowchart LR
    A[创建分支] --> B[开发功能]
    B --> C[本地测试]
    C --> D[推送分支]
    D --> E[创建 PR]
    E --> F[自动检查]
    F --> G[代码审查]
    G --> H[合并]
    H --> I[删除分支]
```

### PR 标题规范

PR 标题应遵循 Conventional Commits 格式：

```yaml
# 格式
<type>(<scope>): <description>

# 示例
feat(auth): implement OAuth2 authentication
fix(api): resolve timeout issue in user service
docs: update contribution guidelines
chore(deps): upgrade React to v18
```

### PR 描述模板

`.github/pull_request_template.md`：

```markdown
## 概述
<!-- 简要描述这个 PR 的目的和内容 -->

## 改动类型
- [ ] 🆕 新功能 (feat)
- [ ] 🐛 问题修复 (fix)  
- [ ] 📝 文档更新 (docs)
- [ ] ♻️ 代码重构 (refactor)
- [ ] ⚡ 性能优化 (perf)
- [ ] ✅ 测试相关 (test)
- [ ] 🔧 配置变更 (chore)

## 改动说明
<!-- 详细说明具体改动了什么，为什么要改 -->

## 测试方法
<!-- 描述如何测试这些改动 -->
1. 
2. 
3. 

## 关联 Issue
<!-- 关联的 Issue 编号 -->
Closes #

## 检查清单
- [ ] 代码已自测
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 所有测试通过
- [ ] 代码符合规范
- [ ] 无 console.log 等调试代码

## 截图（如适用）
<!-- 添加 UI 改动的截图 -->

## 其他说明
<!-- 其他需要说明的内容 -->
```

### PR 大小建议

| PR 类型 | 建议行数 | 文件数 | 审查时间 |
|---------|---------|---------|----------|
| 小型 | < 100 | < 5 | < 15 分钟 |
| 中型 | 100-400 | 5-10 | 15-60 分钟 |
| 大型 | 400-1000 | 10-20 | 1-2 小时 |
| 特大型 | > 1000 | > 20 | 需要拆分 |

**拆分策略**：
```bash
# 按层次拆分
PR 1: 数据模型和数据库迁移
PR 2: API 接口实现
PR 3: 前端界面
PR 4: 测试和文档

# 按功能拆分
PR 1: 用户注册功能
PR 2: 用户登录功能
PR 3: 密码重置功能
```

## 代码审查

### 审查要求

根据 Q&A 决策，所有 PR 需要至少 1 人审查通过：

```yaml
review_requirements:
  minimum_approvals: 1
  dismiss_stale_reviews: true
  require_up_to_date: true
```

### 审查重点

#### 功能性审查
- ✅ 代码是否实现了预期功能
- ✅ 边界情况是否处理
- ✅ 错误处理是否完善
- ✅ 是否有潜在的 bug

#### 代码质量审查
- ✅ 代码是否易读易懂
- ✅ 命名是否清晰合理
- ✅ 是否遵循项目规范
- ✅ 是否有重复代码

#### 性能审查
- ✅ 是否有性能问题
- ✅ 算法复杂度是否合理
- ✅ 是否有不必要的计算
- ✅ 资源是否正确释放

#### 安全审查
- ✅ 是否有安全漏洞
- ✅ 输入是否验证
- ✅ 敏感信息是否保护
- ✅ 权限是否正确控制

### 审查评论规范

#### 评论格式

```markdown
# 提出问题
[问题] 这里为什么使用同步方法而不是异步？

# 建议改进
[建议] 可以考虑使用 Map 代替 Object 来提高查找性能

# 必须修改
[必须] 这里需要添加空值检查，否则会导致崩溃

# 讨论
[讨论] 关于这个设计方案，我觉得可以考虑...

# 赞赏
[赞赏] 这个实现很巧妙，学习了！

# 提示
[提示] 这里可以使用 ES6 的解构语法简化代码
```

#### 评论原则

```yaml
good_practices:
  - 保持专业和友好
  - 提供具体的改进建议
  - 解释为什么需要修改
  - 认可好的实现
  - 分享相关知识

bad_practices:
  - 人身攻击
  - 过于挑剔细节
  - 只指出问题不给建议
  - 使用命令式语气
  - 忽视上下文
```

### 审查回复

作为 PR 作者，应该：

```markdown
# 接受建议
感谢建议，已按照建议修改 ✅

# 解释原因
这里使用同步是因为需要保证执行顺序，异步会导致...

# 提出疑问
我理解你的观点，但这种情况下是否会影响...？

# 后续处理
这是个好建议，但改动较大，我创建了 #123 来跟踪

# 已有考虑
之前考虑过这个方案，但因为 XXX 原因选择了当前实现
```

## 本地检查

### 必需检查项

所有 PR 提交前应通过以下本地检查：

```bash
# 代码规范检查
npm run lint

# 单元测试
npm test

# 构建检查
npm run build

# 类型检查
npm run type-check
```

### 使用 Git Hooks 自动检查

通过配置 Git Hooks（参见[工具配置](./tooling)），可以在提交和推送时自动执行这些检查，确保代码质量。

## 冲突解决

### 冲突责任

根据规范，**PR 作者负责解决冲突**：

```bash
# 1. 更新本地 main
git checkout main
git pull origin main

# 2. 回到功能分支
git checkout feature/my-feature

# 3. rebase 到最新 main
git rebase main

# 4. 解决冲突
# 编辑冲突文件
git add <resolved-files>
git rebase --continue

# 5. 强制推送
git push --force-with-lease origin feature/my-feature
```

### 冲突解决策略

#### 文本冲突

```bash
# 冲突标记
<<<<<<< HEAD
当前分支的代码
=======
要合并的代码
>>>>>>> feature/other

# 解决方法
1. 理解双方改动的意图
2. 保留必要的改动
3. 确保合并后功能正常
4. 运行测试验证
```

#### 逻辑冲突

```javascript
// 分支 A: 重命名了函数
function calculateTotal() { }

// 分支 B: 调用了旧函数名
const result = calcTotal(); // 会导致错误

// 解决: 更新所有引用
const result = calculateTotal();
```

### 冲突预防

```yaml
prevention_strategies:
  - 保持 PR 小而专注
  - 频繁同步主分支
  - 提前沟通大的改动
  - 使用功能开关隔离
  - 合理安排合并顺序
```

## 合并策略

### 合并方式选择

基于 Q&A 决策的灵活策略：

```yaml
merge_strategies:
  small_features:  # < 5 commits
    strategy: squash_and_merge
    reason: 保持历史简洁
    
  large_features:  # >= 5 commits
    strategy: rebase_and_merge
    reason: 保留开发历史
    
  hotfixes:
    strategy: create_merge_commit
    reason: 保留完整上下文
    
  dependencies:
    strategy: squash_and_merge
    reason: 简化依赖更新历史
```

### 合并前检查清单

```markdown
## 合并前确认
- [ ] 所有本地测试通过
- [ ] 代码审查已批准
- [ ] 冲突已解决
- [ ] 功能已测试
- [ ] 文档已更新
- [ ] PR 描述完整
- [ ] commit 信息规范
```

## 分支保护例外

### 申请机制

根据规范，特殊情况可申请临时权限：

```yaml
exception_process:
  1. 创建申请 Issue:
     title: "[权限申请] 紧急修复生产问题"
     body: |
       - 原因: 生产环境崩溃
       - 影响: 所有用户无法登录
       - 预计时间: 30分钟
       - 负责人: @username
  
  2. 获取批准:
     - 需要: 技术负责人批准
     - 方式: Issue 评论确认
  
  3. 临时授权:
     - 时限: 最多 2 小时
     - 权限: 直推 main
  
  4. 事后处理:
     - 创建 PR 记录改动
     - 编写事故报告
     - 撤销临时权限
```

## 文档更新

### 同步更新要求

根据规范，重要功能需要同步更新文档：

```yaml
documentation_requirements:
  required:  # 必须同步更新
    - API 变更
    - 破坏性变更
    - 新功能 (feat)
    - 配置变更
    
  optional:  # 可以异步更新
    - 内部重构
    - 性能优化
    - 测试添加
    - 样式调整
```

### 文档更新清单

```markdown
## 文档更新检查
- [ ] README.md 更新
- [ ] API 文档更新
- [ ] 配置说明更新
- [ ] CHANGELOG 更新
- [ ] 迁移指南（如需要）
- [ ] 示例代码更新
```

## 协作工具

### PR 标签系统

使用标签分类和跟踪 PR：

```yaml
labels:
  # 类型标签
  - "type: feature"
  - "type: bugfix"
  - "type: docs"
  - "type: refactor"
  
  # 优先级标签
  - "priority: high"
  - "priority: medium"
  - "priority: low"
  
  # 状态标签
  - "status: WIP"
  - "status: ready"
  - "status: blocked"
  - "status: needs-review"
  
  # 其他标签
  - "breaking-change"
  - "good first issue"
  - "help wanted"
  - "dependencies"
```

### 自动化工具

#### 自动分配审查者

`.github/CODEOWNERS`：

```bash
# 全局规则
* @teamlead @senior-dev

# 前端代码
/frontend/ @frontend-team
/src/components/ @ui-team

# 后端代码
/backend/ @backend-team
/api/ @api-team

# 文档
/docs/ @docs-team
*.md @docs-team

# 配置文件
/.github/ @devops-team
/docker/ @devops-team
```

#### PR 自动化

```yaml
# .github/workflows/auto-pr.yml
name: Auto PR Management

on:
  pull_request:
    types: [opened, ready_for_review]

jobs:
  auto-label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v4
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
          
  auto-assign:
    runs-on: ubuntu-latest
    steps:
      - uses: kentaro-m/auto-assign-action@v1.2.4
        with:
          configuration-path: ".github/auto-assign.yml"
```

## 最佳实践

### DO ✅

- 保持 PR 小而专注
- 提供清晰的描述和测试方法
- 及时响应审查评论
- 在合并前解决所有评论
- 使用 Draft PR 进行早期反馈

### DON'T ❌

- 不要在 PR 中混合多个功能
- 避免忽视审查意见
- 不要强行合并有问题的代码
- 避免大量代码一次性提交
- 不要删除他人的评论

## 常见问题

### PR 被阻塞怎么办？

```yaml
solutions:
  依赖其他PR:
    - 标记依赖关系
    - 先合并被依赖的 PR
    - 或使用 stacked PR
    
  等待审查:
    - ping 审查者
    - 寻找其他审查者
    - 在团队会议上提出
    
  测试失败:
    - 检查失败原因
    - 本地复现问题
    - 修复后重新推送
```

### 如何处理大型 PR？

```yaml
strategies:
  预防:
    - 提前沟通和设计评审
    - 增量开发和提交
    - 使用功能开关
    
  处理:
    - 拆分成多个 PR
    - 安排专门的审查会议
    - 提供详细的说明文档
    - 考虑结对审查
```

## 下一步

掌握协作流程后，请参考：
- [版本发布](./release) - 学习版本管理和发布流程
- [工具配置](./tooling) - 配置自动化协作工具