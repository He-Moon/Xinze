import { callAI, PROMPTS } from './ai-manager';
import { AITaskAnalysisResult, Goal } from '../shared/types';

export interface AIRecognitionResult {
  type: 'task' | 'goal' | 'principle';
  summary: string;
  confidence: number;
  reasoning: string;
}


export class AIService {

  async recognizeContent(content: string): Promise<AIRecognitionResult> {
    try {
      const { content: responseContent } = await callAI(PROMPTS.contentRecognition(content), 'contentRecognition');
      const result = JSON.parse(responseContent || '{}');
      
      const analysisResult: AIRecognitionResult = {
        type: result.type || 'task',
        summary: result.summary || content,
        confidence: result.confidence || 0.5,
        reasoning: result.reasoning || 'AI分析完成'
      };

      this.saveAnalysisRecord(content, analysisResult).catch(console.error);
      return analysisResult;

    } catch (error) {
      console.error('AI识别失败:', error);
      return this.fallbackRecognition(content);
    }
  }

  async analyzeTask(content: string, userGoals?: Goal[]): Promise<AITaskAnalysisResult> {
    try {
      // 构建目标上下文，将所有目标信息提供给AI
      const goalsContext = userGoals ? userGoals.map(goal => 
        `目标: ${goal.title} | 描述: ${goal.description || ''} | 分类: ${goal.category || ''} | 关键词: ${goal.keywords?.join(', ') || ''}`
      ).join('\n') : '';
      
      const prompt = `分析任务：${content}
${goalsContext ? `用户目标列表：\n${goalsContext}` : ''}

返回JSON：
{
  "priority": "low|medium|high",
  "estimatedTime": "时间",
  "category": "分类",
  "suggestions": ["建议"],
  "timeAnalysis": {
    "estimatedDuration": "2小时",
    "hasDeadline": false,
    "suggestedTimeframe": "工作日晚上"
  },
  "repetitionAnalysis": {
    "isRecurring": true,
    "frequency": "daily"
  },
  "goalAlignment": {
    "relatedGoals": [
      {
        "goalTitle": "目标标题",
        "alignmentScore": 0.85,
        "reasoning": "关联理由"
      }
    ]
  }
}`;

      const { content: responseContent } = await callAI({
        system: "任务分析专家，优化任务管理。请以JSON格式返回结果。",
        user: prompt,
        temperature: 0.3,
        maxTokens: 800
      }, 'taskAnalysis');
      
      const result = JSON.parse(responseContent || '{}');
      
      return {
        priority: result.priority || 'medium',
        estimatedTime: result.estimatedTime || '1小时',
        category: result.category || '其他',
        suggestions: result.suggestions || [],
        timeAnalysis: {
          estimatedDuration: result.timeAnalysis?.estimatedDuration || '1小时',
          hasDeadline: result.timeAnalysis?.hasDeadline || false,
          suggestedTimeframe: result.timeAnalysis?.suggestedTimeframe || '随时'
        },
        repetitionAnalysis: {
          isRecurring: result.repetitionAnalysis?.isRecurring || false,
          frequency: result.repetitionAnalysis?.frequency
        },
        goalAlignment: {
          relatedGoals: result.goalAlignment?.relatedGoals || []
        }
      };

    } catch (error) {
      console.error('任务分析失败:', error);
      return { 
        priority: 'medium', 
        estimatedTime: '1小时', 
        category: '其他', 
        suggestions: [],
        timeAnalysis: {
          estimatedDuration: '1小时',
          hasDeadline: false,
          suggestedTimeframe: '随时'
        },
        repetitionAnalysis: {
          isRecurring: false
        },
        goalAlignment: {
          relatedGoals: []
        }
      };
    }
  }

  async analyzeGoalAlignment(task: string, goals: string[]): Promise<{
    alignmentScore: number;
    alignedGoals: string[];
    suggestions: string[];
  }> {
    try {
      const { content: responseContent } = await callAI(PROMPTS.goalAlignment(task, goals), 'goalAlignment');
      const result = JSON.parse(responseContent || '{}');
      
      return {
        alignmentScore: result.alignmentScore || 0.5,
        alignedGoals: result.alignedGoals || [],
        suggestions: result.suggestions || []
      };

    } catch (error) {
      console.error('目标一致性分析失败:', error);
      return { alignmentScore: 0.5, alignedGoals: [], suggestions: [] };
    }
  }

  private async saveAnalysisRecord(content: string, result: AIRecognitionResult) {
    console.log('AI分析记录:', { content, result });
  }

  private fallbackRecognition(content: string): AIRecognitionResult {
    const lowerContent = content.toLowerCase();
    let type: 'task' | 'goal' | 'principle' = 'task';
    
    if (lowerContent.includes('目标') || lowerContent.includes('梦想') || lowerContent.includes('希望') || 
        lowerContent.includes('想要') || lowerContent.includes('计划') || lowerContent.includes('愿景') ||
        lowerContent.includes('学习') || lowerContent.includes('掌握') || lowerContent.includes('提升') ||
        lowerContent.includes('成为') || lowerContent.includes('实现') || lowerContent.includes('达到')) {
      type = 'goal';
    } else if (lowerContent.includes('原则') || lowerContent.includes('价值观') || lowerContent.includes('信念') ||
               lowerContent.includes('理念') || lowerContent.includes('准则') || lowerContent.includes('信条') ||
               lowerContent.includes('感觉') || lowerContent.includes('感悟') || lowerContent.includes('体会') ||
               lowerContent.includes('心得') || lowerContent.includes('启发') || lowerContent.includes('智慧')) {
      type = 'principle';
    }

    const typeText = type === 'task' ? '任务' : type === 'goal' ? '目标' : '心则';
    
    return {
      type,
      summary: `这是一个${typeText}，内容为：${content}`,
      confidence: 0.3,
      reasoning: '关键词匹配（AI服务不可用）'
    };
  }
}

// 导出单例实例
export const aiService = new AIService();
