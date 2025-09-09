import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/shared/types';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 验证输入
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: '邮箱和密码不能为空'
      } as ApiResponse, { status: 400 });
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: '邮箱或密码错误'
      } as ApiResponse, { status: 401 });
    }

    // 验证密码
    if (!user.password) {
      return NextResponse.json({
        success: false,
        message: '该账户未设置密码，请使用其他登录方式'
      } as ApiResponse, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        message: '邮箱或密码错误'
      } as ApiResponse, { status: 401 });
    }

    // 生成JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.image,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        token
      },
      message: '登录成功'
    } as ApiResponse);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: '服务器内部错误'
    } as ApiResponse, { status: 500 });
  }
}
