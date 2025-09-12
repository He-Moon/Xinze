'use client';

import { useState, useEffect, useRef } from 'react';
import { Input, Button, Card, Space, Typography, App, message, Divider, Tag, Select } from 'antd';
import { PlusOutlined, RobotOutlined, EditOutlined, CheckOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { captureService, CreateCaptureRequest } from '../../../shared/services/captureService';
import { taskService, CreateTaskRequest } from '../../../shared/services/taskService';
import { goalService, CreateGoalRequest } from '../../../shared/services/goalService';
import { principleService, CreatePrincipleRequest } from '../../../shared/services/principleService';
import styles from './QuickCapture.module.css';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

interface AIRecognitionResult {
  type: 'task' | 'goal' | 'principle';
  summary: string;
  confidence?: number;
  reasoning?: string;
}

interface QuickCaptureProps {
  onTaskCreated?: () => void;
  onGoalCreated?: () => void;
  onPrincipleCreated?: () => void;
}

export default function QuickCapture({ onTaskCreated, onGoalCreated, onPrincipleCreated }: QuickCaptureProps) {
  const [content, setContent] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<AIRecognitionResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResult, setEditedResult] = useState<AIRecognitionResult | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const { message } = App.useApp();

  // 倒计时自动保存
  useEffect(() => {
    if (recognitionResult && !isEditing && !isAutoSaving) {
      setCountdown(10);
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            handleAutoSave();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [recognitionResult, isEditing, isAutoSaving]);

  // 自动保存
  const handleAutoSave = async () => {
    if (!recognitionResult) return;

    try {
      setIsAutoSaving(true);
      
      const finalResult = isEditing ? editedResult! : recognitionResult;
      console.log('🔍 QuickCapture - 自动保存 - 最终识别结果:', finalResult);
      console.log('🔍 QuickCapture - 自动保存 - 类型检查:', {
        type: finalResult.type,
        typeOf: typeof finalResult.type,
        isTask: finalResult.type === 'task',
        isGoal: finalResult.type === 'goal',
        isPrinciple: finalResult.type === 'principle'
      });
      
      // 根据识别结果决定保存方式
      if (finalResult.type === 'task') {
        // 保存为任务
        const taskData: CreateTaskRequest = {
          title: content.trim(),
          description: finalResult.summary,
          type: 'task',
          priority: 'medium'
        };

        const result = await taskService.createTask(taskData);
        
        if (result.success) {
          message.success('任务已自动保存！');
          // 通知父组件任务已创建
          onTaskCreated?.();
          // 重置所有状态
          setContent('');
          setRecognitionResult(null);
          setEditedResult(null);
          setIsEditing(false);
          setCountdown(10);
        } else {
          message.error(result.message || '任务保存失败');
        }
      } else if (finalResult.type === 'goal') {
        // 保存为目标
        const goalData: CreateGoalRequest = {
          title: content.trim(),
          description: finalResult.summary,
          priority: 'medium'
        };

        console.log('🔍 QuickCapture - 创建目标数据:', goalData);
        const result = await goalService.createGoal(goalData);
        console.log('📊 QuickCapture - 目标创建响应:', result);
        
        if (result.success) {
          message.success('目标已自动保存！');
          // 通知父组件目标已创建
          onGoalCreated?.();
          // 重置所有状态
          setContent('');
          setRecognitionResult(null);
          setEditedResult(null);
          setIsEditing(false);
          setCountdown(10);
        } else {
          message.error(result.message || '目标保存失败');
        }
      } else if (finalResult.type === 'principle') {
        // 保存为心则
        console.log('🔍 QuickCapture - 自动保存 - 进入心则保存分支');
        const principleData: CreatePrincipleRequest = {
          content: content.trim(),
          description: finalResult.summary,
          weight: 5
        };

        console.log('🔍 QuickCapture - 创建心则数据:', principleData);
        const result = await principleService.createPrinciple(principleData);
        console.log('📊 QuickCapture - 心则创建响应:', result);
        
        if (result.success) {
          message.success('心则已自动保存！');
          // 通知父组件心则已创建
          onPrincipleCreated?.();
          // 重置所有状态
          setContent('');
          setRecognitionResult(null);
          setEditedResult(null);
          setIsEditing(false);
          setCountdown(10);
        } else {
          message.error(result.message || '心则保存失败');
        }
      } else {
        // 保存为快速捕捉记录
      const captureData: CreateCaptureRequest = {
        content: content.trim(),
        type: finalResult.type,
        tags: [],
        priority: 'medium'
      };

      const result = await captureService.createCapture(captureData);
      
      if (result.success) {
        message.success('已自动保存！');
        // 重置所有状态
        setContent('');
        setRecognitionResult(null);
        setEditedResult(null);
        setIsEditing(false);
        setCountdown(10);
      } else {
        message.error(result.message || '自动保存失败');
        }
      }
    } catch (error) {
      console.error('自动保存失败:', error);
      message.error('自动保存失败，请稍后重试');
    } finally {
      setIsAutoSaving(false);
    }
  };

  // AI识别功能 - 调用真实API
  const handleAIRecognition = async () => {
    if (!content.trim()) {
      message.warning('请输入内容');
      return;
    }

    try {
      setIsRecognizing(true);
      
      const result = await captureService.recognizeContent(content.trim());
      
      if (result.success && result.data) {
        setRecognitionResult(result.data);
        setEditedResult(result.data);
        message.success('AI识别完成！');
      } else {
        message.error(result.message || 'AI识别失败');
      }
    } catch (error) {
      console.error('AI识别失败:', error);
      message.error('AI识别失败，请稍后重试');
    } finally {
      setIsRecognizing(false);
    }
  };


  // 手动保存
  const handleSave = async () => {
    if (!recognitionResult) return;

    try {
      setIsSubmitting(true);
      
      // 停止倒计时
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      
      const finalResult = isEditing ? editedResult! : recognitionResult;
      console.log('🔍 QuickCapture - 手动保存 - 最终识别结果:', finalResult);
      console.log('🔍 QuickCapture - 手动保存 - 类型检查:', {
        type: finalResult.type,
        typeOf: typeof finalResult.type,
        isTask: finalResult.type === 'task',
        isGoal: finalResult.type === 'goal',
        isPrinciple: finalResult.type === 'principle'
      });
      
      // 根据识别结果决定保存方式
      if (finalResult.type === 'task') {
        // 保存为任务
        const taskData: CreateTaskRequest = {
          title: content.trim(),
          description: finalResult.summary,
          type: 'task',
          priority: 'medium'
        };

        const result = await taskService.createTask(taskData);
        
        if (result.success) {
          message.success('任务保存成功！');
          // 通知父组件任务已创建
          onTaskCreated?.();
          // 重置所有状态
          setContent('');
          setRecognitionResult(null);
          setEditedResult(null);
          setIsEditing(false);
          setCountdown(10);
        } else {
          message.error(result.message || '任务保存失败');
        }
      } else if (finalResult.type === 'goal') {
        // 保存为目标
        const goalData: CreateGoalRequest = {
          title: content.trim(),
          description: finalResult.summary,
          priority: 'medium'
        };

        const result = await goalService.createGoal(goalData);
        
        if (result.success) {
          message.success('目标保存成功！');
          // 通知父组件目标已创建
          onGoalCreated?.();
          // 重置所有状态
          setContent('');
          setRecognitionResult(null);
          setEditedResult(null);
          setIsEditing(false);
          setCountdown(10);
        } else {
          message.error(result.message || '目标保存失败');
        }
      } else if (finalResult.type === 'principle') {
        // 保存为心则
        console.log('🔍 QuickCapture - 手动保存 - 进入心则保存分支');
        const principleData: CreatePrincipleRequest = {
          content: content.trim(),
          description: finalResult.summary,
          weight: 5
        };

        const result = await principleService.createPrinciple(principleData);
        
        if (result.success) {
          message.success('心则保存成功！');
          // 通知父组件心则已创建
          onPrincipleCreated?.();
          // 重置所有状态
          setContent('');
          setRecognitionResult(null);
          setEditedResult(null);
          setIsEditing(false);
          setCountdown(10);
        } else {
          message.error(result.message || '心则保存失败');
        }
      } else {
        // 保存为快速捕捉记录
      const captureData: CreateCaptureRequest = {
        content: content.trim(),
        type: finalResult.type,
        tags: [],
        priority: 'medium'
      };

      const result = await captureService.createCapture(captureData);
      
      if (result.success) {
        message.success('保存成功！');
        // 重置所有状态
        setContent('');
        setRecognitionResult(null);
        setEditedResult(null);
        setIsEditing(false);
        setCountdown(10);
      } else {
        message.error(result.message || '保存失败');
        }
      }
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 开始编辑
  const handleEdit = () => {
    // 停止倒计时
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setIsEditing(true);
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!editedResult) return;

    try {
      setIsSubmitting(true);
      
      // 停止倒计时
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      
      // 根据识别结果决定保存方式
      if (editedResult.type === 'task') {
        // 保存为任务
        const taskData: CreateTaskRequest = {
          title: content.trim(),
          description: editedResult.summary,
          type: 'task',
          priority: 'medium'
        };

        const result = await taskService.createTask(taskData);
        
        if (result.success) {
          message.success('任务保存成功！');
          // 通知父组件任务已创建
          onTaskCreated?.();
          // 重置所有状态
          setContent('');
          setRecognitionResult(null);
          setEditedResult(null);
          setIsEditing(false);
          setCountdown(10);
        } else {
          message.error(result.message || '任务保存失败');
        }
      } else if (editedResult.type === 'goal') {
        // 保存为目标
        const goalData: CreateGoalRequest = {
          title: content.trim(),
          description: editedResult.summary,
          priority: 'medium'
        };

        const result = await goalService.createGoal(goalData);
        
        if (result.success) {
          message.success('目标保存成功！');
          // 通知父组件目标已创建
          onGoalCreated?.();
          // 重置所有状态
          setContent('');
          setRecognitionResult(null);
          setEditedResult(null);
          setIsEditing(false);
          setCountdown(10);
        } else {
          message.error(result.message || '目标保存失败');
        }
      } else if (editedResult.type === 'principle') {
        // 保存为心则
        const principleData: CreatePrincipleRequest = {
          content: content.trim(),
          description: editedResult.summary,
          weight: 5
        };

        const result = await principleService.createPrinciple(principleData);
        
        if (result.success) {
          message.success('心则保存成功！');
          // 通知父组件心则已创建
          onPrincipleCreated?.();
          // 重置所有状态
          setContent('');
          setRecognitionResult(null);
          setEditedResult(null);
          setIsEditing(false);
          setCountdown(10);
        } else {
          message.error(result.message || '心则保存失败');
        }
      } else {
        // 保存为快速捕捉记录
      const captureData: CreateCaptureRequest = {
        content: content.trim(),
        type: editedResult.type,
        tags: [],
        priority: 'medium'
      };

      const result = await captureService.createCapture(captureData);
      
      if (result.success) {
        message.success('保存成功！');
        // 重置所有状态
        setContent('');
        setRecognitionResult(null);
        setEditedResult(null);
        setIsEditing(false);
        setCountdown(10);
      } else {
        message.error(result.message || '保存失败');
        }
      }
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedResult(recognitionResult);
  };

  // 更新编辑结果
  const updateEditedResult = (field: keyof AIRecognitionResult, value: any) => {
    setEditedResult(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>快速捕捉</Title>
        <Text className={styles.subtitle}>记录想法，AI智能识别</Text>
        <Text type="secondary" style={{ fontSize: '14px', marginTop: '8px', display: 'block' }}>
          💡 提供更多上下文信息（如原因、背景、目标）能帮助AI做出更准确的判断
        </Text>
      </div>

      <Card className={styles.inputCard}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 输入区域 */}
          <div className={styles.inputSection}>
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`记录你的想法、任务、感悟...

💡 可包含更多信息：原因、背景、目标等

例如：
📋 学习TypeScript，因为项目需要重构
🔗 https://example.com 这个设计很棒，想学习
💭 严肃性和深度是解压的最好方式——项飙`}
              autoSize={{ minRows: 6, maxRows: 10 }}
              className={styles.textArea}
              disabled={isRecognizing || isSubmitting}
            />
          </div>

          {/* AI识别按钮 */}
          {!recognitionResult && (
            <Button
              type="primary"
              icon={<RobotOutlined />}
              onClick={handleAIRecognition}
              size="large"
              block
              loading={isRecognizing}
              disabled={!content.trim() || isRecognizing}
              className={styles.recognizeButton}
            >
              {isRecognizing ? 'AI识别中...' : 'AI识别'}
            </Button>
          )}

          {/* AI识别结果展示 */}
          {recognitionResult && !isEditing && (
            <Card className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <Space>
                  <RobotOutlined className={styles.aiIcon} />
                  <Text strong>AI识别结果</Text>
                  {!isAutoSaving && (
                    <Space>
                      <ClockCircleOutlined />
                      <Text type="secondary">{countdown}秒后自动保存</Text>
                    </Space>
                  )}
                </Space>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                  size="small"
                >
                  修改
                </Button>
              </div>
              
              <Divider />
              
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div className={styles.resultItem}>
                  <Text strong>类型：</Text>
                  <Tag color={recognitionResult.type === 'task' ? 'blue' : recognitionResult.type === 'goal' ? 'green' : 'purple'}>
                    {recognitionResult.type === 'task' ? '任务' : recognitionResult.type === 'goal' ? '目标' : '心则'}
                  </Tag>
                  {recognitionResult.confidence && (
                    <Tag 
                      color={recognitionResult.confidence > 0.8 ? 'green' : recognitionResult.confidence > 0.6 ? 'orange' : 'red'}
                      style={{ marginLeft: 8 }}
                    >
                      置信度: {Math.round(recognitionResult.confidence * 100)}%
                    </Tag>
                  )}
                </div>
                
                <div className={styles.resultItem}>
                  <Text strong>摘要：</Text>
                  <Text>{recognitionResult.summary}</Text>
                </div>

                {recognitionResult.reasoning && (
                  <div className={styles.resultItem}>
                    <Text strong>分析理由：</Text>
                    <Text type="secondary" style={{ fontStyle: 'italic' }}>
                      {recognitionResult.reasoning}
                    </Text>
                  </div>
                )}
              </Space>
              
              <Divider />
              
              <Space>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleSave}
                  loading={isSubmitting || isAutoSaving}
                  disabled={isSubmitting || isAutoSaving}
                >
                  {isAutoSaving ? '自动保存中...' : '立即保存'}
                </Button>
                <Button onClick={() => {
                  setRecognitionResult(null);
                  setEditedResult(null);
                }}>
                  重新输入
                </Button>
              </Space>
            </Card>
          )}

          {/* 编辑模式 */}
          {isEditing && editedResult && (
            <Card className={styles.editCard}>
              <div className={styles.resultHeader}>
                <Space>
                  <EditOutlined />
                  <Text strong>编辑识别结果</Text>
                </Space>
              </div>
              
              <Divider />
              
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div className={styles.editItem}>
                  <Text strong>类型：</Text>
                  <Select
                    value={editedResult.type}
                    onChange={(value) => updateEditedResult('type', value)}
                    style={{ minWidth: 120 }}
                  >
                    <Option value="task">任务</Option>
                    <Option value="goal">目标</Option>
                    <Option value="principle">心则</Option>
                  </Select>
                </div>
                
                <div className={styles.editItem}>
                  <Text strong>摘要：</Text>
                  <TextArea
                    value={editedResult.summary}
                    onChange={(e) => updateEditedResult('summary', e.target.value)}
                    placeholder="请输入摘要"
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    style={{ width: '100%' }}
                  />
                </div>
              </Space>
              
              <Divider />
              
              <Space>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleSaveEdit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '保存中...' : '保存'}
                </Button>
                <Button onClick={handleCancelEdit}>
                  取消
                </Button>
              </Space>
            </Card>
          )}
        </Space>
      </Card>
    </div>
  );
}
