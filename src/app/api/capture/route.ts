import { NextRequest, NextResponse } from 'next/server';
import { requireAuthWithResponse } from '../../../lib/api-utils';

interface AIRecognitionResult {
  type: 'task' | 'goal' | 'principle';
  summary: string;
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
    const { content, type, tags, priority = 'medium' } = body;

    // 验证必填字段
    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: '内容不能为空' },
        { status: 400 }
      );
    }

    if (!['task', 'goal', 'principle'].includes(type)) {
      return NextResponse.json(
        { success: false, message: '无效的类型' },
        { status: 400 }
      );
    }

    // 创建快速捕捉记录
    const captureData = {
      id: `capture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      type,
      tags: tags || [],
      priority,
      userId: userId,
      createdAt: new Date().toISOString(),
      status: type === 'task' ? 'pending' : 'active'
    };

    // TODO: 这里应该保存到数据库
    // 目前先模拟保存成功
    console.log('保存快速捕捉记录:', captureData);

    // 如果是任务类型，可以触发AI分析
    if (type === 'task') {
      // TODO: 调用AI分析接口
      console.log('触发AI分析任务:', captureData);
    }

    return NextResponse.json({
      success: true,
      data: captureData,
      message: '快速保存成功'
    });

  } catch (error) {
    console.error('快速捕捉保存失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '保存失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}

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
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    // TODO: 从数据库获取用户的快速捕捉记录
    // 目前返回模拟数据
    const mockData = {
      captures: [
        {
          id: 'capture_1',
          content: '完成项目文档',
          type: 'task',
          tags: ['工作', '重要'],
          priority: 'high',
          createdAt: '2024-01-15T10:30:00.000Z',
          status: 'pending'
        },
        {
          id: 'capture_2',
          content: '学习新的设计模式',
          type: 'goal',
          tags: ['学习', '成长'],
          priority: 'medium',
          createdAt: '2024-01-14T15:20:00.000Z',
          status: 'active'
        }
      ],
      pagination: {
        page,
        limit,
        total: 2,
        pages: 1
      }
    };

    return NextResponse.json({
      success: true,
      data: mockData
    });

  } catch (error) {
    console.error('获取快速捕捉记录失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取记录失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}

// AI识别接口
export async function PUT(request: NextRequest) {
  try {
    // 验证用户认证
    const { user, errorResponse } = requireAuthWithResponse(request);
    if (errorResponse) {
      return errorResponse;
    }

    const body = await request.json();
    const { content } = body;

    // 验证必填字段
    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: '内容不能为空' },
        { status: 400 }
      );
    }

    // 模拟AI识别延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 生成AI识别结果
    const recognitionResult = generateAIRecognitionResult(content.trim());

    return NextResponse.json({
      success: true,
      data: recognitionResult,
      message: 'AI识别完成'
    });

  } catch (error) {
    console.error('AI识别失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'AI识别失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}

// 生成AI识别结果的辅助函数
function generateAIRecognitionResult(content: string): AIRecognitionResult {
  const lowerContent = content.toLowerCase();
  
  // 简单的关键词匹配逻辑
  let type: 'task' | 'goal' | 'principle' = 'task';
  let summary = '';

  // 类型识别
  if (lowerContent.includes('目标') || lowerContent.includes('梦想') || lowerContent.includes('希望') || 
      lowerContent.includes('想要') || lowerContent.includes('计划') || lowerContent.includes('愿景')) {
    type = 'goal';
  } else if (lowerContent.includes('原则') || lowerContent.includes('价值观') || lowerContent.includes('信念') ||
             lowerContent.includes('理念') || lowerContent.includes('准则') || lowerContent.includes('信条')) {
    type = 'principle';
  }

  // 生成摘要
  const typeText = type === 'task' ? '任务' : type === 'goal' ? '目标' : '心则';
  summary = `这是一个${typeText}，内容为：${content}`;

  return {
    type,
    summary
  };
}