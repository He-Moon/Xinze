import { VALIDATION } from '../constants';

// 表单验证工具
export const validateEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
};

export const validateName = (name: string): boolean => {
  return name.length >= VALIDATION.NAME_MIN_LENGTH;
};

// 字符串工具
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number): string => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

// 日期工具
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// 平台检测
export const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';
export const isMobile = isWeb && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// 本地存储工具 - 跨平台兼容
export const storage = {
  get: <T>(key: string): T | null => {
    if (!isWeb) return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (!isWeb) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // 忽略存储错误
    }
  },
  
  remove: (key: string): void => {
    if (!isWeb) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // 忽略存储错误
    }
  },
  
  clear: (): void => {
    if (!isWeb) return;
    try {
      localStorage.clear();
    } catch {
      // 忽略存储错误
    }
  },
};

// 错误处理工具
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return '未知错误';
};

// 防抖工具
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 节流工具
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
