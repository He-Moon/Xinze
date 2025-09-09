# 部署指南

## 部署方案

推荐使用 **Vercel + Supabase** 的组合，提供零配置部署和自动扩展。

## 环境准备

### 1. Vercel 部署

1. 注册 [Vercel](https://vercel.com) 账号
2. 连接 GitHub 仓库
3. 配置环境变量

### 2. Supabase 数据库

1. 注册 [Supabase](https://supabase.com) 账号
2. 创建新项目
3. 获取数据库连接信息

## 环境变量配置

### Vercel 环境变量

在 Vercel 项目设置中添加以下环境变量：

```bash
# 数据库
DATABASE_URL=postgresql://username:password@host:port/database

# JWT 密钥
JWT_SECRET=your_jwt_secret_key

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# 其他服务
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

### 本地环境变量

创建 `.env.local` 文件：

```bash
# 复制模板
cp .env.example .env.local

# 编辑配置
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
```

## 部署步骤

### 1. 数据库迁移

```bash
# 生成 Prisma 客户端
npx prisma generate

# 推送数据库模式
npx prisma db push

# 填充种子数据（可选）
npx prisma db seed
```

### 2. Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署到 Vercel
vercel

# 生产环境部署
vercel --prod
```

### 3. 域名配置

1. 在 Vercel 项目设置中添加自定义域名
2. 配置 DNS 记录指向 Vercel
3. 更新环境变量中的域名

## 监控和维护

### 1. 性能监控

- **Vercel Analytics** - 页面性能监控
- **Supabase Dashboard** - 数据库性能
- **OpenAI Usage** - AI 服务使用量

### 2. 日志查看

```bash
# Vercel 日志
vercel logs

# 实时日志
vercel logs --follow
```

### 3. 数据库备份

Supabase 自动提供：
- 每日自动备份
- 时间点恢复
- 数据导出功能

## 成本估算

### Vercel

- **Hobby Plan**: 免费
  - 100GB 带宽/月
  - 无限制静态部署
  - 基础分析

- **Pro Plan**: $20/月
  - 1TB 带宽/月
  - 高级分析
  - 优先支持

### Supabase

- **Free Tier**: 免费
  - 500MB 数据库
  - 2GB 带宽/月
  - 50,000 行/月

- **Pro Plan**: $25/月
  - 8GB 数据库
  - 250GB 带宽/月
  - 无限制行数

### OpenAI

- **GPT-4**: ~$0.03/1K tokens
- **GPT-3.5**: ~$0.002/1K tokens

**预估月成本**: $30-50 (小规模使用)

## 故障排除

### 常见问题

1. **构建失败**
   - 检查环境变量配置
   - 查看构建日志
   - 确认依赖版本

2. **数据库连接失败**
   - 验证 DATABASE_URL
   - 检查 Supabase 项目状态
   - 确认网络连接

3. **API 调用失败**
   - 检查 API 密钥
   - 验证请求格式
   - 查看错误日志

### 调试命令

```bash
# 本地调试
npm run dev

# 构建检查
npm run build

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

## 安全配置

### 1. 环境变量安全

- 不要在代码中硬编码敏感信息
- 使用 Vercel 环境变量管理
- 定期轮换 API 密钥

### 2. 数据库安全

- 启用 Row Level Security (RLS)
- 配置适当的访问权限
- 定期备份数据

### 3. API 安全

- 使用 HTTPS
- 实现请求频率限制
- 验证用户输入

## 扩展方案

### 1. 性能优化

- 启用 Vercel Edge Functions
- 使用 CDN 加速
- 实现缓存策略

### 2. 功能扩展

- 添加更多 AI 模型
- 集成第三方服务
- 实现实时功能

### 3. 监控增强

- 集成 Sentry 错误监控
- 添加用户行为分析
- 实现自定义指标
