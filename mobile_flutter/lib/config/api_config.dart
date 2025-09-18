// 统一的 API 配置
class ApiConfig {
  // 环境检测
  static const bool isDevelopment = bool.fromEnvironment('dart.vm.product') == false;
  static const bool isProduction = bool.fromEnvironment('dart.vm.product') == true;
  
  // API 基础 URL
  static const String _devBaseUrl = 'http://localhost:3000/api';
  static const String _prodBaseUrl = 'https://xinze-app.vercel.app/api';
  
  // 获取当前环境的 API URL
  static String get baseUrl {
    if (isDevelopment) {
      return _devBaseUrl;
    }
    return _prodBaseUrl;
  }
  
  // 请求超时时间
  static const int timeout = 30000;
  
  // 重试配置
  static const int maxRetries = 3;
  static const int retryDelay = 1000;
  
  // 请求头配置
  static const Map<String, String> defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // 获取完整的 API URL
  static String getApiUrl(String endpoint) {
    final cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
    final cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/$endpoint';
    return '$cleanBaseUrl$cleanEndpoint';
  }
  
  // 调试信息
  static Map<String, dynamic> get debugInfo => {
    'baseUrl': baseUrl,
    'isDevelopment': isDevelopment,
    'isProduction': isProduction,
    'timeout': timeout,
  };
}
