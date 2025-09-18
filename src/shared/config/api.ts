// 统一的 API 配置
export const API_CONFIG = {
  // 基础 URL - 根据环境自动切换
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  
  // 请求超时时间
  timeout: 30000,
  
  // 重试配置
  retry: {
    attempts: 3,
    delay: 1000,
  },
  
  // 请求头配置
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // 环境检测
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// 获取完整的 API URL
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.baseUrl;
  
  // 如果是相对路径，直接拼接
  if (baseUrl.startsWith('/')) {
    return `${baseUrl}${endpoint}`;
  }
  
  // 如果是绝对路径，确保格式正确
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${cleanBaseUrl}${cleanEndpoint}`;
};

// 移动端 API 配置
export const MOBILE_API_CONFIG = {
  // 开发环境使用 localhost
  development: 'http://localhost:3000/api',
  
  // 生产环境使用实际域名
  production: process.env.NEXT_PUBLIC_API_URL || 'https://xinze-app.vercel.app/api',
  
  // 获取当前环境的 API URL
  getCurrentUrl: () => {
    if (API_CONFIG.isDevelopment) {
      return MOBILE_API_CONFIG.development;
    }
    return MOBILE_API_CONFIG.production;
  },
};

export default API_CONFIG;
