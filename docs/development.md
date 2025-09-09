# 开发指南

## 环境要求

- Node.js 18+ 
- npm 或 yarn
- Git

## 开发环境搭建

### 1. 克隆项目

```bash
git clone <repository-url>
cd guanzhi
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境变量配置

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑环境变量
# 配置数据库连接、AI服务等
```

### 4. 数据库设置

```bash
# 生成 Prisma 客户端
npx prisma generate

# 运行数据库迁移
npx prisma db push

# 填充种子数据（可选）
npx prisma db seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 开发流程

### 代码结构

```
src/
├── shared/             # 共享层 - 业务逻辑、类型、工具
├── platforms/          # 平台层 - Web/Mobile 特定实现
│   ├── web/           # Web 平台组件和页面
│   └── mobile/        # 移动端组件和页面
├── app/                # Next.js App Router
│   ├── api/           # API 路由
│   ├── login/         # 登录页面
│   └── dashboard/     # 仪表板页面
├── components/         # 通用组件
└── lib/                # 工具函数和配置
```

### 开发规范

1. **组件开发**
   - 使用 TypeScript
   - 组件放在对应平台的 `components` 目录
   - 使用 CSS Modules 进行样式管理

2. **API 开发**
   - 使用 Next.js API Routes
   - 统一的响应格式
   - 错误处理

3. **状态管理**
   - 使用 React Context + useReducer
   - 全局状态放在 `shared/hooks`

4. **样式开发**
   - 使用设计令牌系统
   - 优先使用 Ant Design 组件
   - 自定义样式使用 CSS Modules

### 常用命令

```bash
# 开发
npm run dev                 # 启动开发服务器
npm run build              # 构建生产版本
npm run start              # 启动生产服务器

# 样式系统
npm run generate:styles    # 生成所有样式配置
npm run generate:css       # 生成 CSS 变量
npm run generate:antd      # 生成 Ant Design 主题

# 数据库
npx prisma studio          # 打开数据库管理界面
npx prisma db push         # 推送数据库变更
npx prisma generate        # 生成 Prisma 客户端

# 代码质量
npm run lint               # 代码检查
npm run type-check         # 类型检查
```

## 调试技巧

### 1. 开发工具

- **React DevTools** - 组件调试
- **Next.js DevTools** - 性能分析
- **Prisma Studio** - 数据库管理

### 2. 常见问题

- **样式不生效** - 检查 CSS Modules 导入
- **API 调用失败** - 检查网络请求和错误日志
- **类型错误** - 运行 `npm run type-check`

### 3. 性能优化

- 使用 React.memo 优化组件渲染
- 使用 useMemo 和 useCallback 优化计算
- 图片优化使用 Next.js Image 组件

## 测试

```bash
# 运行测试
npm run test

# 测试覆盖率
npm run test:coverage

# E2E 测试
npm run test:e2e
```

## 提交规范

使用 Conventional Commits 规范：

```bash
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

示例：
```bash
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复登录页面样式问题"
```
