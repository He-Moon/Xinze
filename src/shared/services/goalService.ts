import { apiClient } from '../api/client';
import { ApiResponse } from '../types';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
  type: 'long-term' | 'stage' | 'sub';
  deadline?: string;
  progress: number;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'active' | 'completed' | 'paused';
}

export interface GoalListResponse {
  goals: Goal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class GoalService {
  // 获取目标列表
  async getGoals(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<GoalListResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/goals?${queryString}` : '/goals';
    
    return await apiClient.get<GoalListResponse>(endpoint);
  }

  // 创建目标
  async createGoal(data: CreateGoalRequest): Promise<ApiResponse<Goal>> {
    return await apiClient.post<Goal>('/goals', data);
  }

  // 更新目标
  async updateGoal(id: string, data: UpdateGoalRequest): Promise<ApiResponse<Goal>> {
    return await apiClient.put<Goal>('/goals', { id, ...data });
  }

  // 删除目标
  async deleteGoal(id: string): Promise<ApiResponse> {
    return await apiClient.delete(`/goals?id=${id}`);
  }

  // 完成目标
  async completeGoal(id: string): Promise<ApiResponse<Goal>> {
    return await this.updateGoal(id, { status: 'completed' });
  }

  // 暂停目标
  async pauseGoal(id: string): Promise<ApiResponse<Goal>> {
    return await this.updateGoal(id, { status: 'paused' });
  }

  // 激活目标
  async activateGoal(id: string): Promise<ApiResponse<Goal>> {
    return await this.updateGoal(id, { status: 'active' });
  }

  // 获取活跃目标
  async getActiveGoals(): Promise<ApiResponse<GoalListResponse>> {
    return await this.getGoals({ 
      status: 'active',
      limit: 50 
    });
  }
}

// 导出单例实例
export const goalService = new GoalService();
export default goalService;
