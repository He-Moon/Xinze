'use client';

import { useState, useEffect } from 'react';
import { Tabs, Card, Button, Space, Typography, List, Tag, Empty, Input, Spin, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BulbOutlined } from '@ant-design/icons';
import { goalService, Goal } from '../../../shared/services/goalService';
import { principleService, Principle } from '../../../shared/services/principleService';
import styles from './GoalsAndPrinciples.module.css';

const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface GoalsAndPrinciplesProps {
  refreshTrigger?: number;
}

export default function GoalsAndPrinciples({ refreshTrigger }: GoalsAndPrinciplesProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [principles, setPrinciples] = useState<Principle[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [principlesLoading, setPrinciplesLoading] = useState(true);

  const [newGoal, setNewGoal] = useState('');
  const [newPrinciple, setNewPrinciple] = useState('');

  // 获取目标数据
  const fetchGoals = async () => {
    try {
      setGoalsLoading(true);
      console.log('🔍 开始获取目标数据...');
      const response = await goalService.getActiveGoals();
      console.log('📊 目标数据响应:', response);
      if (response.success && response.data) {
        setGoals(response.data.goals);
        console.log('✅ 目标数据获取成功:', response.data.goals.length, '个目标');
        console.log('📊 目标数据详情:', response.data.goals);
      } else {
        console.error('❌ 目标数据获取失败:', response);
        message.error('获取目标失败');
      }
    } catch (error) {
      console.error('❌ 获取目标失败:', error);
      message.error('获取目标失败，请稍后重试');
    } finally {
      setGoalsLoading(false);
    }
  };

  // 获取心则数据
  const fetchPrinciples = async () => {
    try {
      setPrinciplesLoading(true);
      console.log('🔍 开始获取心则数据...');
      const response = await principleService.getAllPrinciples();
      console.log('📊 心则数据响应:', response);
      if (response.success && response.data) {
        setPrinciples(response.data.principles);
        console.log('✅ 心则数据获取成功:', response.data.principles.length, '个心则');
      } else {
        console.error('❌ 心则数据获取失败:', response);
        message.error('获取心则失败');
      }
    } catch (error) {
      console.error('❌ 获取心则失败:', error);
      message.error('获取心则失败，请稍后重试');
    } finally {
      setPrinciplesLoading(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchGoals();
    fetchPrinciples();
  }, []);

  // 监听刷新触发器
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchGoals();
      fetchPrinciples();
    }
  }, [refreshTrigger]);

  const handleAddGoal = async () => {
    if (newGoal.trim()) {
      try {
        const response = await goalService.createGoal({
          title: newGoal.trim(),
          description: '',
          priority: 'medium'
        });
        
        if (response.success) {
          message.success('目标添加成功！');
          setNewGoal('');
          fetchGoals(); // 重新获取目标列表
        } else {
          message.error(response.message || '目标添加失败');
        }
      } catch (error) {
        console.error('添加目标失败:', error);
        message.error('添加目标失败，请稍后重试');
      }
    }
  };

  const handleAddPrinciple = async () => {
    if (newPrinciple.trim()) {
      try {
        const response = await principleService.createPrinciple({
          content: newPrinciple.trim(),
          description: '',
          weight: 5
        });
        
        if (response.success) {
          message.success('心则添加成功！');
          setNewPrinciple('');
          fetchPrinciples(); // 重新获取心则列表
        } else {
          message.error(response.message || '心则添加失败');
        }
      } catch (error) {
        console.error('添加心则失败:', error);
        message.error('添加心则失败，请稍后重试');
      }
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
              {goalsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: '16px' }}>加载目标中...</div>
                </div>
              ) : goals.length > 0 ? (
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
              {principlesLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: '16px' }}>加载心则中...</div>
                </div>
              ) : principles.length > 0 ? (
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
