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
    console.log('🔍 Goals API - 用户ID:', userId);

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // 构建查询条件
    const where: any = {
      userId: userId
    };

    if (status) {
      where.status = status;
    }

    // 从数据库获取目标
    console.log('🔍 Goals API - 查询条件:', where);
    const [goals, total] = await Promise.all([
      prisma.goal.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: offset,
        take: limit
      }),
      prisma.goal.count({ where })
    ]);
    console.log('📊 Goals API - 查询结果:', goals.length, '个目标');
    if (goals.length > 0) {
      console.log('📊 Goals API - 第一个目标:', goals[0]);
    }

    // 转换数据格式以匹配前端接口
    const formattedGoals = goals.map(goal => ({
      id: goal.id,
      title: goal.title,
      description: goal.description,
      priority: goal.priority === 3 ? 'high' : goal.priority === 2 ? 'medium' : 'low',
      status: goal.status,
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString(),
      // 为了兼容前端接口，添加一些额外字段
      type: 'long-term' as const,
      deadline: null,
      progress: 0
    }));

    return NextResponse.json({
      success: true,
      data: {
        goals: formattedGoals,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('获取目标失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取目标失败，请稍后重试'
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
    const { title, description, priority = 1 } = body;

    // 验证必填字段
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, message: '目标标题不能为空' },
        { status: 400 }
      );
    }

    // 创建目标
    const goal = await prisma.goal.create({
      data: {
        title: title.trim(),
        description: description?.trim(),
        priority: priority === 'high' ? 3 : priority === 'medium' ? 2 : 1,
        status: 'active',
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
        id: goal.id,
        title: goal.title,
        description: goal.description,
        priority: goal.priority === 3 ? 'high' : goal.priority === 2 ? 'medium' : 'low',
        status: goal.status,
        createdAt: goal.createdAt.toISOString(),
        updatedAt: goal.updatedAt.toISOString(),
        type: 'long-term',
        deadline: null,
        progress: 0
      },
      message: '目标创建成功'
    });

  } catch (error) {
    console.error('创建目标失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '创建目标失败，请稍后重试'
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
    const { id, title, description, priority, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: '目标ID不能为空' },
        { status: 400 }
      );
    }

    // 检查目标是否存在且属于当前用户
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingGoal) {
      return NextResponse.json(
        { success: false, message: '目标不存在' },
        { status: 404 }
      );
    }

    // 构建更新数据
    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (priority !== undefined) {
      updateData.priority = priority === 'high' ? 3 : priority === 'medium' ? 2 : 1;
    }
    if (status !== undefined) updateData.status = status;

    // 更新目标
    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedGoal.id,
        title: updatedGoal.title,
        description: updatedGoal.description,
        priority: updatedGoal.priority === 3 ? 'high' : updatedGoal.priority === 2 ? 'medium' : 'low',
        status: updatedGoal.status,
        createdAt: updatedGoal.createdAt.toISOString(),
        updatedAt: updatedGoal.updatedAt.toISOString(),
        type: 'long-term',
        deadline: null,
        progress: 0
      },
      message: '目标更新成功'
    });

  } catch (error) {
    console.error('更新目标失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '更新目标失败，请稍后重试'
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
        { success: false, message: '目标ID不能为空' },
        { status: 400 }
      );
    }

    // 检查目标是否存在且属于当前用户
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingGoal) {
      return NextResponse.json(
        { success: false, message: '目标不存在' },
        { status: 404 }
      );
    }

    // 删除目标
    await prisma.goal.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: '目标删除成功'
    });

  } catch (error) {
    console.error('删除目标失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '删除目标失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}
