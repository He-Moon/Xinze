@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 智能任务管理工具 - 快速启动
echo ================================

REM 检查Node.js版本
echo 📋 检查Node.js版本...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 未安装，请先安装 Node.js 18+
    pause
    exit /b 1
)

for /f "tokens=1 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:v=%
if %NODE_VERSION% LSS 18 (
    echo ❌ Node.js 版本过低，需要 18+，当前版本: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js 版本检查通过: 
node --version

REM 检查依赖
echo 📦 检查依赖...
if not exist "package.json" (
    echo ❌ package.json 不存在，请先运行 node setup-project.js
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo 📥 安装依赖...
    npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
) else (
    echo ✅ 依赖已安装
)

REM 检查环境变量
echo 🔧 检查环境变量...
if not exist ".env.local" (
    if exist ".env.example" (
        echo 📋 复制环境变量模板...
        copy .env.example .env.local >nul
        echo ⚠️  请编辑 .env.local 文件配置你的环境变量
    ) else (
        echo ❌ .env.example 不存在
        pause
        exit /b 1
    )
) else (
    echo ✅ 环境变量文件存在
)

REM 检查数据库
echo 🗄️ 检查数据库...
echo ⚠️  请确保 PostgreSQL 和 Redis 服务正在运行
echo    PostgreSQL: 检查服务是否启动
echo    Redis: 检查服务是否启动

REM 询问是否初始化数据库
set /p INIT_DB="是否初始化数据库？(y/N): "
if /i "%INIT_DB%"=="y" (
    echo 🗄️ 初始化数据库...
    
    echo 📦 生成 Prisma 客户端...
    npx prisma generate
    if errorlevel 1 (
        echo ❌ Prisma 客户端生成失败
        pause
        exit /b 1
    )
    
    echo 📤 推送数据库模式...
    npx prisma db push
    if errorlevel 1 (
        echo ❌ 数据库模式推送失败
        pause
        exit /b 1
    )
    
    echo ✅ 数据库初始化完成
)

REM 启动开发服务器
echo 🚀 启动开发服务器...
echo    访问地址: http://localhost:3000
echo    按 Ctrl+C 停止服务器
echo.

npm run dev

pause
