'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { User, LoginCredentials, RegisterCredentials, AuthState } from '../types';
import { ERROR_MESSAGES } from '../constants';
import { authErrorHandler } from '../../lib/auth-error-handler';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 检查是否有token
        const token = authService.isAuthenticated();
        if (token) {
          // 有token，尝试获取用户信息
          const response = await authService.getCurrentUser();
          if (response.success && response.data) {
            setAuthState({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // token无效，清除认证状态
            await authService.logout();
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          // 没有token，直接设置为未登录状态
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // 检查是否是401错误
        authErrorHandler.handleAuthError(error);
        // 出错时清除认证状态
        await authService.logout();
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    // 只在客户端执行
    if (typeof window !== 'undefined') {
      initAuth();
    } else {
      // 服务端渲染时直接设置为未登录
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  // 登录
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true, message: '登录成功' };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, message: response.message || ERROR_MESSAGES.SERVER_ERROR };
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      authErrorHandler.handleAuthError(error);
      return { success: false, message: error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR };
    }
  }, []);

  // 注册
  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.register(credentials);
      
      if (response.success && response.data) {
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true, message: '注册成功' };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, message: response.message || ERROR_MESSAGES.SERVER_ERROR };
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      authErrorHandler.handleAuthError(error);
      return { success: false, message: error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR };
    }
  }, []);

  // 登出
  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await authService.logout();
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      return { success: true, message: '登出成功' };
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return { success: false, message: error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR };
    }
  }, []);

  // 刷新用户信息
  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setAuthState(prev => ({
          ...prev,
          user: response.data!,
        }));
        return { success: true };
      }
      return { success: false, message: response.message || ERROR_MESSAGES.SERVER_ERROR };
    } catch (error) {
      authErrorHandler.handleAuthError(error);
      return { success: false, message: error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR };
    }
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    refreshUser,
  };
}
