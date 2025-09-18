'use client';

import { useState, useEffect } from 'react';
import { Card, Checkbox, Button, Space, Typography, Divider, Empty, Spin, message, Modal, Form, Input, Select, Popconfirm } from 'antd';
import { ClockCircleOutlined, PlusOutlined, CheckOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './TodayView.module.css';
import { taskService, Task, CreateTaskRequest, UpdateTaskRequest } from '../../../shared/services/taskService';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface TaskManagementProps {
  refreshTrigger?: number;
}

export default function TaskManagement({ refreshTrigger }: TaskManagementProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // 任务管理相关状态
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

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

  // 添加任务
  const handleAddTask = () => {
    addForm.resetFields();
    setIsAddModalVisible(true);
  };

  // 提交添加任务
  const handleAddTaskSubmit = async () => {
    try {
      const values = await addForm.validateFields();
      const taskData: CreateTaskRequest = {
        title: values.title,
        description: values.description,
        content: values.content,
        priority: values.priority || 'medium',
        type: 'task'
      };
      
      const response = await taskService.createTask(taskData);
      if (response.success) {
        message.success('任务创建成功');
        setIsAddModalVisible(false);
        fetchTasks(); // 刷新任务列表
      } else {
        message.error('任务创建失败');
      }
    } catch (error) {
      console.error('创建任务失败:', error);
      message.error('创建任务失败，请稍后重试');
    }
  };

  // 编辑任务
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    editForm.setFieldsValue({
      title: task.title,
      description: task.description,
      content: task.content,
      priority: task.priority,
      status: task.status
    });
    setIsEditModalVisible(true);
  };

  // 提交编辑任务
  const handleEditTaskSubmit = async () => {
    if (!editingTask) return;
    
    try {
      const values = await editForm.validateFields();
      const updateData: UpdateTaskRequest = {
        title: values.title,
        description: values.description,
        content: values.content,
        priority: values.priority,
        status: values.status
      };
      
      const response = await taskService.updateTask(editingTask.id, updateData);
      if (response.success) {
        message.success('任务更新成功');
        setIsEditModalVisible(false);
        setEditingTask(null);
        fetchTasks(); // 刷新任务列表
      } else {
        message.error('任务更新失败');
      }
    } catch (error) {
      console.error('更新任务失败:', error);
      message.error('更新任务失败，请稍后重试');
    }
  };

  // 删除任务
  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await taskService.deleteTask(taskId);
      if (response.success) {
        message.success('任务删除成功');
        fetchTasks(); // 刷新任务列表
      } else {
        message.error('任务删除失败');
      }
    } catch (error) {
      console.error('删除任务失败:', error);
      message.error('删除任务失败，请稍后重试');
    }
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
            <Title level={2} className={styles.title}>任务管理</Title>
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
                    <Space>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        className={styles.taskAction}
                        onClick={() => handleEditTask(task)}
                        title="编辑任务"
                      />
                      <Popconfirm
                        title="确定要删除这个任务吗？"
                        description="删除后无法恢复"
                        icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={() => handleDeleteTask(task.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          className={styles.taskAction}
                          danger
                          title="删除任务"
                        />
                      </Popconfirm>
                    </Space>
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
                    <Space>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        className={styles.taskAction}
                        onClick={() => handleEditTask(task)}
                        title="编辑任务"
                      />
                      <Popconfirm
                        title="确定要删除这个任务吗？"
                        description="删除后无法恢复"
                        icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={() => handleDeleteTask(task.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          className={styles.taskAction}
                          danger
                          title="删除任务"
                        />
                      </Popconfirm>
                    </Space>
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
                    <Space>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        className={styles.taskAction}
                        onClick={() => handleEditTask(task)}
                        title="编辑任务"
                      />
                      <Popconfirm
                        title="确定要删除这个任务吗？"
                        description="删除后无法恢复"
                        icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={() => handleDeleteTask(task.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          className={styles.taskAction}
                          danger
                          title="删除任务"
                        />
                      </Popconfirm>
                    </Space>
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

      {/* 添加任务模态框 */}
      <Modal
        title="添加新任务"
        open={isAddModalVisible}
        onOk={handleAddTaskSubmit}
        onCancel={() => setIsAddModalVisible(false)}
        okText="创建"
        cancelText="取消"
        width={600}
      >
        <Form
          form={addForm}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="title"
            label="任务标题"
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input placeholder="请输入任务标题" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="任务描述"
          >
            <TextArea 
              placeholder="请输入任务描述（可选）" 
              rows={3}
            />
          </Form.Item>
          
          <Form.Item
            name="content"
            label="详细内容"
          >
            <TextArea 
              placeholder="请输入详细内容（可选）" 
              rows={4}
            />
          </Form.Item>
          
          <Form.Item
            name="priority"
            label="优先级"
            initialValue="medium"
          >
            <Select>
              <Option value="low">低</Option>
              <Option value="medium">中</Option>
              <Option value="high">高</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑任务模态框 */}
      <Modal
        title="编辑任务"
        open={isEditModalVisible}
        onOk={handleEditTaskSubmit}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingTask(null);
        }}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="title"
            label="任务标题"
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input placeholder="请输入任务标题" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="任务描述"
          >
            <TextArea 
              placeholder="请输入任务描述（可选）" 
              rows={3}
            />
          </Form.Item>
          
          <Form.Item
            name="content"
            label="详细内容"
          >
            <TextArea 
              placeholder="请输入详细内容（可选）" 
              rows={4}
            />
          </Form.Item>
          
          <Form.Item
            name="priority"
            label="优先级"
          >
            <Select>
              <Option value="low">低</Option>
              <Option value="medium">中</Option>
              <Option value="high">高</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
          >
            <Select>
              <Option value="pending">待处理</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
