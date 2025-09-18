#!/bin/bash

# 心则项目部署脚本
# 支持 Web 端和移动端的统一部署

set -e

echo "🚀 开始部署心则项目..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查环境
check_environment() {
    echo -e "${BLUE}📋 检查部署环境...${NC}"
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安装${NC}"
        exit 1
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm 未安装${NC}"
        exit 1
    fi
    
    # 检查 Flutter (可选)
    if command -v flutter &> /dev/null; then
        echo -e "${GREEN}✅ Flutter 已安装${NC}"
        FLUTTER_AVAILABLE=true
    else
        echo -e "${YELLOW}⚠️  Flutter 未安装，跳过移动端构建${NC}"
        FLUTTER_AVAILABLE=false
    fi
    
    echo -e "${GREEN}✅ 环境检查完成${NC}"
}

# 安装依赖
install_dependencies() {
    echo -e "${BLUE}📦 安装 Web 端依赖...${NC}"
    npm ci --include=dev
    echo -e "${GREEN}✅ Web 端依赖安装完成${NC}"
}

# 构建 Web 端
build_web() {
    echo -e "${BLUE}🔨 构建 Web 端...${NC}"
    
    # 生成 Prisma 客户端
    echo "生成 Prisma 客户端..."
    npx prisma generate
    
    # 构建 Next.js 应用
    echo "构建 Next.js 应用..."
    npm run build
    
    echo -e "${GREEN}✅ Web 端构建完成${NC}"
}

# 构建移动端
build_mobile() {
    if [ "$FLUTTER_AVAILABLE" = true ]; then
        echo -e "${BLUE}📱 构建移动端...${NC}"
        
        cd mobile_flutter
        
        # 获取 Flutter 依赖
        echo "获取 Flutter 依赖..."
        flutter pub get
        
        # 构建 Android APK
        echo "构建 Android APK..."
        flutter build apk --release
        
        # 构建 iOS (仅在 macOS 上)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            echo "构建 iOS..."
            flutter build ios --release --no-codesign
        fi
        
        cd ..
        echo -e "${GREEN}✅ 移动端构建完成${NC}"
    else
        echo -e "${YELLOW}⚠️  跳过移动端构建${NC}"
    fi
}

# 部署到 Vercel
deploy_vercel() {
    echo -e "${BLUE}🌐 部署到 Vercel...${NC}"
    
    # 检查是否安装了 Vercel CLI
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}⚠️  Vercel CLI 未安装，请手动部署${NC}"
        echo "安装命令: npm i -g vercel"
        return
    fi
    
    # 部署
    vercel --prod
    
    echo -e "${GREEN}✅ 部署完成${NC}"
}

# 显示部署信息
show_deployment_info() {
    echo -e "${GREEN}🎉 部署完成！${NC}"
    echo ""
    echo -e "${BLUE}📋 部署信息:${NC}"
    echo "• Web 端: 已构建并准备部署"
    if [ "$FLUTTER_AVAILABLE" = true ]; then
        echo "• 移动端: APK 已构建 (mobile_flutter/build/app/outputs/flutter-apk/)"
    fi
    echo ""
    echo -e "${BLUE}🔗 下一步:${NC}"
    echo "1. 将 Web 端部署到 Vercel 或其他平台"
    echo "2. 更新移动端的 API 配置为生产环境 URL"
    echo "3. 发布移动端应用到应用商店"
    echo ""
    echo -e "${BLUE}📝 环境变量配置:${NC}"
    echo "请确保在生产环境中配置以下环境变量:"
    echo "• NEXT_PUBLIC_API_URL"
    echo "• DATABASE_URL"
    echo "• JWT_SECRET"
    echo "• OPENAI_API_KEY"
    echo "• PINECONE_API_KEY"
}

# 主函数
main() {
    echo -e "${GREEN}🌟 心则项目部署脚本${NC}"
    echo "================================"
    
    check_environment
    install_dependencies
    build_web
    build_mobile
    show_deployment_info
    
    echo -e "${GREEN}🎊 所有任务完成！${NC}"
}

# 运行主函数
main "$@"
