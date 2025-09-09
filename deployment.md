# 部署指南

## 部署方案对比

| 方案 | 成本 | 复杂度 | 性能 | 推荐度 |
|------|------|--------|------|--------|
| Vercel + Supabase | 低 | 低 | 高 | ⭐⭐⭐⭐⭐ |
| Docker + VPS | 中 | 中 | 高 | ⭐⭐⭐⭐ |
| 自建服务器 | 高 | 高 | 高 | ⭐⭐⭐ |

## 方案1：Vercel + Supabase（推荐）

### 优势
- 零配置部署
- 自动HTTPS
- 全球CDN
- 自动扩展
- 免费额度充足

### 部署步骤

#### 1. 准备环境
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login
```

#### 2. 创建Supabase项目
1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 获取数据库URL和API密钥
4. 在SQL编辑器中运行以下脚本：

```sql
-- 创建用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建目标表
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建价值观表
CREATE TABLE values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  weight INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建任务表
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'task', -- task, idea, link
  content TEXT, -- 任务内容、想法内容、链接URL
  priority INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending',
  ai_analysis JSONB, -- AI分析结果
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_type ON tasks(type);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_values_user_id ON values(user_id);
```

#### 3. 配置环境变量
在Vercel项目设置中添加：

```env
# 数据库
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
SUPABASE_URL="https://[project-ref].supabase.co"
SUPABASE_ANON_KEY="[anon-key]"
SUPABASE_SERVICE_ROLE_KEY="[service-role-key]"

# 认证
NEXTAUTH_SECRET="[生成32位随机字符串]"
NEXTAUTH_URL="https://your-domain.vercel.app"

# AI服务
OPENAI_API_KEY="sk-..."
PINECONE_API_KEY="..."
PINECONE_ENVIRONMENT="..."

# Redis (使用Upstash)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# 其他
NODE_ENV="production"
```

#### 4. 部署到Vercel
```bash
# 在项目根目录
vercel

# 或使用GitHub集成
# 1. 在Vercel中导入GitHub仓库
# 2. 配置环境变量
# 3. 自动部署
```

### 配置自定义域名
1. 在Vercel项目设置中添加域名
2. 配置DNS记录
3. 等待SSL证书自动生成

## 方案2：Docker部署

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 构建应用
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行应用
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/guanzhi
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_SECRET=your-secret
      - OPENAI_API_KEY=your-openai-key
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=guanzhi
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### 部署命令
```bash
# 构建和启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 更新应用
docker-compose pull
docker-compose up -d

# 停止服务
docker-compose down
```

## 方案3：自建服务器部署

### 服务器配置
- **系统**：Ubuntu 20.04 LTS
- **CPU**：2核心
- **内存**：4GB
- **存储**：20GB SSD
- **网络**：公网IP

### 安装步骤

#### 1. 系统更新
```bash
sudo apt update && sudo apt upgrade -y
```

#### 2. 安装Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 3. 安装PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 创建数据库和用户
sudo -u postgres psql
CREATE DATABASE guanzhi;
CREATE USER guanzhi_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE guanzhi TO guanzhi_user;
\q
```

#### 4. 安装Redis
```bash
sudo apt install redis-server -y
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

#### 5. 安装Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 6. 安装PM2
```bash
sudo npm install -g pm2
```

#### 7. 部署应用
```bash
# 克隆代码
git clone <repository-url>
cd guanzhi

# 安装依赖
npm install

# 构建应用
npm run build

# 启动应用
pm2 start npm --name "guanzhi" -- start
pm2 save
pm2 startup
```

#### 8. 配置Nginx
```bash
sudo nano /etc/nginx/sites-available/guanzhi
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/guanzhi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 9. 配置SSL证书
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取SSL证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

## 监控和维护

### 日志管理
```bash
# 查看应用日志
pm2 logs guanzhi

# 查看Nginx日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 查看系统日志
sudo journalctl -u nginx
```

### 性能监控
```bash
# 安装监控工具
sudo apt install htop iotop nethogs -y

# 查看系统资源
htop
iotop
nethogs
```

### 备份策略
```bash
# 数据库备份
pg_dump -h localhost -U guanzhi_user guanzhi > backup_$(date +%Y%m%d).sql

# 应用备份
tar -czf app_backup_$(date +%Y%m%d).tar.gz /path/to/guanzhi

# 自动备份脚本
#!/bin/bash
BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d)
pg_dump -h localhost -U guanzhi_user guanzhi > $BACKUP_DIR/db_$DATE.sql
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /path/to/guanzhi
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

## 故障排除

### 常见问题

#### 1. 应用无法启动
```bash
# 检查端口占用
sudo netstat -tlnp | grep :3000

# 检查PM2状态
pm2 status
pm2 logs guanzhi
```

#### 2. 数据库连接失败
```bash
# 检查PostgreSQL状态
sudo systemctl status postgresql

# 检查连接
psql -h localhost -U guanzhi_user -d guanzhi
```

#### 3. Redis连接失败
```bash
# 检查Redis状态
sudo systemctl status redis-server

# 测试连接
redis-cli ping
```

#### 4. Nginx配置错误
```bash
# 测试配置
sudo nginx -t

# 重新加载配置
sudo systemctl reload nginx
```

## 安全建议

### 1. 防火墙配置
```bash
# 安装UFW
sudo apt install ufw -y

# 配置规则
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. 定期更新
```bash
# 系统更新
sudo apt update && sudo apt upgrade -y

# 应用更新
cd /path/to/guanzhi
git pull
npm install
npm run build
pm2 restart guanzhi
```

### 3. 监控安全
- 安装Fail2ban防止暴力攻击
- 配置日志监控
- 定期检查系统安全

## 成本估算

### Vercel + Supabase方案
- **Vercel**：免费额度充足，超出后按使用量付费
- **Supabase**：免费额度500MB，超出后$25/月
- **OpenAI API**：按使用量付费，约$0.002/1K tokens
- **总计**：初期免费，后期约$30-50/月

### Docker + VPS方案
- **VPS**：$5-20/月
- **域名**：$10-15/年
- **SSL证书**：免费（Let's Encrypt）
- **总计**：约$5-20/月

### 自建服务器方案
- **服务器**：$20-50/月
- **域名**：$10-15/年
- **维护成本**：时间成本
- **总计**：约$20-50/月 + 维护时间
