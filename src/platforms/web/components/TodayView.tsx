'use client';

import { useState, useEffect } from 'react';
import { Card, Checkbox, Button, Space, Typography, Divider, Empty, Spin, message } from 'antd';
import { ClockCircleOutlined, PlusOutlined, CheckOutlined, EditOutlined } from '@ant-design/icons';
import styles from './TodayView.module.css';
import { taskService, Task } from '../../../shared/services/taskService';

const { Title, Text } = Typography;

interface TodayViewProps {
  refreshTrigger?: number;
}

export default function TodayView({ refreshTrigger }: TodayViewProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 获取任务数据
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTodayTasks();
      if (response.success && response.data) {
        setTasks(response.data.tasks);
      } else {
        message.error('获取任务失败');
      }
    } catch (error) {
      console.error('获取任务失败:', error);
      message.error('获取任务失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 刷新任务数据
  const refreshTasks = async () => {
    try {
      setRefreshing(true);
      const response = await taskService.getTodayTasks();
      if (response.success && response.data) {
        setTasks(response.data.tasks);
        message.success('任务已刷新');
      } else {
        message.error('刷新任务失败');
      }
    } catch (error) {
      console.error('刷新任务失败:', error);
      message.error('刷新任务失败，请稍后重试');
    } finally {
      setRefreshing(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchTasks();
  }, []);

  // 监听刷新触发器
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchTasks();
    }
  }, [refreshTrigger]);

  const handleTaskToggle = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const newStatus = task.completed ? 'pending' : 'completed';
      const response = await taskService.updateTask(id, { status: newStatus });
      
      if (response.success) {
        setTasks(tasks.map(task => 
          task.id === id ? { ...task, completed: !task.completed, status: newStatus } : task
        ));
        message.success(task.completed ? '任务已标记为未完成' : '任务已完成');
      } else {
        message.error('更新任务状态失败');
      }
    } catch (error) {
      console.error('更新任务状态失败:', error);
      message.error('更新任务状态失败，请稍后重试');
    }
  };

  const handleAddTask = () => {
    // TODO: 实现添加任务功能
    console.log('添加新任务');
  };

  const handleReview = () => {
    // TODO: 实现复盘功能
    console.log('开始复盘');
  };

  // 根据优先级和状态分类任务
  const scheduledTasks = tasks.filter(task => 
    task.priority === 'high' && !task.completed && task.status === 'pending'
  );
  const priorityTasks = tasks.filter(task => 
    (task.priority === 'medium' || task.priority === 'low') && !task.completed && task.status === 'pending'
  );
  const completedTasks = tasks.filter(task => task.completed);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <Text>加载任务中...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <Title level={2} className={styles.title}>今日任务</Title>
            <Text className={styles.subtitle}>
              {new Date().toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </Text>
          </div>
          <Button
            type="text"
            onClick={refreshTasks}
            loading={refreshing}
            className={styles.refreshButton}
          >
            刷新
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        {/* 固定时间任务 */}
        {scheduledTasks.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <ClockCircleOutlined className={styles.sectionIcon} />
              <Title level={4} className={styles.sectionTitle}>固定时间</Title>
            </div>
            <div className={styles.taskList}>
              {scheduledTasks.map(task => (
                <Card key={task.id} className={styles.taskCard}>
                  <div className={styles.taskContent}>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleTaskToggle(task.id)}
                      className={styles.taskCheckbox}
                    />
                    <div className={styles.taskInfo}>
                      <Text className={styles.taskTitle}>{task.title}</Text>
                      {task.description && (
                        <Text className={styles.taskDescription}>{task.description}</Text>
                      )}
                    </div>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      className={styles.taskAction}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 优先级任务 */}
        {priorityTasks.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <CheckOutlined className={styles.sectionIcon} />
              <Title level={4} className={styles.sectionTitle}>优先级任务</Title>
            </div>
            <div className={styles.taskList}>
              {priorityTasks.map(task => (
                <Card key={task.id} className={styles.taskCard}>
                  <div className={styles.taskContent}>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleTaskToggle(task.id)}
                      className={styles.taskCheckbox}
                    />
                    <div className={styles.taskInfo}>
                      <Text className={styles.taskTitle}>{task.title}</Text>
                      {task.description && (
                        <Text className={styles.taskDescription}>{task.description}</Text>
                      )}
                      <Text className={`${styles.taskPriority} ${styles[`priority-${task.priority}`]}`}>
                        {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                      </Text>
                    </div>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      className={styles.taskAction}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 已完成任务 */}
        {completedTasks.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <CheckOutlined className={styles.sectionIcon} />
              <Title level={4} className={styles.sectionTitle}>已完成</Title>
            </div>
            <div className={styles.taskList}>
              {completedTasks.map(task => (
                <Card key={task.id} className={`${styles.taskCard} ${styles.completed}`}>
                  <div className={styles.taskContent}>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleTaskToggle(task.id)}
                      className={styles.taskCheckbox}
                    />
                    <div className={styles.taskInfo}>
                      <Text className={styles.taskTitle}>{task.title}</Text>
                      {task.description && (
                        <Text className={styles.taskDescription}>{task.description}</Text>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 空状态 */}
        {tasks.length === 0 && (
          <div className={styles.emptyState}>
            <Empty
              description="今天还没有任务"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddTask}
            size="large"
            block
            className={styles.addButton}
          >
            添加任务
          </Button>
          
          <Divider />
          
          <Button
            type="primary"
            onClick={handleReview}
            size="large"
            block
            className={styles.reviewButton}
          >
            开始复盘
          </Button>
        </Space>
      </div>
    </div>
  );
}
