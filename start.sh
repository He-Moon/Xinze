#!/bin/bash

# 智能任务管理工具 - 快速启动脚本
# 使用方法: ./start.sh

set -e

echo "🚀 智能任务管理工具 - 快速启动"
echo "================================"

# 检查Node.js版本
check_node() {
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js 未安装，请先安装 Node.js 18+"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo "❌ Node.js 版本过低，需要 18+，当前版本: $(node -v)"
        exit 1
    fi
    
    echo "✅ Node.js 版本检查通过: $(node -v)"
}

# 检查依赖
check_dependencies() {
    echo "📦 检查依赖..."
    
    if [ ! -f "package.json" ]; then
        echo "❌ package.json 不存在，请先运行 node setup-project.js"
        exit 1
    fi
    
    if [ ! -d "node_modules" ]; then
        echo "📥 安装依赖..."
        npm install
    else
        echo "✅ 依赖已安装"
    fi
}

# 检查环境变量
check_env() {
    echo "🔧 检查环境变量..."
    
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            echo "📋 复制环境变量模板..."
            cp .env.example .env.local
            echo "⚠️  请编辑 .env.local 文件配置你的环境变量"
        else
            echo "❌ .env.example 不存在"
            exit 1
        fi
    else
        echo "✅ 环境变量文件存在"
    fi
}

# 检查数据库
check_database() {
    echo "🗄️ 检查数据库..."
    
    # 检查PostgreSQL是否运行
    if ! pg_isready -q; then
        echo "⚠️  PostgreSQL 未运行，请启动 PostgreSQL 服务"
        echo "   Ubuntu/Debian: sudo systemctl start postgresql"
        echo "   macOS: brew services start postgresql"
        echo "   Windows: 启动 PostgreSQL 服务"
    else
        echo "✅ PostgreSQL 运行正常"
    fi
    
    # 检查Redis是否运行
    if ! redis-cli ping &> /dev/null; then
        echo "⚠️  Redis 未运行，请启动 Redis 服务"
        echo "   Ubuntu/Debian: sudo systemctl start redis-server"
        echo "   macOS: brew services start redis"
        echo "   Windows: 启动 Redis 服务"
    else
        echo "✅ Redis 运行正常"
    fi
}

# 初始化数据库
init_database() {
    echo "🗄️ 初始化数据库..."
    
    # 生成Prisma客户端
    echo "📦 生成 Prisma 客户端..."
    npx prisma generate
    
    # 推送数据库模式
    echo "📤 推送数据库模式..."
    npx prisma db push
    
    echo "✅ 数据库初始化完成"
}

# 启动开发服务器
start_dev() {
    echo "🚀 启动开发服务器..."
    echo "   访问地址: http://localhost:3000"
    echo "   按 Ctrl+C 停止服务器"
    echo ""
    
    npm run dev
}

# 主函数
main() {
    check_node
    check_dependencies
    check_env
    check_database
    
    # 询问是否初始化数据库
    read -p "是否初始化数据库？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        init_database
    fi
    
    start_dev
}

# 运行主函数
main
