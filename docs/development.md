# 开发指南

## 环境要求
- Node.js 18+
- npm 或 yarn

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local

# 3. 启动开发服务器
npm run dev
```

## 常用命令

```bash
npm run dev          # 开发服务器
npm run build        # 构建
npm run lint         # 代码检查
npm run type-check   # 类型检查
npx prisma studio    # 数据库管理
```

## 项目结构
```
src/
├── shared/          # 共享层
├── platforms/web/   # Web平台
├── app/             # Next.js应用
└── lib/             # 工具函数
```