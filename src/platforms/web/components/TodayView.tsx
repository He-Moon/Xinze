'use client';

import { useState } from 'react';
import { Card, Checkbox, Button, Space, Typography, Divider, Empty } from 'antd';
import { ClockCircleOutlined, PlusOutlined, CheckOutlined, EditOutlined } from '@ant-design/icons';
import styles from './TodayView.module.css';

const { Title, Text } = Typography;

interface Task {
  id: string;
  title: string;
  time?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  type: 'scheduled' | 'priority';
}

export default function TodayView() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '完成项目提案',
      time: '09:00',
      priority: 'high',
      completed: false,
      type: 'scheduled'
    },
    {
      id: '2',
      title: '团队会议',
      time: '14:00',
      priority: 'high',
      completed: false,
      type: 'scheduled'
    },
    {
      id: '3',
      title: '阅读技术文档',
      priority: 'medium',
      completed: false,
      type: 'priority'
    },
    {
      id: '4',
      title: '整理工作笔记',
      priority: 'low',
      completed: true,
      type: 'priority'
    }
  ]);

  const handleTaskToggle = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = () => {
    // TODO: 实现添加任务功能
    console.log('添加新任务');
  };

  const handleReview = () => {
    // TODO: 实现复盘功能
    console.log('开始复盘');
  };

  const scheduledTasks = tasks.filter(task => task.type === 'scheduled' && !task.completed);
  const priorityTasks = tasks.filter(task => task.type === 'priority' && !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
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
                      <Text className={styles.taskTime}>{task.time}</Text>
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
