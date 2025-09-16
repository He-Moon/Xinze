'use client';

import { useState } from 'react';
import { Input, Button, Space, Typography, App, message } from 'antd';
import { PlusOutlined, CheckOutlined, AimOutlined, BulbOutlined, ReloadOutlined } from '@ant-design/icons';
import { taskService, CreateTaskRequest } from '../../../shared/services/taskService';
import { goalService, CreateGoalRequest } from '../../../shared/services/goalService';
import { principleService, CreatePrincipleRequest } from '../../../shared/services/principleService';
import styles from './QuickCapture.module.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

// 快速捕捉数据类型
type CaptureType = 'task' | 'goal' | 'principle';

interface QuickCaptureProps {
  onTaskCreated?: () => void;
  onGoalCreated?: () => void;
  onPrincipleCreated?: () => void;
}

export default function QuickCapture({ onTaskCreated, onGoalCreated, onPrincipleCreated }: QuickCaptureProps) {
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState<CaptureType>('task');
  const [isSaving, setIsSaving] = useState(false);
  const { message } = App.useApp();

  // 保存数据
  const handleSave = async () => {
    if (!content.trim()) {
      message.warning('请输入内容');
      return;
    }


    try {
      setIsSaving(true);

      switch (selectedType) {
        case 'task':
          const taskData: CreateTaskRequest = {
            title: content.trim(),
            content: content.trim(),
            priority: 'medium'
          };
          const taskResponse = await taskService.createTask(taskData);
          if (taskResponse.success) {
            message.success('任务创建成功');
            onTaskCreated?.();
          } else {
            message.error('任务创建失败');
          }
          break;

        case 'goal':
          const goalData: CreateGoalRequest = {
            title: content.trim(),
            description: content.trim()
          };
          const goalResponse = await goalService.createGoal(goalData);
          if (goalResponse.success) {
            message.success('目标创建成功');
            onGoalCreated?.();
          } else {
            message.error('目标创建失败');
          }
          break;

        case 'principle':
          const principleData: CreatePrincipleRequest = {
            content: content.trim(),
            weight: 5
          };
          const principleResponse = await principleService.createPrinciple(principleData);
          if (principleResponse.success) {
            message.success('心则创建成功');
            onPrincipleCreated?.();
          } else {
            message.error('心则创建失败');
          }
          break;
      }

      // 重置表单
      setContent('');
      setSelectedType('task');
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 重新录入
  const handleReset = () => {
    if (!content.trim()) {
      message.warning('没有内容需要重新录入');
      return;
    }
    setContent('');
    setSelectedType('task');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Title level={2} className={styles.title}>快速捕捉</Title>
          <Text className={styles.subtitle}>记录想法、任务和目标</Text>
        </div>

        <div className={styles.typeSelection}>
          <Button
            type={selectedType === 'task' ? 'primary' : 'default'}
            icon={<CheckOutlined />}
            onClick={() => setSelectedType('task')}
            className={styles.typeButton}
            size="small"
          >
            任务
          </Button>
          <Button
            type={selectedType === 'goal' ? 'primary' : 'default'}
            icon={<AimOutlined />}
            onClick={() => setSelectedType('goal')}
            className={styles.typeButton}
            size="small"
          >
            目标
          </Button>
          <Button
            type={selectedType === 'principle' ? 'primary' : 'default'}
            icon={<BulbOutlined />}
            onClick={() => setSelectedType('principle')}
            className={styles.typeButton}
            size="small"
          >
            心则
          </Button>
        </div>

        <div className={styles.inputSection}>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在这里输入您想要记录的内容..."
            className={styles.textArea}
            autoSize={{ minRows: 6, maxRows: 10 }}
            maxLength={500}
            showCount
          />
        </div>

        <div className={styles.actions}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleSave}
            loading={isSaving}
            className={styles.saveButton}
          >
            保存
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
            className={styles.resetButton}
          >
            重新录入
          </Button>
        </div>
      </div>
    </div>
  );
}
