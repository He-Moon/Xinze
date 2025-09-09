import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

// 公开的API路径（不需要认证）
const publicApiPaths = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('🔍 Middleware processing:', pathname);

  // 只处理API请求
  if (!pathname.startsWith('/api/')) {
    console.log('⏭️  Skipping non-API request');
    return NextResponse.next();
  }

  // 检查是否为公开API
  const isPublicApi = publicApiPaths.some(path => pathname.startsWith(path));
  if (isPublicApi) {
    console.log('✅ Public API, skipping auth');
    return NextResponse.next();
  }

  console.log('🔐 Protected API, checking auth...');

  // 验证Authorization头
  const authHeader = request.headers.get('authorization');
  console.log('📋 Auth header:', authHeader ? 'Present' : 'Missing');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No valid auth header');
    return NextResponse.json(
      { success: false, message: '未授权访问' },
      { status: 401 }
    );
  }

  // 验证JWT token
  const token = authHeader.replace('Bearer ', '');
  console.log('🎫 Token length:', token.length);
  
  const user = await verifyToken(token);
  if (!user) {
    console.log('❌ Token verification failed');
    return NextResponse.json(
      { success: false, message: '认证失败' },
      { status: 401 }
    );
  }

  console.log('✅ User authenticated:', user.userId);

  // 将用户信息添加到请求头，供API路由使用
  const response = NextResponse.next();
  response.headers.set('x-user-id', user.userId);
  response.headers.set('x-user-email', user.email);
  
  return response;
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    '/api/capture/:path*', // 匹配capture及其子路径
    '/api/tasks/:path*',
    '/api/goals/:path*',
    '/api/ai/:path*',
  ],
};