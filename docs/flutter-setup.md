# Flutter 移动端开发环境搭建

## 环境要求
- Windows 10/11
- Android Studio
- Flutter SDK

## 安装步骤

### 1. 安装 Flutter SDK

```bash
# 下载 Flutter SDK
# 访问 https://flutter.dev/docs/get-started/install/windows
# 下载最新版本的 Flutter SDK

# 解压到 C:\flutter
# 将 C:\flutter\bin 添加到系统 PATH 环境变量
```

### 2. 验证安装

```bash
flutter doctor
```

### 3. 安装 Android Studio

```bash
# 下载并安装 Android Studio
# 访问 https://developer.android.com/studio
# 安装时选择 Android SDK、Android SDK Platform-Tools、Android SDK Build-Tools
```

### 4. 配置 Android 设备

```bash
# 启用开发者选项和 USB 调试
# 连接 Android 设备或启动模拟器
flutter devices
```

### 5. 创建 Flutter 项目

```bash
# 在项目根目录执行
flutter create mobile_flutter --platforms android,ios,web
cd mobile_flutter
flutter pub get
```

## 项目结构

```
mobile_flutter/
├── lib/
│   ├── main.dart                 # 应用入口
│   ├── models/                   # 数据模型
│   │   ├── user.dart
│   │   ├── task.dart
│   │   ├── goal.dart
│   │   └── principle.dart
│   ├── services/                 # API 服务
│   │   ├── auth_service.dart
│   │   ├── task_service.dart
│   │   ├── goal_service.dart
│   │   └── api_client.dart
│   ├── providers/                # 状态管理
│   │   ├── auth_provider.dart
│   │   ├── task_provider.dart
│   │   └── goal_provider.dart
│   ├── screens/                  # 页面
│   │   ├── login_screen.dart
│   │   ├── dashboard_screen.dart
│   │   ├── quick_capture_screen.dart
│   │   └── settings_screen.dart
│   ├── widgets/                  # 组件
│   │   ├── quick_capture_widget.dart
│   │   ├── today_view_widget.dart
│   │   ├── goals_principles_widget.dart
│   │   └── review_insights_widget.dart
│   └── utils/                    # 工具函数
│       ├── constants.dart
│       ├── theme.dart
│       └── helpers.dart
├── android/                      # Android 配置
├── ios/                          # iOS 配置
├── web/                          # Web 配置
└── pubspec.yaml                  # 依赖配置
```

## 开发命令

```bash
# 开发模式运行
flutter run

# 构建 APK
flutter build apk

# 构建 iOS
flutter build ios

# 构建 Web
flutter build web

# 热重载
r

# 热重启
R
```

## 依赖包

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0                    # HTTP 请求
  provider: ^6.1.1                # 状态管理
  shared_preferences: ^2.2.2      # 本地存储
  intl: ^0.19.0                   # 日期格式化
  cupertino_icons: ^1.0.6         # iOS 图标
  material_design_icons_flutter: ^7.0.7296  # Material 图标
```

## 下一步

1. 安装 Flutter SDK
2. 配置开发环境
3. 创建 Flutter 项目
4. 开始迁移共享层代码
