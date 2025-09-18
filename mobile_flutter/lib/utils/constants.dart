import 'package:flutter/material.dart';

class AppConstants {
  static const String appName = '心则';
  static const String appVersion = '1.0.0';
  static const String appDescription = '心之准则，行动之始';
  static const String appPackageName = 'com.xinze.app';
  
  // API 配置 - 已移至 ApiConfig 类
  // static const String baseUrl = 'http://localhost:3000/api';
  // static const int requestTimeout = 30000; // 30秒
  
  // 存储键
  static const String authTokenKey = 'auth_token';
  static const String userInfoKey = 'user_info';
  static const String themeKey = 'theme_mode';
  static const String languageKey = 'language';
  
  // 分页配置
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;
  
  // 任务配置
  static const int maxTaskTitleLength = 200;
  static const int maxTaskDescriptionLength = 1000;
  static const int maxGoalTitleLength = 100;
  static const int maxGoalDescriptionLength = 500;
  static const int maxPrincipleContentLength = 1000;
}

class AppColors {
  // 主色调
  static const Color primary = Color(0xFF1890FF);
  static const Color primaryLight = Color(0xFF40A9FF);
  static const Color primaryDark = Color(0xFF096DD9);
  
  // 辅助色
  static const Color success = Color(0xFF52C41A);
  static const Color warning = Color(0xFFFAAD14);
  static const Color error = Color(0xFFF5222D);
  static const Color info = Color(0xFF1890FF);
  
  // 中性色
  static const Color textPrimary = Color(0xFF262626);
  static const Color textSecondary = Color(0xFF595959);
  static const Color textTertiary = Color(0xFF8C8C8C);
  static const Color textQuaternary = Color(0xFFBFBFBF);
  
  // 背景色
  static const Color backgroundPrimary = Color(0xFFFFFFFF);
  static const Color backgroundSecondary = Color(0xFFFAFAFA);
  static const Color backgroundTertiary = Color(0xFFF5F5F5);
  
  // 边框色
  static const Color borderPrimary = Color(0xFFD9D9D9);
  static const Color borderSecondary = Color(0xFFE8E8E8);
  static const Color borderTertiary = Color(0xFFF0F0F0);
  
  // 任务状态色
  static const Color taskPending = Color(0xFFFAAD14);
  static const Color taskInProgress = Color(0xFF1890FF);
  static const Color taskCompleted = Color(0xFF52C41A);
  
  // 优先级色
  static const Color priorityLow = Color(0xFF52C41A);
  static const Color priorityMedium = Color(0xFFFAAD14);
  static const Color priorityHigh = Color(0xFFF5222D);
}

class AppSizes {
  // 间距
  static const double spacingXS = 4.0;
  static const double spacingSM = 8.0;
  static const double spacingMD = 16.0;
  static const double spacingLG = 24.0;
  static const double spacingXL = 32.0;
  static const double spacingXXL = 48.0;
  
  // 圆角
  static const double radiusXS = 2.0;
  static const double radiusSM = 4.0;
  static const double radiusMD = 8.0;
  static const double radiusLG = 12.0;
  static const double radiusXL = 16.0;
  static const double radiusXXL = 24.0;
  
  // 字体大小
  static const double fontSizeXS = 10.0;
  static const double fontSizeSM = 12.0;
  static const double fontSizeMD = 14.0;
  static const double fontSizeLG = 16.0;
  static const double fontSizeXL = 18.0;
  static const double fontSizeXXL = 20.0;
  static const double fontSizeXXXL = 24.0;
  
  // 图标大小
  static const double iconSizeXS = 12.0;
  static const double iconSizeSM = 16.0;
  static const double iconSizeMD = 20.0;
  static const double iconSizeLG = 24.0;
  static const double iconSizeXL = 32.0;
  static const double iconSizeXXL = 48.0;
}

class AppDurations {
  static const Duration fast = Duration(milliseconds: 150);
  static const Duration normal = Duration(milliseconds: 300);
  static const Duration slow = Duration(milliseconds: 500);
  static const Duration verySlow = Duration(milliseconds: 800);
}

class AppAnimations {
  static const Curve defaultCurve = Curves.easeInOut;
  static const Curve fastCurve = Curves.easeOut;
  static const Curve slowCurve = Curves.easeIn;
}


