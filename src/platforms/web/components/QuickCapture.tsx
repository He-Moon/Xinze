'use client';

import { useState } from 'react';
import { Input, Button, Select, Card, Space, Typography, App, message } from 'antd';
import { PlusOutlined, AudioOutlined, LinkOutlined, TagOutlined } from '@ant-design/icons';
import { captureService, CreateCaptureRequest } from '../../../shared/services/captureService';
import styles from './QuickCapture.module.css';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

export default function QuickCapture() {
  const [content, setContent] = useState('');
  const [type, setType] = useState<'task' | 'goal' | 'principle'>('task');
  const [tags, setTags] = useState<string[]>([]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message } = App.useApp();

  const handleSubmit = async () => {
    if (!content.trim()) {
      message.warning('请输入内容');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const captureData: CreateCaptureRequest = {
        content: content.trim(),
        type,
        tags,
        priority
      };

      const result = await captureService.createCapture(captureData);
      
      if (result.success) {
        message.success('快速保存成功！');
        // 清空表单
        setContent('');
        setTags([]);
        setPriority('medium');
        setType('task');
      } else {
        message.error(result.message || '保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoiceInput = () => {
    // TODO: 实现语音转文字功能
    console.log('开始语音输入');
  };

  const handleLinkInput = () => {
    // TODO: 实现链接解析功能
    console.log('开始链接输入');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>快速捕捉</Title>
        <Text className={styles.subtitle}>记录想法，避免思路中断</Text>
      </div>

      <Card className={styles.inputCard}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className={styles.inputSection}>
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="记录你的想法、任务、感悟..."
              autoSize={{ minRows: 4, maxRows: 8 }}
              className={styles.textArea}
            />
          </div>

          <div className={styles.actions}>
            <Space wrap>
              <Button
                icon={<AudioOutlined />}
                onClick={handleVoiceInput}
                className={styles.actionButton}
              >
                语音输入
              </Button>
              <Button
                icon={<LinkOutlined />}
                onClick={handleLinkInput}
                className={styles.actionButton}
              >
                链接解析
              </Button>
            </Space>
          </div>

          <div className={styles.selectionRow}>
            <Space size="large" wrap>
              <div className={styles.typeSelection}>
                <Space align="center">
                  <Text strong>类型：</Text>
                  <Select
                    value={type}
                    onChange={setType}
                    className={styles.typeSelect}
                  >
                    <Option value="task">任务</Option>
                    <Option value="goal">目标</Option>
                    <Option value="principle">心则</Option>
                  </Select>
                </Space>
              </div>

              <div className={styles.prioritySelection}>
                <Space align="center">
                  <Text strong>优先级：</Text>
                  <Select
                    value={priority}
                    onChange={setPriority}
                    className={styles.prioritySelect}
                  >
                    <Option value="low">低</Option>
                    <Option value="medium">中</Option>
                    <Option value="high">高</Option>
                  </Select>
                </Space>
              </div>
            </Space>
          </div>

          <div className={styles.tagsSection}>
            <Space align="center">
              <TagOutlined className={styles.tagIcon} />
              <Text>标签：</Text>
              <Select
                mode="tags"
                value={tags}
                onChange={setTags}
                placeholder="添加标签"
                className={styles.tagsSelect}
              />
            </Space>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleSubmit}
            size="large"
            block
            loading={isSubmitting}
            disabled={!content.trim() || isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? '保存中...' : '快速保存'}
          </Button>
        </Space>
      </Card>
    </div>
  );
}
