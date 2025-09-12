import OpenAI from 'openai';

// AI配置
export interface AIConfig {
  provider: 'deepseek' | 'openai' | 'anthropic';
  apiKey: string;
  baseURL?: string;
  model: string;
}

// AI响应解析结果
export interface AIParseResult {
  content: string;
}

// 提示词配置
export interface PromptConfig {
  system: string;
  user: string;
  temperature: number;
  maxTokens: number;
  model?: string; // 可选，覆盖默认模型
}

// AI场景类型
export type AIScenario = 'contentRecognition' | 'taskAnalysis' | 'goalAlignment' | 'general';

// 获取AI配置
export function getAIConfig(provider: string = 'deepseek'): AIConfig {
  switch (provider) {
    case 'deepseek':
      return {
        provider: 'deepseek',
        apiKey: process.env.DEEPSEEK_API_KEY || '',
        baseURL: process.env.DEEPSEEK_BASE_URL,
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat'
      };
    case 'openai':
      return {
        provider: 'openai',
        apiKey: process.env.OPENAI_API_KEY || '',
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
      };
    case 'anthropic':
      return {
        provider: 'anthropic',
        apiKey: process.env.ANTHROPIC_API_KEY || '',
        model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229'
      };
    default:
      return {
        provider: 'deepseek',
        apiKey: process.env.DEEPSEEK_API_KEY || '',
        baseURL: process.env.DEEPSEEK_BASE_URL,
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat'
      };
  }
}

// 场景化模型配置
export const SCENARIO_MODELS: Record<AIScenario, { provider: string; model: string }> = {
  contentRecognition: {
    provider: process.env.CONTENT_RECOGNITION_PROVIDER || 'deepseek',
    model: process.env.CONTENT_RECOGNITION_MODEL || 'deepseek-chat'
  },
  taskAnalysis: {
    provider: process.env.TASK_ANALYSIS_PROVIDER || 'deepseek',
    model: process.env.TASK_ANALYSIS_MODEL || 'deepseek-chat'
  },
  goalAlignment: {
    provider: process.env.GOAL_ALIGNMENT_PROVIDER || 'deepseek',
    model: process.env.GOAL_ALIGNMENT_MODEL || 'deepseek-chat'
  },
  general: {
    provider: process.env.AI_PROVIDER || 'deepseek',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat'
  }
};

// 解析AI响应
export function parseAIResponse(response: any): AIParseResult {
  const message = response.choices?.[0]?.message;
  if (!message) throw new Error('无效的AI响应格式');

  if (message.reasoning_content) {
    return { content: message.content || '' };
  }
  if (message.text) return { content: message.text };
  if (message.content) return { content: message.content };
  if (typeof message === 'string') return { content: message };
  if (typeof response === 'string') return { content: response };

  throw new Error('无法解析AI响应格式');
}

// 提示词配置
export const PROMPTS = {
  contentRecognition: (content: string): PromptConfig => {
    const scenario = SCENARIO_MODELS.contentRecognition;
    return {
      system: "智能内容分析助手，准确判断内容类型。请以JSON格式返回结果。",
      user: `分析内容类型：${content}
类型：task(任务) | goal(目标) | principle(心则)
返回JSON：{"type":"task|goal|principle","summary":"摘要","confidence":0.85,"reasoning":"理由"}`,
      temperature: 0.3,
      maxTokens: 500,
      model: scenario.model
    };
  },

  taskAnalysis: (content: string, userGoals?: string[]): PromptConfig => {
    const goalsContext = userGoals ? `用户目标：${userGoals.join(', ')}` : '';
    const scenario = SCENARIO_MODELS.taskAnalysis;
    return {
      system: "任务分析专家，优化任务管理。请以JSON格式返回结果。",
      user: `分析任务：${content}${goalsContext}
返回JSON：{"priority":"low|medium|high","estimatedTime":"时间","category":"分类","suggestions":["建议"]}`,
      temperature: 0.3,
      maxTokens: 500,
      model: scenario.model
    };
  },

  goalAlignment: (task: string, goals: string[]): PromptConfig => {
    const scenario = SCENARIO_MODELS.goalAlignment;
    return {
      system: "目标管理专家，分析任务与目标一致性。请以JSON格式返回结果。",
      user: `分析任务与目标一致性：
任务：${task}
目标：${goals.join(', ')}
返回JSON：{"alignmentScore":0.85,"alignedGoals":["目标"],"suggestions":["建议"]}`,
      temperature: 0.3,
      maxTokens: 500,
      model: scenario.model
    };
  }
};

// 获取场景对应的AI客户端
function getAIClient(scenario: AIScenario): OpenAI {
  const scenarioConfig = SCENARIO_MODELS[scenario];
  const aiConfig = getAIConfig(scenarioConfig.provider);
  
  return new OpenAI({
    apiKey: aiConfig.apiKey,
    baseURL: aiConfig.baseURL,
  });
}

// 通用AI调用函数
export async function callAI(promptConfig: PromptConfig, scenario: AIScenario = 'general') {
  const client = getAIClient(scenario);
  const scenarioConfig = SCENARIO_MODELS[scenario];
  
  // 使用场景指定的模型，或promptConfig中的模型
  const model = promptConfig.model || scenarioConfig.model;
  
  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: promptConfig.system },
      { role: "user", content: promptConfig.user }
    ],
    temperature: promptConfig.temperature,
    max_tokens: promptConfig.maxTokens,
    response_format: { type: 'json_object' }
  });

  return parseAIResponse(response);
}

/**
 * 环境变量配置说明
 * 
 * .env.local 中需要配置的变量：
 * 
 * # 通用AI配置
 * AI_PROVIDER=deepseek  # 默认供应商
 * 
 * # DeepSeek配置
 * DEEPSEEK_API_KEY=your_api_key
 * DEEPSEEK_BASE_URL=https://api.deepseek.com
 * DEEPSEEK_MODEL=deepseek-chat
 * 
 * # OpenAI配置
 * OPENAI_API_KEY=your_api_key
 * OPENAI_MODEL=gpt-3.5-turbo
 * 
 * # Anthropic配置
 * ANTHROPIC_API_KEY=your_api_key
 * ANTHROPIC_MODEL=claude-3-sonnet-20240229
 * 
 * # 场景化配置（可选，覆盖默认配置）
 * CONTENT_RECOGNITION_PROVIDER=deepseek
 * CONTENT_RECOGNITION_MODEL=deepseek-chat
 * 
 * TASK_ANALYSIS_PROVIDER=openai
 * TASK_ANALYSIS_MODEL=gpt-3.5-turbo
 * 
 * GOAL_ALIGNMENT_PROVIDER=anthropic
 * GOAL_ALIGNMENT_MODEL=claude-3-sonnet-20240229
 */
