import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/shared/types';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, confirmPassword } = body;

    // 验证输入
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({
        success: false,
        message: '所有字段都不能为空'
      } as ApiResponse, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: '两次输入的密码不一致'
      } as ApiResponse, { status: 400 });
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: '该邮箱已被注册'
      } as ApiResponse, { status: 400 });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    });

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
      message: '注册成功'
    } as ApiResponse);
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({
      success: false,
      message: '服务器内部错误'
    } as ApiResponse, { status: 500 });
  }
}
