// 认证错误处理工具
export class AuthErrorHandler {
  private static instance: AuthErrorHandler;
  private isRedirecting = false;

  static getInstance(): AuthErrorHandler {
    if (!AuthErrorHandler.instance) {
      AuthErrorHandler.instance = new AuthErrorHandler();
    }
    return AuthErrorHandler.instance;
  }

  // 处理401错误
  handleUnauthorized(): void {
    if (this.isRedirecting) {
      return; // 防止重复跳转
    }

    this.isRedirecting = true;

    // 清除本地存储的认证信息
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      
      // 清除所有相关的认证状态
      const authProvider = (window as any).__auth_provider__;
      if (authProvider && typeof authProvider.logout === 'function') {
        authProvider.logout();
      }

      // 延迟跳转，确保状态清理完成
      setTimeout(() => {
        window.location.href = '/login?reason=session_expired';
        this.isRedirecting = false;
      }, 100);
    }
  }

  // 处理认证错误
  handleAuthError(error: any): void {
    if (error?.message?.includes('401') || error?.status === 401) {
      this.handleUnauthorized();
    }
  }

  // 重置重定向状态
  reset(): void {
    this.isRedirecting = false;
  }
}

// 导出单例实例
export const authErrorHandler = AuthErrorHandler.getInstance();
