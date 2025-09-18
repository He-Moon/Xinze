# 开发指南

## 环境要求
- Node.js 18+
- npm 或 yarn

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp env.example .env.local

# 3. 设置数据库
npm run db:generate    # 生成 Prisma 客户端
npm run db:push        # 创建数据库表
npm run db:seed        # 添加测试数据（可选）

# 4. 启动开发服务器
npm run dev
```

## 常用命令

```bash
# 开发
npm run dev          # 开发服务器
npm run build        # 构建
npm run lint         # 代码检查

# 数据库
npm run db:generate  # 生成 Prisma 客户端
npm run db:push      # 推送数据库变更
npm run db:seed      # 添加种子数据
npm run db:studio    # 打开数据库管理界面
```

## 项目结构
```
src/
├── shared/          # 共享层
├── platforms/web/   # Web平台
├── app/             # Next.js应用
└── lib/             # 工具函数
```