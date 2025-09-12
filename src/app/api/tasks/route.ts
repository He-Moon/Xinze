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

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // 构建查询条件
    const where: any = {
      userId: userId
    };

    if (status) {
      // 支持多个状态值，用逗号分隔
      const statusList = status.split(',').map(s => s.trim());
      if (statusList.length === 1) {
        where.status = statusList[0];
      } else {
        where.status = { in: statusList };
      }
    }

    if (type) {
      where.type = type;
    }

    // 从数据库获取任务
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: offset,
        take: limit
      }),
      prisma.task.count({ where })
    ]);

    // 转换数据格式以匹配前端接口
    const formattedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      content: task.content,
      type: task.type,
      priority: task.priority === 3 ? 'high' : task.priority === 2 ? 'medium' : 'low',
      status: task.status,
      aiAnalysis: task.aiAnalysis,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      // 为了兼容 TodayView 的接口，添加一些额外字段
      time: null, // 暂时没有时间字段
      completed: task.status === 'completed'
    }));

    return NextResponse.json({
      success: true,
      data: {
        tasks: formattedTasks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('获取任务失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取任务失败，请稍后重试'
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
    const { title, description, content, type = 'task', priority = 1 } = body;

    // 验证必填字段
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, message: '任务标题不能为空' },
        { status: 400 }
      );
    }

    // 创建任务
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim(),
        content: content?.trim(),
        type,
        priority: priority === 'high' ? 3 : priority === 'medium' ? 2 : 1,
        status: 'pending',
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
        id: task.id,
        title: task.title,
        description: task.description,
        content: task.content,
        type: task.type,
        priority: task.priority === 3 ? 'high' : task.priority === 2 ? 'medium' : 'low',
        status: task.status,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        completed: task.status === 'completed'
      },
      message: '任务创建成功'
    });

  } catch (error) {
    console.error('创建任务失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '创建任务失败，请稍后重试'
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
    const { id, title, description, content, priority, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: '任务ID不能为空' },
        { status: 400 }
      );
    }

    // 检查任务是否存在且属于当前用户
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingTask) {
      return NextResponse.json(
        { success: false, message: '任务不存在' },
        { status: 404 }
      );
    }

    // 构建更新数据
    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (content !== undefined) updateData.content = content?.trim();
    if (priority !== undefined) {
      updateData.priority = priority === 'high' ? 3 : priority === 'medium' ? 2 : 1;
    }
    if (status !== undefined) updateData.status = status;

    // 更新任务
    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
        content: updatedTask.content,
        type: updatedTask.type,
        priority: updatedTask.priority === 3 ? 'high' : updatedTask.priority === 2 ? 'medium' : 'low',
        status: updatedTask.status,
        createdAt: updatedTask.createdAt.toISOString(),
        updatedAt: updatedTask.updatedAt.toISOString(),
        completed: updatedTask.status === 'completed'
      },
      message: '任务更新成功'
    });

  } catch (error) {
    console.error('更新任务失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '更新任务失败，请稍后重试'
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
        { success: false, message: '任务ID不能为空' },
        { status: 400 }
      );
    }

    // 检查任务是否存在且属于当前用户
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingTask) {
      return NextResponse.json(
        { success: false, message: '任务不存在' },
        { status: 404 }
      );
    }

    // 删除任务
    await prisma.task.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: '任务删除成功'
    });

  } catch (error) {
    console.error('删除任务失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '删除任务失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}
