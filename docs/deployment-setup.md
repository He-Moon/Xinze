# 心则项目部署配置指南

## 🎯 部署目标

**技术方案：Vercel + Supabase + OpenAI**
- **前端部署**：Vercel (自动部署，全球CDN)
- **数据库**：Supabase PostgreSQL + pgvector (向量搜索)
- **AI服务**：OpenAI GPT-4 + 向量嵌入
- **功能**：完整的任务管理 + AI分析 + 语义搜索

## 📋 准备工作清单

### 第一步：注册账号和获取密钥

#### 1. Supabase 配置
1. 访问 https://supabase.com
2. 点击 "Start your project" 注册账号
3. 创建新项目：
   - 项目名称：`guanzhi` 或你喜欢的名字
   - 数据库密码：设置一个强密码（记住它）
   - 地区：选择离你最近的地区
4. 等待项目创建完成（大约2分钟）
5. 获取以下信息：
   - **Project URL** (类似：`https://xxx.supabase.co`)
   - **anon public key** (在 Settings > API 中)
   - **service_role key** (在 Settings > API 中)

#### 2. OpenAI 配置
1. 访问 https://platform.openai.com
2. 注册/登录账号
3. 在 API Keys 页面创建新的 API Key
4. 复制 API Key (以 `sk-` 开头)
5. 配置使用额度（建议先设置 $10-20 的限额）

#### 3. Vercel 配置
1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 连接你的 GitHub 仓库

### 第二步：配置 Supabase 数据库

在 Supabase 项目中：
1. 进入 **SQL Editor**
2. 运行以下 SQL 启用 pgvector 扩展：

```sql
-- 启用 pgvector 扩展
CREATE EXTENSION IF NOT EXISTS vector;
```

### 第三步：环境变量配置

创建 `.env.local` 文件（在项目根目录）：

```bash
# 数据库配置 (从 Supabase 获取)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# OpenAI 配置
OPENAI_API_KEY="sk-[YOUR-OPENAI-KEY]"

# JWT 配置 (生成一个随机字符串)
JWT_SECRET="your-random-jwt-secret-here"

# 应用配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-nextauth-secret-here"

# 开发环境
NODE_ENV="development"
```

## 🚀 部署步骤

### 第一步：本地环境准备

```bash
# 1. 克隆项目
git clone [your-repo-url]
cd guanzhi

# 2. 安装依赖
npm install

# 3. 配置环境变量
# 创建 .env.local 文件，填入上面的配置

# 4. 生成 Prisma 客户端
npx prisma generate

# 5. 推送数据库 schema
npx prisma db push

# 6. 运行种子数据（可选）
npx prisma db seed

# 7. 测试本地运行
npm run dev
```

### 第二步：Vercel 部署

1. **连接 GitHub 仓库**
   - 在 Vercel 控制台点击 "New Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

2. **配置环境变量**
   - 在项目设置中添加所有环境变量
   - 重要：将 `NEXTAUTH_URL` 改为你的 Vercel 域名

3. **自动部署**
   - 每次 `git push` 都会自动部署
   - 部署完成后会获得一个 `.vercel.app` 域名

### 第三步：配置生产环境

1. **更新环境变量**
   ```bash
   # 在 Vercel 中更新
   NEXTAUTH_URL="https://your-project.vercel.app"
   ```

2. **测试部署**
   - 访问你的 Vercel 域名
   - 测试注册/登录功能
   - 测试快速捕捉功能

## 🔧 技术架构

### 数据库设计
- **PostgreSQL** - 主数据库
- **pgvector** - 向量搜索扩展
- **向量嵌入** - OpenAI text-embedding-ada-002

### AI 功能
- **任务分析** - GPT-4 分析任务优先级、时间估算
- **目标关联** - 向量搜索匹配任务与目标
- **智能排序** - 基于用户行为的任务排序
- **语义搜索** - 基于向量的内容搜索

### 部署架构
```
用户 → Vercel CDN → Next.js 应用 → Supabase 数据库
                ↓
            OpenAI API (AI 分析)
```

## 💰 成本估算

### 免费额度
- **Vercel** - 100GB 带宽/月
- **Supabase** - 500MB 数据库，50MB 文件存储
- **OpenAI** - 按使用量付费

### 预估成本
- **初期** - $0-10/月 (免费额度内)
- **用户增长** - $20-50/月 (取决于 AI 使用量)

## 🐛 常见问题

### 1. 数据库连接失败
- 检查 `DATABASE_URL` 是否正确
- 确认 Supabase 项目状态正常

### 2. OpenAI API 调用失败
- 检查 `OPENAI_API_KEY` 是否正确
- 确认 API 额度充足

### 3. 部署失败
- 检查环境变量是否完整
- 查看 Vercel 构建日志

## 📞 技术支持

如果遇到问题：
1. 查看 Vercel 构建日志
2. 检查 Supabase 数据库日志
3. 确认所有环境变量配置正确

## ✅ 部署完成检查清单

- [ ] Supabase 项目创建完成
- [ ] OpenAI API Key 获取
- [ ] Vercel 账号注册并连接 GitHub
- [ ] 环境变量配置完成
- [ ] 本地测试通过
- [ ] Vercel 部署成功
- [ ] 生产环境测试通过
- [ ] 域名配置（可选）

---

**注意**：这个配置支持完整的 AI 功能和向量搜索，可以处理任务分析、目标关联等核心功能。
