import { ApiResponse } from '../types';
import { AUTH_TOKEN_KEY } from '../constants';
import { storage, handleApiError } from '../utils';
import { authErrorHandler } from '../../lib/auth-error-handler';
import { API_CONFIG, getApiUrl } from '../config/api';

// HTTP客户端配置
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.baseUrl;
    this.defaultHeaders = API_CONFIG.headers;
  }

  // 获取认证token
  getAuthToken(): string | null {
    return storage.get<string>(AUTH_TOKEN_KEY);
  }

  // 设置认证token
  setAuthToken(token: string): void {
    storage.set(AUTH_TOKEN_KEY, token);
  }

  // 清除认证token
  clearAuthToken(): void {
    storage.remove(AUTH_TOKEN_KEY);
  }

  // 构建请求头
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    const token = this.getAuthToken();
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // 处理响应
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      // 只有401错误才跳转登录页
      if (response.status === 401) {
        authErrorHandler.handleUnauthorized();
      } else {
        // 其他错误只记录到控制台
        console.error(`API Error ${response.status}:`, data);
      }
      throw new Error(data.message || `HTTP ${response.status}`);
    }
    
    return data;
  }

  // GET请求
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url: string;
    
    // 处理相对路径和绝对路径
    if (this.baseURL.startsWith('http')) {
      // 绝对路径
      const urlObj = new URL(`${this.baseURL}${endpoint}`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            urlObj.searchParams.append(key, String(value));
          }
        });
      }
      url = urlObj.toString();
    } else {
      // 相对路径
      url = `${this.baseURL}${endpoint}`;
      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        url += `?${searchParams.toString()}`;
      }
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.buildHeaders(),
      });
      
      return await this.handleResponse<T>(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // POST请求
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint);
      const response = await fetch(url, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });
      
      return await this.handleResponse<T>(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // PUT请求
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint);
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.buildHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });
      
      return await this.handleResponse<T>(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // DELETE请求
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const url = this.buildUrl(endpoint);
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.buildHeaders(),
      });
      
      return await this.handleResponse<T>(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 构建URL的辅助方法
  private buildUrl(endpoint: string): string {
    return getApiUrl(endpoint);
  }
}

// 导出单例实例
export const apiClient = new ApiClient();
export default apiClient;
