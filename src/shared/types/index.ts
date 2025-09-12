// 用户相关类型
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 认证相关类型
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// 任务相关类型
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  type: 'task';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// 目标相关类型
export interface Goal {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high';
  type: 'long-term' | 'stage' | 'sub';
  deadline?: Date;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// 心则相关类型
export interface Principle {
  id: string;
  content: string;
  description?: string;
  tags: string[];
  source: 'personal' | 'book' | 'article' | 'other';
  weight: number;
  createdAt: string;
  userId: string;
}

// AI识别结果类型
export interface AIRecognitionResult {
  type: 'task' | 'goal' | 'principle';
  summary: string;
  confidence?: number;
  reasoning?: string;
}

// AI分析信息类型
export interface AIAnalysisInfo {
  aiType?: string;
  aiSummary?: string;
  aiConfidence?: number;
  aiReasoning?: string;
  aiModel?: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 通用分页类型
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
