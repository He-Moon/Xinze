import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // 清除认证相关的 cookies
    const cookieStore = cookies();
    
    // 清除 token cookie
    cookieStore.delete('auth-token');
    
    // 清除其他可能的认证相关 cookies
    cookieStore.delete('session');
    cookieStore.delete('user');
    
    return NextResponse.json({
      success: true,
      message: '退出登录成功'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '退出登录失败'
      },
      { status: 500 }
    );
  }
}

// 支持 GET 请求（可选）
export async function GET(request: NextRequest) {
  return POST(request);
}
