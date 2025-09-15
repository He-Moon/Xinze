import { NextRequest, NextResponse } from 'next/server';
import { requireAuthWithResponse } from '../../../../lib/api-utils';
import { prisma } from '../../../../lib/db';

// 获取任务的目标关联
export async function GET(request: NextRequest) {
  try {
    const { user, errorResponse } = requireAuthWithResponse(request);
    if (errorResponse) {
      return errorResponse;
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { success: false, message: '任务ID不能为空' },
        { status: 400 }
      );
    }

    // 验证任务是否属于当前用户
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: user!.userId
      }
    });

    if (!task) {
      return NextResponse.json(
        { success: false, message: '任务不存在' },
        { status: 404 }
      );
    }

    // 获取任务的目标关联
    const taskGoals = await prisma.taskGoalRelation.findMany({
      where: { taskId },
      include: {
        goal: true
      },
      orderBy: { alignmentScore: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: taskGoals.map(tg => ({
        id: tg.id,
        taskId: tg.taskId,
        goalId: tg.goalId,
        alignmentScore: tg.alignmentScore,
        userConfirmed: tg.userConfirmed,
        reasoning: tg.reasoning,
        goal: tg.goal
      }))
    });

  } catch (error) {
    console.error('获取任务目标关联失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取任务目标关联失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}

// 创建任务-目标关联
export async function POST(request: NextRequest) {
  try {
    const { user, errorResponse } = requireAuthWithResponse(request);
    if (errorResponse) {
      return errorResponse;
    }

    const body = await request.json();
    const { taskId, goalId, alignmentScore, reasoning } = body;

    if (!taskId || !goalId) {
      return NextResponse.json(
        { success: false, message: '任务ID和目标ID不能为空' },
        { status: 400 }
      );
    }

    // 验证任务和目标是否属于当前用户
    const [task, goal] = await Promise.all([
      prisma.task.findFirst({
        where: { id: taskId, userId: user!.userId }
      }),
      prisma.goal.findFirst({
        where: { id: goalId, userId: user!.userId }
      })
    ]);

    if (!task || !goal) {
      return NextResponse.json(
        { success: false, message: '任务或目标不存在' },
        { status: 404 }
      );
    }

    // 检查关联是否已存在
    const existingRelation = await prisma.taskGoalRelation.findFirst({
      where: { taskId, goalId }
    });

    if (existingRelation) {
      return NextResponse.json(
        { success: false, message: '关联已存在' },
        { status: 400 }
      );
    }

    // 创建关联
    const relation = await prisma.taskGoalRelation.create({
      data: {
        taskId,
        goalId,
        alignmentScore: alignmentScore || 0.5,
        reasoning,
        userConfirmed: false
      },
      include: {
        goal: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: relation.id,
        taskId: relation.taskId,
        goalId: relation.goalId,
        alignmentScore: relation.alignmentScore,
        userConfirmed: relation.userConfirmed,
        reasoning: relation.reasoning,
        goal: relation.goal
      },
      message: '关联创建成功'
    });

  } catch (error) {
    console.error('创建任务目标关联失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '创建任务目标关联失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}

// 更新任务-目标关联
export async function PUT(request: NextRequest) {
  try {
    const { user, errorResponse } = requireAuthWithResponse(request);
    if (errorResponse) {
      return errorResponse;
    }

    const body = await request.json();
    const { id, userConfirmed, alignmentScore, reasoning } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: '关联ID不能为空' },
        { status: 400 }
      );
    }

    // 验证关联是否属于当前用户
    const existingRelation = await prisma.taskGoalRelation.findFirst({
      where: {
        id,
        task: { userId: user!.userId }
      }
    });

    if (!existingRelation) {
      return NextResponse.json(
        { success: false, message: '关联不存在' },
        { status: 404 }
      );
    }

    // 更新关联
    const updatedRelation = await prisma.taskGoalRelation.update({
      where: { id },
      data: {
        userConfirmed,
        alignmentScore,
        reasoning
      },
      include: {
        goal: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedRelation.id,
        taskId: updatedRelation.taskId,
        goalId: updatedRelation.goalId,
        alignmentScore: updatedRelation.alignmentScore,
        userConfirmed: updatedRelation.userConfirmed,
        reasoning: updatedRelation.reasoning,
        goal: updatedRelation.goal
      },
      message: '关联更新成功'
    });

  } catch (error) {
    console.error('更新任务目标关联失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '更新任务目标关联失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}

// 删除任务-目标关联
export async function DELETE(request: NextRequest) {
  try {
    const { user, errorResponse } = requireAuthWithResponse(request);
    if (errorResponse) {
      return errorResponse;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: '关联ID不能为空' },
        { status: 400 }
      );
    }

    // 验证关联是否属于当前用户
    const existingRelation = await prisma.taskGoalRelation.findFirst({
      where: {
        id,
        task: { userId: user!.userId }
      }
    });

    if (!existingRelation) {
      return NextResponse.json(
        { success: false, message: '关联不存在' },
        { status: 404 }
      );
    }

    // 删除关联
    await prisma.taskGoalRelation.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: '关联删除成功'
    });

  } catch (error) {
    console.error('删除任务目标关联失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '删除任务目标关联失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}

