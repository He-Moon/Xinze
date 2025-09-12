import { apiClient } from '../api/client';
import { ApiResponse } from '../types';

export interface Task {
  id: string;
  title: string;
  description?: string;
  content?: string;
  type: 'task' | 'idea' | 'link';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  aiAnalysis?: string;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
  time?: string; // 为了兼容 TodayView 的接口
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  content?: string;
  type?: 'task' | 'idea' | 'link';
  priority?: 'low' | 'medium' | 'high';
  // AI分析信息
  aiType?: string;
  aiSummary?: string;
  aiConfidence?: number;
  aiReasoning?: string;
  aiModel?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  content?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

export interface TaskListResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class TaskService {
  // 获取任务列表
  async getTasks(params?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<TaskListResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.type) {
      queryParams.append('type', params.type);
    }
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    
    return await apiClient.get<TaskListResponse>(endpoint);
  }

  // 创建任务
  async createTask(data: CreateTaskRequest): Promise<ApiResponse<Task>> {
    return await apiClient.post<Task>('/tasks', data);
  }

  // 更新任务
  async updateTask(id: string, data: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    return await apiClient.put<Task>('/tasks', { id, ...data });
  }

  // 删除任务
  async deleteTask(id: string): Promise<ApiResponse> {
    return await apiClient.delete(`/tasks?id=${id}`);
  }

  // 标记任务为完成
  async completeTask(id: string): Promise<ApiResponse<Task>> {
    return await this.updateTask(id, { status: 'completed' });
  }

  // 标记任务为进行中
  async startTask(id: string): Promise<ApiResponse<Task>> {
    return await this.updateTask(id, { status: 'in_progress' });
  }

  // 取消任务
  async cancelTask(id: string): Promise<ApiResponse<Task>> {
    return await this.updateTask(id, { status: 'cancelled' });
  }

  // 获取今日任务（未完成的任务）
  async getTodayTasks(): Promise<ApiResponse<TaskListResponse>> {
    return await this.getTasks({ 
      status: 'pending,in_progress',
      limit: 50 
    });
  }

  // 获取已完成的任务
  async getCompletedTasks(): Promise<ApiResponse<TaskListResponse>> {
    return await this.getTasks({ 
      status: 'completed',
      limit: 50 
    });
  }
}

// 导出单例实例
export const taskService = new TaskService();
export default taskService;
