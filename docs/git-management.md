# Git 版本管理指南

## 🏷️ 版本管理策略

### 语义化版本控制
```
主版本号.次版本号.修订号 (MAJOR.MINOR.PATCH)
例如: 1.0.0, 1.1.0, 1.1.1, 2.0.0
```

- **主版本号 (MAJOR)**: 不兼容的 API 修改
- **次版本号 (MINOR)**: 向下兼容的功能性新增  
- **修订号 (PATCH)**: 向下兼容的问题修正

### 当前项目版本
```json
// package.json
"version": "1.0.0"  // 初始版本
```

## 🌿 分支管理

### 分支结构
```
main (生产分支)
├── develop (开发分支)
├── feature/功能名 (功能分支)
└── hotfix/修复名 (紧急修复分支)
```

### 分支命名规范
```bash
feature/user-authentication    # 功能分支
hotfix/login-bug-fix          # 紧急修复
release/v1.1.0                # 发布分支
```

### 分支操作
```bash
# 创建并切换到新分支
git checkout -b feature/new-feature

# 切换分支
git checkout main
git checkout develop

# 合并分支
git checkout main
git merge develop

# 删除分支
git branch -d feature/old-feature
```

## 📝 提交信息规范

### Conventional Commits 格式
```
<类型>[可选 范围]: <描述>

[可选 正文]

[可选 脚注]
```

### 常用类型
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式修改
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 提交示例
```bash
feat: 添加用户认证功能
fix: 修复登录页面样式问题
docs: 更新部署指南
refactor: 重构 API 客户端配置
chore: 更新依赖包版本
```

## 🏷️ 标签管理

### 创建标签
```bash
# 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 创建里程碑标签
git tag -a milestone/web-complete -m "Web端开发完成"
```

### 标签操作
```bash
# 查看标签
git tag
git tag -l "v1.*"

# 推送标签
git push origin v1.0.0
git push origin --tags  # 推送所有标签

# 删除标签
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

## 🚀 开发流程

### 日常开发
```bash
# 1. 从 develop 创建功能分支
git checkout develop
git checkout -b feature/new-feature

# 2. 开发功能并提交
git add .
git commit -m "feat: 添加新功能"

# 3. 合并回 develop
git checkout develop
git merge feature/new-feature

# 4. 删除功能分支
git branch -d feature/new-feature
```

### 发布流程
```bash
# 1. 合并到 main
git checkout main
git merge develop

# 2. 打版本标签
git tag -a v1.1.0 -m "Release version 1.1.0"

# 3. 推送到远程
git push origin main
git push origin v1.1.0
```

### 紧急修复
```bash
# 1. 从 main 创建 hotfix 分支
git checkout main
git checkout -b hotfix/urgent-fix

# 2. 修复并提交
git add .
git commit -m "fix: 紧急修复问题"

# 3. 合并到 main 和 develop
git checkout main
git merge hotfix/urgent-fix
git tag -a v1.0.1 -m "Hotfix version 1.0.1"

git checkout develop
git merge hotfix/urgent-fix

# 4. 推送
git push origin main
git push origin develop
git push origin v1.0.1
```

## 📋 项目版本规划

### v1.0.0 - 基础版本 (当前)
- ✅ Web端基础架构
- ✅ 用户认证系统
- ✅ 基础UI组件
- ✅ 移动端架构

### v1.1.0 - 功能完善版本
- 🔄 完善移动端功能
- 🔄 AI分析功能
- 🔄 数据同步

### v1.2.0 - 优化版本
- 🔄 性能优化
- 🔄 用户体验改进
- 🔄 错误处理完善

## 🎯 第一次提交 (当前状态)

```bash
# 创建 develop 分支
git checkout -b develop

# 提交当前所有更改
git add .
git commit -m "feat: 完成项目基础架构和跨平台配置

- 统一项目命名为 xinze
- 完成 Web 端基础架构
- 添加 Flutter 移动端架构
- 统一 API 配置管理
- 完善部署配置和文档
- 支持 Android/iOS/鸿蒙平台"

# 合并到 main
git checkout main
git merge develop

# 打标签
git tag -a v1.0.0 -m "Release version 1.0.0 - 基础架构完成"

# 推送
git push origin main
git push origin develop
git push origin v1.0.0
```

## 📚 常用命令速查

### 基础操作
```bash
git status                    # 查看状态
git add .                     # 添加所有文件
git commit -m "message"       # 提交
git push origin branch-name   # 推送分支
git pull origin branch-name   # 拉取分支
```

### 分支操作
```bash
git branch                    # 查看分支
git branch -a                 # 查看所有分支
git checkout -b new-branch    # 创建并切换分支
git merge branch-name         # 合并分支
```

### 标签操作
```bash
git tag                       # 查看标签
git tag -a v1.0.0 -m "msg"   # 创建标签
git push origin --tags        # 推送所有标签
```

### 撤销操作
```bash
git reset --soft HEAD~1       # 撤销提交，保留更改
git reset --hard HEAD~1       # 撤销提交，丢弃更改
git checkout -- filename      # 撤销文件更改
```

## ⚠️ 注意事项

1. **提交前检查**: 确保代码能正常运行
2. **提交信息清晰**: 使用规范的提交信息格式
3. **分支管理**: 及时删除已合并的分支
4. **标签管理**: 重要版本都要打标签
5. **备份重要**: 定期推送到远程仓库

---

**记住**: 每次 `git push origin main` 都会自动触发 Vercel 部署！
