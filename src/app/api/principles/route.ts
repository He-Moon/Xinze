import { NextRequest, NextResponse } from 'next/server';
import { requireAuthWithResponse } from '../../../lib/api-utils';
import { prisma } from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    // 验证用户认证
    const { user, errorResponse } = requireAuthWithResponse(request);
    if (errorResponse) {
      return errorResponse;
    }

    const { userId } = user!;
    console.log('🔍 Principles API - 用户ID:', userId);

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // 构建查询条件
    const where = {
      userId: userId
    };

    // 从数据库获取心则（使用 Value 模型）
    console.log('🔍 Principles API - 查询条件:', where);
    const [principles, total] = await Promise.all([
      prisma.value.findMany({
        where,
        orderBy: [
          { weight: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: offset,
        take: limit
      }),
      prisma.value.count({ where })
    ]);
    console.log('📊 Principles API - 查询结果:', principles.length, '个心则');

    // 转换数据格式以匹配前端接口
    const formattedPrinciples = principles.map(principle => ({
      id: principle.id,
      content: principle.name, // 使用 name 字段作为内容
      description: principle.description,
      tags: [], // 暂时为空，后续可以扩展
      source: 'personal' as const,
      createdAt: principle.createdAt.toISOString().split('T')[0],
      weight: principle.weight
    }));

    return NextResponse.json({
      success: true,
      data: {
        principles: formattedPrinciples,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('获取心则失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取心则失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 验证用户认证
    const { user, errorResponse } = requireAuthWithResponse(request);
    if (errorResponse) {
      return errorResponse;
    }

    const { userId } = user!;

    const body = await request.json();
    const { content, description, weight = 1 } = body;

    // 验证必填字段
    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: '心则内容不能为空' },
        { status: 400 }
      );
    }

    // 创建心则（使用 Value 模型）
    const principle = await prisma.value.create({
      data: {
        name: content.trim(), // 使用 name 字段存储内容
        description: description?.trim(),
        weight: Math.min(Math.max(weight, 1), 10), // 限制权重在 1-10 之间
        userId,
        // AI分析信息
        aiType: body.aiType,
        aiSummary: body.aiSummary,
        aiConfidence: body.aiConfidence,
        aiReasoning: body.aiReasoning,
        aiModel: body.aiModel
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: principle.id,
        content: principle.name,
        description: principle.description,
        tags: [],
        source: 'personal',
        createdAt: principle.createdAt.toISOString().split('T')[0],
        weight: principle.weight
      },
      message: '心则创建成功'
    });

  } catch (error) {
    console.error('创建心则失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '创建心则失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 验证用户认证
    const { user, errorResponse } = requireAuthWithResponse(request);
    if (errorResponse) {
      return errorResponse;
    }

    const { userId } = user!;

    const body = await request.json();
    const { id, content, description, weight } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: '心则ID不能为空' },
        { status: 400 }
      );
    }

    // 检查心则是否存在且属于当前用户
    const existingPrinciple = await prisma.value.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingPrinciple) {
      return NextResponse.json(
        { success: false, message: '心则不存在' },
        { status: 404 }
      );
    }

    // 构建更新数据
    const updateData: any = {};
    if (content !== undefined) updateData.name = content.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (weight !== undefined) updateData.weight = Math.min(Math.max(weight, 1), 10);

    // 更新心则
    const updatedPrinciple = await prisma.value.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedPrinciple.id,
        content: updatedPrinciple.name,
        description: updatedPrinciple.description,
        tags: [],
        source: 'personal',
        createdAt: updatedPrinciple.createdAt.toISOString().split('T')[0],
        weight: updatedPrinciple.weight
      },
      message: '心则更新成功'
    });

  } catch (error) {
    console.error('更新心则失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '更新心则失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 验证用户认证
    const { user, errorResponse } = requireAuthWithResponse(request);
    if (errorResponse) {
      return errorResponse;
    }

    const { userId } = user!;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: '心则ID不能为空' },
        { status: 400 }
      );
    }

    // 检查心则是否存在且属于当前用户
    const existingPrinciple = await prisma.value.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingPrinciple) {
      return NextResponse.json(
        { success: false, message: '心则不存在' },
        { status: 404 }
      );
    }

    // 删除心则
    await prisma.value.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: '心则删除成功'
    });

  } catch (error) {
    console.error('删除心则失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '删除心则失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}
