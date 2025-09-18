# 心则项目部署指南

## 🚀 快速开始

### 自动部署 (推荐方式)

**你的原有部署方式完全不变：**
```bash
git push origin main  # 自动触发 Vercel 部署！
```

**新增的部署选项：**
```bash
# 手动部署 Web 端
npm run deploy:web

# 构建移动端
npm run deploy:mobile

# 完整部署脚本 (可选)
scripts\deploy.bat      # Windows
./scripts/deploy.sh     # Linux/macOS
```

## 📋 部署方案

### 技术架构
- **Web 端**: Next.js + Vercel (自动部署，全球CDN)
- **移动端**: Flutter (Android/iOS/鸿蒙)
- **后端**: Next.js API Routes (共享)
- **数据库**: Supabase PostgreSQL + pgvector
- **AI服务**: OpenAI GPT-4 + 向量嵌入

### 部署架构
```
用户 → Vercel CDN → Next.js 应用 → Supabase 数据库
                ↓
移动端 App → 直接调用 → 同一个 API 服务器
                ↓
            OpenAI API (AI 分析)
```

## 🔧 环境配置

### 1. 注册账号和获取密钥

#### Supabase 配置
1. 访问 https://supabase.com
2. 创建新项目：
   - 项目名称：`xinze`
   - 数据库密码：设置强密码
   - 地区：选择最近的地区
3. 获取信息：
   - **Project URL** (类似：`https://xxx.supabase.co`)
   - **anon public key** (Settings > API)
   - **service_role key** (Settings > API)

#### OpenAI 配置
1. 访问 https://platform.openai.com
2. 创建 API Key (以 `sk-` 开头)
3. 配置使用额度（建议 $10-20 限额）

#### Vercel 配置
1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 连接你的 GitHub 仓库

### 2. 环境变量配置

#### 本地开发环境
创建 `.env.local` 文件：

```bash
# 应用配置
NEXT_PUBLIC_APP_NAME=心则
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_DESCRIPTION=心之准则，行动之始

# API 配置
NEXT_PUBLIC_API_URL=/api
# 生产环境示例: https://xinze-app.vercel.app/api

# 数据库配置
DATABASE_URL=file:./dev.db
# 生产环境示例: postgresql://username:password@localhost:5432/xinze

# Supabase 配置 (生产环境)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# AI 配置
OPENAI_API_KEY=your-openai-api-key-here
PINECONE_API_KEY=your-pinecone-api-key-here
PINECONE_ENVIRONMENT=your-pinecone-environment

# Redis 配置 (可选)
REDIS_URL=redis://localhost:6379

# 开发配置
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

#### Vercel 生产环境
在 Vercel 项目设置中添加环境变量：

```bash
# 数据库
DATABASE_URL=postgresql://username:password@host:port/database

# JWT 密钥
JWT_SECRET=your_jwt_secret_key

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# 应用配置
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret

# 其他服务
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_environment
```

## 🚀 部署步骤

### 第一步：本地环境准备

```bash
# 1. 克隆项目
git clone [your-repo-url]
cd xinze

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp env.example .env.local
# 编辑 .env.local 填入配置

# 4. 生成 Prisma 客户端
npx prisma generate

# 5. 推送数据库 schema
npx prisma db push

# 6. 运行种子数据（可选）
npx prisma db seed

# 7. 测试本地运行
npm run dev
```

### 第二步：Vercel 自动部署

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

### 第三步：移动端配置

#### 更新移动端 API 配置
部署完成后，更新 `mobile_flutter/lib/config/api_config.dart`：

```dart
static const String _prodBaseUrl = 'https://your-domain.vercel.app/api';
```

#### 构建移动端应用

```bash
# 进入移动端目录
cd mobile_flutter

# 获取依赖
flutter pub get

# 构建 Android APK
flutter build apk --release

# 构建 iOS (仅 macOS)
flutter build ios --release --no-codesign
```

## 🔧 配置说明

### API 配置统一管理

#### Web 端配置
- **文件**: `src/shared/config/api.ts`
- **开发环境**: `/api` (相对路径)
- **生产环境**: `https://your-domain.vercel.app/api`

#### 移动端配置
- **文件**: `mobile_flutter/lib/config/api_config.dart`
- **开发环境**: `http://localhost:3000/api`
- **生产环境**: `https://your-domain.vercel.app/api`

### CORS 配置
已配置支持移动端访问：

```javascript
// next.config.js
headers: [
  {
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: '*' },
      { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
      { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-Requested-With' },
      { key: 'Access-Control-Allow-Credentials', value: 'true' },
    ],
  },
]
```

## 📱 移动端发布

### Android 发布
1. 构建发布版本：
```bash
cd mobile_flutter
flutter build apk --release
```

2. 签名 APK (可选)：
```bash
flutter build apk --release --split-per-abi
```

3. 上传到 Google Play Console

### iOS 发布
1. 构建 iOS 应用：
```bash
flutter build ios --release
```

2. 使用 Xcode 打开项目：
```bash
open ios/Runner.xcworkspace
```

3. 在 Xcode 中配置签名和发布

## 💰 成本估算

### 免费额度
- **Vercel**: 100GB 带宽/月
- **Supabase**: 500MB 数据库，50MB 文件存储
- **OpenAI**: 按使用量付费

### 预估成本
- **初期**: $0-10/月 (免费额度内)
- **用户增长**: $20-50/月 (取决于 AI 使用量)

## 🐛 故障排除

### 常见问题

1. **API 连接失败**
   - 检查环境变量配置
   - 确认 CORS 设置
   - 验证网络连接

2. **移动端构建失败**
   - 检查 Flutter 版本
   - 确认依赖安装
   - 查看构建日志

3. **数据库连接问题**
   - 验证 DATABASE_URL
   - 检查数据库服务状态
   - 确认 Prisma 配置

4. **部署失败**
   - 检查环境变量是否完整
   - 查看 Vercel 构建日志
   - 确认所有依赖版本

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

# Vercel 日志
vercel logs

# 实时日志
vercel logs --follow
```

## 📊 监控和维护

### 性能监控
- **Vercel Analytics** - 页面性能监控
- **Supabase Dashboard** - 数据库性能
- **OpenAI Usage** - AI 服务使用量

### 数据库备份
Supabase 自动提供：
- 每日自动备份
- 时间点恢复
- 数据导出功能

## 🔒 安全配置

### 环境变量安全
- 不要在代码中硬编码敏感信息
- 使用 Vercel 环境变量管理
- 定期轮换 API 密钥

### 数据库安全
- 启用 Row Level Security (RLS)
- 配置适当的访问权限
- 定期备份数据

### API 安全
- 使用 HTTPS
- 实现请求频率限制
- 验证用户输入

## ✅ 部署检查清单

- [ ] Supabase 项目创建完成
- [ ] OpenAI API Key 获取
- [ ] Vercel 账号注册并连接 GitHub
- [ ] 环境变量配置完成
- [ ] 本地测试通过
- [ ] Vercel 部署成功
- [ ] 生产环境测试通过
- [ ] 移动端 API 配置更新
- [ ] 移动端构建成功
- [ ] 域名配置（可选）

## 🎯 总结

**你的原有工作流程完全不变：**
```bash
git push origin main  # 依然自动部署 Web 端！
```

**新增的功能：**
- 移动端可以访问同一个 API
- 配置更规范，支持多环境
- 提供了额外的部署选项（可选使用）
- 统一的 API 配置管理
- 完善的 CORS 支持

**部署方式：**
- **Web 端**: `git push` 自动部署到 Vercel
- **移动端**: 手动构建和发布到应用商店
- **API**: Web 端和移动端共享同一个后端

---

**部署完成后，记得更新移动端的 API 配置为生产环境 URL！**