import { apiClient } from '../api/client';
import { ApiResponse } from '../types';

export interface CaptureItem {
  id: string;
  content: string;
  type: 'task' | 'goal' | 'principle';
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  userId: string;
  createdAt: string;
  status: 'pending' | 'active' | 'completed' | 'archived';
}

export interface CreateCaptureRequest {
  content: string;
  type: 'task' | 'goal' | 'principle';
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
}

export interface CaptureListResponse {
  captures: CaptureItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class CaptureService {
  // 创建快速捕捉记录
  async createCapture(data: CreateCaptureRequest): Promise<ApiResponse<CaptureItem>> {
    return await apiClient.post<CaptureItem>('/capture', data);
  }

  // 获取快速捕捉记录列表
  async getCaptures(params?: {
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<CaptureListResponse>> {
    const queryParams = new URLSearchParams();
    
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
    const endpoint = queryString ? `/capture?${queryString}` : '/capture';
    
    return await apiClient.get<CaptureListResponse>(endpoint);
  }

  // 更新快速捕捉记录
  async updateCapture(id: string, data: Partial<CreateCaptureRequest>): Promise<ApiResponse<CaptureItem>> {
    return await apiClient.put<CaptureItem>(`/capture/${id}`, data);
  }

  // 删除快速捕捉记录
  async deleteCapture(id: string): Promise<ApiResponse> {
    return await apiClient.delete(`/capture/${id}`);
  }

  // 标记任务为完成
  async completeTask(id: string): Promise<ApiResponse<CaptureItem>> {
    return await apiClient.put<CaptureItem>(`/capture/${id}`, { status: 'completed' });
  }

  // 归档记录
  async archiveCapture(id: string): Promise<ApiResponse<CaptureItem>> {
    return await apiClient.put<CaptureItem>(`/capture/${id}`, { status: 'archived' });
  }
}

// 导出单例实例
export const captureService = new CaptureService();
export default captureService;
