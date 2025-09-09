import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/shared/types';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // 从请求头获取token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: '未提供认证token'
      } as ApiResponse, { status: 401 });
    }

    const token = authHeader.substring(7); // 移除 "Bearer " 前缀
    
    // 简单的token验证（实际项目中应该使用JWT）
    if (!token.startsWith('token_')) {
      return NextResponse.json({
        success: false,
        message: '无效的token格式'
      } as ApiResponse, { status: 401 });
    }

    // 从token中提取用户ID（简单实现）
    const userId = token.split('_')[1];
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: '无效的token'
      } as ApiResponse, { status: 401 });
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: '用户不存在'
      } as ApiResponse, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      message: '获取用户信息成功'
    } as ApiResponse);
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json({
      success: false,
      message: '服务器内部错误'
    } as ApiResponse, { status: 500 });
  }
}
