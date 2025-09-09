import { apiClient } from '../api/client';
import { User, LoginCredentials, RegisterCredentials, ApiResponse } from '../types';

export class AuthService {
  // 登录
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiClient.post<{ user: User; token: string }>('/auth/login', credentials);
    
    if (response.success && response.data) {
      // 保存token到本地存储
      apiClient.setAuthToken(response.data.token);
    }
    
    return response;
  }

  // 注册
  async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiClient.post<{ user: User; token: string }>('/auth/register', credentials);
    
    if (response.success && response.data) {
      // 保存token到本地存储
      apiClient.setAuthToken(response.data.token);
    }
    
    return response;
  }

  // 登出
  async logout(): Promise<ApiResponse> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // 即使API调用失败，也要清除本地token
      console.warn('Logout API failed:', error);
    } finally {
      // 清除本地存储的token
      apiClient.clearAuthToken();
    }
    
    return { success: true, message: '登出成功' };
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return await apiClient.get<User>('/auth/me');
  }

  // 刷新token
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await apiClient.post<{ token: string }>('/auth/refresh');
    
    if (response.success && response.data) {
      apiClient.setAuthToken(response.data.token);
    }
    
    return response;
  }

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!apiClient.getAuthToken();
  }
}

// 导出单例实例
export const authService = new AuthService();
export default authService;