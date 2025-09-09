// API相关常量
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// 认证相关常量
export const AUTH_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

// 任务状态常量
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

// 任务优先级常量
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// 分页常量
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// 表单验证常量
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// 错误消息常量
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: '此字段为必填项',
  INVALID_EMAIL: '请输入有效的邮箱地址',
  PASSWORD_TOO_SHORT: `密码至少需要${VALIDATION.PASSWORD_MIN_LENGTH}个字符`,
  NAME_TOO_SHORT: `姓名至少需要${VALIDATION.NAME_MIN_LENGTH}个字符`,
  PASSWORDS_NOT_MATCH: '两次输入的密码不一致',
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  UNAUTHORIZED: '未授权访问，请重新登录',
  FORBIDDEN: '没有权限执行此操作',
  NOT_FOUND: '请求的资源不存在',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
} as const;
