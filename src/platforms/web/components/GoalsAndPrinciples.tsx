'use client';

import { useState } from 'react';
import { Tabs, Card, Button, Space, Typography, List, Tag, Empty, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BulbOutlined, TargetOutlined } from '@ant-design/icons';
import styles from './GoalsAndPrinciples.module.css';

const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'long-term' | 'stage' | 'sub';
  status: 'active' | 'completed' | 'paused';
  deadline?: string;
  progress: number;
}

interface Principle {
  id: string;
  content: string;
  tags: string[];
  source: 'personal' | 'quote' | 'insight';
  createdAt: string;
}

export default function GoalsAndPrinciples() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: '提升专业技能',
      description: '深入学习前端技术，掌握最新框架和工具',
      type: 'long-term',
      status: 'active',
      deadline: '2024-12-31',
      progress: 60
    },
    {
      id: '2',
      title: '完成项目重构',
      description: '将现有项目迁移到新的技术栈',
      type: 'stage',
      status: 'active',
      deadline: '2024-03-31',
      progress: 30
    }
  ]);

  const [principles, setPrinciples] = useState<Principle[]>([
    {
      id: '1',
      content: '保持学习的心态，每天进步一点点',
      tags: ['成长', '学习'],
      source: 'personal',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      content: '代码是写给人看的，不是写给机器看的',
      tags: ['编程', '工作方式'],
      source: 'quote',
      createdAt: '2024-01-10'
    }
  ]);

  const [newGoal, setNewGoal] = useState('');
  const [newPrinciple, setNewPrinciple] = useState('');

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal,
        description: '',
        type: 'long-term',
        status: 'active',
        progress: 0
      };
      setGoals([...goals, goal]);
      setNewGoal('');
    }
  };

  const handleAddPrinciple = () => {
    if (newPrinciple.trim()) {
      const principle: Principle = {
        id: Date.now().toString(),
        content: newPrinciple,
        tags: [],
        source: 'personal',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPrinciples([...principles, principle]);
      setNewPrinciple('');
    }
  };

  const getGoalTypeText = (type: string) => {
    switch (type) {
      case 'long-term': return '长期目标';
      case 'stage': return '阶段目标';
      case 'sub': return '子目标';
      default: return '目标';
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'blue';
      case 'completed': return 'green';
      case 'paused': return 'orange';
      default: return 'default';
    }
  };

  const getGoalStatusText = (status: string) => {
    switch (status) {
      case 'active': return '进行中';
      case 'completed': return '已完成';
      case 'paused': return '暂停';
      default: return '未知';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>目标与心则</Title>
        <Text className={styles.subtitle}>规划未来，沉淀智慧</Text>
      </div>

      <Tabs defaultActiveKey="goals" className={styles.tabs}>
        <TabPane tab="目标" key="goals">
          <div className={styles.content}>
            <div className={styles.addSection}>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="添加新目标..."
                  className={styles.addInput}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddGoal}
                  className={styles.addButton}
                >
                  添加
                </Button>
              </Space.Compact>
            </div>

            <div className={styles.goalsList}>
              {goals.length > 0 ? (
                <List
                  dataSource={goals}
                  renderItem={(goal) => (
                    <List.Item>
                      <Card className={styles.goalCard}>
                        <div className={styles.goalHeader}>
                          <div className={styles.goalInfo}>
                            <Title level={4} className={styles.goalTitle}>
                              {goal.title}
                            </Title>
                            <Space>
                              <Tag color={getGoalStatusColor(goal.status)}>
                                {getGoalStatusText(goal.status)}
                              </Tag>
                              <Tag>{getGoalTypeText(goal.type)}</Tag>
                              {goal.deadline && (
                                <Text type="secondary">截止: {goal.deadline}</Text>
                              )}
                            </Space>
                          </div>
                          <Space>
                            <Button
                              type="text"
                              icon={<EditOutlined />}
                              className={styles.actionButton}
                            />
                            <Button
                              type="text"
                              icon={<DeleteOutlined />}
                              className={styles.actionButton}
                            />
                          </Space>
                        </div>
                        {goal.description && (
                          <Paragraph className={styles.goalDescription}>
                            {goal.description}
                          </Paragraph>
                        )}
                        <div className={styles.goalProgress}>
                          <Text type="secondary">进度: {goal.progress}%</Text>
                          <div className={styles.progressBar}>
                            <div 
                              className={styles.progressFill}
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty
                  description="还没有目标"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </div>
          </div>
        </TabPane>

        <TabPane tab="心则池" key="principles">
          <div className={styles.content}>
            <div className={styles.addSection}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <TextArea
                  value={newPrinciple}
                  onChange={(e) => setNewPrinciple(e.target.value)}
                  placeholder="记录你的感悟、摘抄、灵感..."
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  className={styles.addTextArea}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddPrinciple}
                  className={styles.addButton}
                >
                  添加心则
                </Button>
              </Space>
            </div>

            <div className={styles.principlesList}>
              {principles.length > 0 ? (
                <List
                  dataSource={principles}
                  renderItem={(principle) => (
                    <List.Item>
                      <Card className={styles.principleCard}>
                        <div className={styles.principleHeader}>
                          <div className={styles.principleInfo}>
                            <Paragraph className={styles.principleContent}>
                              {principle.content}
                            </Paragraph>
                            <Space wrap>
                              {principle.tags.map(tag => (
                                <Tag key={tag} color="blue">{tag}</Tag>
                              ))}
                              <Text type="secondary" className={styles.principleDate}>
                                {principle.createdAt}
                              </Text>
                            </Space>
                          </div>
                          <Space>
                            <Button
                              type="text"
                              icon={<EditOutlined />}
                              className={styles.actionButton}
                            />
                            <Button
                              type="text"
                              icon={<DeleteOutlined />}
                              className={styles.actionButton}
                            />
                          </Space>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty
                  description="还没有心则"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}
