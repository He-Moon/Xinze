import { apiClient } from '../api/client';
import { ApiResponse } from '../types';

export interface Principle {
  id: string;
  content: string;
  description?: string;
  tags: string[];
  source: 'personal' | 'quote' | 'insight';
  createdAt: string;
  weight: number;
}

export interface CreatePrincipleRequest {
  content: string;
  description?: string;
  weight?: number;
  // AI分析信息
  aiType?: string;
  aiSummary?: string;
  aiConfidence?: number;
  aiReasoning?: string;
  aiModel?: string;
}

export interface UpdatePrincipleRequest {
  content?: string;
  description?: string;
  weight?: number;
}

export interface PrincipleListResponse {
  principles: Principle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class PrincipleService {
  // 获取心则列表
  async getPrinciples(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PrincipleListResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/principles?${queryString}` : '/principles';
    
    return await apiClient.get<PrincipleListResponse>(endpoint);
  }

  // 创建心则
  async createPrinciple(data: CreatePrincipleRequest): Promise<ApiResponse<Principle>> {
    return await apiClient.post<Principle>('/principles', data);
  }

  // 更新心则
  async updatePrinciple(id: string, data: UpdatePrincipleRequest): Promise<ApiResponse<Principle>> {
    return await apiClient.put<Principle>('/principles', { id, ...data });
  }

  // 删除心则
  async deletePrinciple(id: string): Promise<ApiResponse> {
    return await apiClient.delete(`/principles?id=${id}`);
  }

  // 获取所有心则
  async getAllPrinciples(): Promise<ApiResponse<PrincipleListResponse>> {
    return await this.getPrinciples({ 
      limit: 100 
    });
  }
}

// 导出单例实例
export const principleService = new PrincipleService();
export default principleService;
