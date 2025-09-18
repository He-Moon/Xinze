@echo off
setlocal enabledelayedexpansion

REM 心则项目部署脚本 (Windows 版本)
REM 支持 Web 端和移动端的统一部署

echo 🚀 开始部署心则项目...

REM 检查环境
echo 📋 检查部署环境...

REM 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 未安装
    exit /b 1
)

REM 检查 npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm 未安装
    exit /b 1
)

REM 检查 Flutter (可选)
flutter --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Flutter 未安装，跳过移动端构建
    set FLUTTER_AVAILABLE=false
) else (
    echo ✅ Flutter 已安装
    set FLUTTER_AVAILABLE=true
)

echo ✅ 环境检查完成

REM 安装依赖
echo 📦 安装 Web 端依赖...
call npm ci --include=dev
if errorlevel 1 (
    echo ❌ 依赖安装失败
    exit /b 1
)
echo ✅ Web 端依赖安装完成

REM 构建 Web 端
echo 🔨 构建 Web 端...

REM 生成 Prisma 客户端
echo 生成 Prisma 客户端...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Prisma 生成失败
    exit /b 1
)

REM 构建 Next.js 应用
echo 构建 Next.js 应用...
call npm run build
if errorlevel 1 (
    echo ❌ Web 端构建失败
    exit /b 1
)

echo ✅ Web 端构建完成

REM 构建移动端
if "%FLUTTER_AVAILABLE%"=="true" (
    echo 📱 构建移动端...
    
    cd mobile_flutter
    
    REM 获取 Flutter 依赖
    echo 获取 Flutter 依赖...
    call flutter pub get
    if errorlevel 1 (
        echo ❌ Flutter 依赖获取失败
        cd ..
        exit /b 1
    )
    
    REM 构建 Android APK
    echo 构建 Android APK...
    call flutter build apk --release
    if errorlevel 1 (
        echo ❌ Android APK 构建失败
        cd ..
        exit /b 1
    )
    
    cd ..
    echo ✅ 移动端构建完成
) else (
    echo ⚠️  跳过移动端构建
)

REM 显示部署信息
echo.
echo 🎉 部署完成！
echo.
echo 📋 部署信息:
echo • Web 端: 已构建并准备部署
if "%FLUTTER_AVAILABLE%"=="true" (
    echo • 移动端: APK 已构建 (mobile_flutter\build\app\outputs\flutter-apk\)
)
echo.
echo 🔗 下一步:
echo 1. 将 Web 端部署到 Vercel 或其他平台
echo 2. 更新移动端的 API 配置为生产环境 URL
echo 3. 发布移动端应用到应用商店
echo.
echo 📝 环境变量配置:
echo 请确保在生产环境中配置以下环境变量:
echo • NEXT_PUBLIC_API_URL
echo • DATABASE_URL
echo • JWT_SECRET
echo • OPENAI_API_KEY
echo • PINECONE_API_KEY
echo.
echo 🎊 所有任务完成！

pause
