# 心则 - 智能任务管理工具

> 心之准则，行动之始

一个支持快速输入、AI分析和多平台访问的智能任务管理工具。

## ✨ 核心功能

- 🚀 **快速捕捉** - 文本、语音、链接快速输入
- 📅 **今日任务** - 智能排序的每日任务管理
- 🎯 **目标心则** - 个人目标和价值观管理
- 📊 **复盘洞见** - AI驱动的数据分析和洞察
- ⚙️ **个性化设置** - 自定义AI助手和界面

## 🛠️ 技术栈

- **前端**: Next.js 14 + TypeScript + Ant Design
- **后端**: Next.js API Routes + Prisma + PostgreSQL
- **AI**: OpenAI GPT-4 + 向量数据库
- **部署**: Vercel + Supabase

## 🚀 快速开始

```bash
# 1. 克隆项目
git clone <repository-url>
cd guanzhi

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local

# 4. 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 开始使用。

## 📚 文档

- [开发状态](DEV_STATUS.md) - 当前进度和任务
- [开发指南](docs/development.md) - 开发环境搭建
- [API文档](docs/api.md) - 接口文档
- [项目总结](PROJECT_SUMMARY.md) - 项目概述

## 📁 项目结构

```
src/
├── shared/             # 共享层 (Web + Mobile)
│   ├── types/         # 类型定义
│   ├── utils/         # 工具函数
│   ├── hooks/         # 自定义Hooks
│   ├── api/           # API客户端
│   └── services/      # 业务服务
├── platforms/          # 平台层 (Web/Mobile 特定实现)
│   ├── web/           # Web 平台组件和页面
│   └── mobile/        # 移动端组件和页面
├── app/                # Next.js 应用入口
│   ├── api/           # API 路由
│   ├── login/         # 登录页面
│   └── dashboard/     # 仪表板页面
├── components/         # 通用组件
└── lib/                # 工具函数和配置
```

## 🛠️ 开发命令

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
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
