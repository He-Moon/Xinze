import { NextRequest, NextResponse } from 'next/server';
import { requireAuthWithResponse } from '../../../../lib/api-utils';
import { aiService } from '../../../../lib/ai-service';
import { prisma } from '../../../../lib/db';

// AI智能分析接口
export async function POST(request: NextRequest) {
  try {
    // 验证用户认证
    const { user, errorResponse } = requireAuthWithResponse(request);
    if (errorResponse) {
      return errorResponse;
    }

    const { userId } = user!;

    const body = await request.json();
    const { content, analysisType = 'content' } = body;

    // 验证必填字段
    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: '内容不能为空' },
        { status: 400 }
      );
    }

    let analysisResult;

    if (analysisType === 'content') {
      // 内容类型识别
      analysisResult = await aiService.recognizeContent(content.trim());
    } else if (analysisType === 'task') {
      // 智能任务分析
      // 获取用户的所有目标
      const userGoals = await prisma.goal.findMany({
        where: {
          userId,
          status: 'active' // 只获取活跃的目标
        },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          keywords: true
        }
      });

      // 将keywords从JSON字符串转换为数组
      const goalsWithKeywords = userGoals.map(goal => ({
        ...goal,
        keywords: goal.keywords ? JSON.parse(goal.keywords) : []
      }));

      analysisResult = await aiService.analyzeTask(content.trim(), goalsWithKeywords);
    } else {
      return NextResponse.json(
        { success: false, message: '无效的分析类型' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: analysisResult,
      message: 'AI分析完成'
    });

  } catch (error) {
    console.error('AI分析失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'AI分析失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}

