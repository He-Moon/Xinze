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
  
  // 新增：时间分析
  estimatedDuration?: string;  // 预估完成时间
  hasDeadline?: boolean;       // 是否有截止时间
  suggestedTimeframe?: string; // 建议执行时间段
  
  // 新增：重复性分析
  isRecurring?: boolean;       // 是否重复任务
  frequency?: 'daily' | 'weekly' | 'monthly'; // 重复频率
  
  // 任务-目标关联
  taskGoals?: TaskGoalRelation[];
}

// 目标相关类型
export interface Goal {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  priority: number; // 与 Prisma schema 保持一致，使用 number
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  
  // 新增：目标分类和关键词
  category?: string;  // 目标分类
  keywords?: string[]; // 关键词数组
  
  // 任务-目标关联
  taskGoals?: TaskGoalRelation[];
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

// 任务-目标关联类型
export interface TaskGoalRelation {
  id: string;
  taskId: string;
  goalId: string;
  alignmentScore: number;  // 关联强度 0-1
  userConfirmed: boolean;  // 用户是否确认
  reasoning?: string;      // 关联理由
  createdAt: Date;
  updatedAt: Date;
  
  // 关联的目标信息
  goal?: Goal;
}

// AI识别结果类型
export interface AIRecognitionResult {
  type: 'task' | 'goal' | 'principle';
  summary: string;
  confidence?: number;
  reasoning?: string;
}

// 扩展的AI任务分析结果
export interface AITaskAnalysisResult {
  // 基础分析
  priority: 'low' | 'medium' | 'high';
  estimatedTime: string;
  category: string;
  suggestions: string[];
  
  // 时间分析
  timeAnalysis: {
    estimatedDuration: string;    // 预估完成时间
    hasDeadline: boolean;         // 是否有截止时间
    suggestedTimeframe: string;   // 建议执行时间段
  };
  
  // 重复性分析
  repetitionAnalysis: {
    isRecurring: boolean;         // 是否重复任务
    frequency?: 'daily' | 'weekly' | 'monthly'; // 重复频率
  };
  
  // 目标关联分析
  goalAlignment: {
    relatedGoals: Array<{
      goalId: string;
      goalTitle: string;
      alignmentScore: number;     // 关联强度 0-1
      reasoning: string;          // 关联理由
    }>;
  };
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
