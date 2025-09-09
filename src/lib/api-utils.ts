import { NextRequest, NextResponse } from 'next/server';

// 从中间件验证过的请求中获取用户信息
export function getUserFromRequest(request: NextRequest): { userId: string; email: string } | null {
  const userId = request.headers.get('x-user-id');
  const email = request.headers.get('x-user-email');
  
  if (!userId || !email) {
    return null;
  }
  
  return { userId, email };
}

// 验证用户认证的辅助函数
export function requireAuth(request: NextRequest): { userId: string; email: string } | null {
  return getUserFromRequest(request);
}

// 验证用户认证并返回错误响应的辅助函数
export function requireAuthWithResponse(request: NextRequest): { 
  user: { userId: string; email: string } | null; 
  errorResponse: NextResponse | null 
} {
  const user = getUserFromRequest(request);
  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { success: false, message: '认证失败' },
        { status: 401 }
      )
    };
  }
  return { user, errorResponse: null };
}