'use client';

import { useState, useEffect } from 'react';
import { Card, Checkbox, Button, Space, Typography, Divider, Empty, Spin, message, Modal, Form, Input, Select, Popconfirm, Collapse } from 'antd';
import { ClockCircleOutlined, PlusOutlined, CheckOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, RocketOutlined, CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import styles from './TodayView.module.css';
import { taskService, Task, CreateTaskRequest, UpdateTaskRequest } from '../../../shared/services/taskService';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface TaskManagementProps {
  refreshTrigger?: number;
}

// 优先级显示辅助函数
const getPriorityInfo = (priority: string) => {
  const priorityMap = {
    important_urgent: { label: '重要紧急', color: '#ff4d4f', icon: '🔥' },
    important_not_urgent: { label: '重要不紧急', color: '#1890ff', icon: '📋' },
    not_important_urgent: { label: '不重要紧急', color: '#faad14', icon: '⚡' },
    routine: { label: '常规任务', color: '#52c41a', icon: '📝' }
  };
  return priorityMap[priority as keyof typeof priorityMap] || priorityMap.routine;
};

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

  // 快速录入相关状态
  const [quickInput, setQuickInput] = useState('');
  const [isQuickSaving, setIsQuickSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedForm] = Form.useForm();

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
        priority: values.priority || 'routine',
        type: 'task'
      };
      
      const response = await taskService.createTask(taskData);
      if (response.success && response.data) {
        message.success('任务创建成功');
        setIsAddModalVisible(false);
        addForm.resetFields(); // 重置表单
        
        // 直接添加到任务列表中，避免重新获取数据
        const newTask = response.data;
        setTasks(prevTasks => [...prevTasks, newTask]);
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
      if (response.success && response.data) {
        message.success('任务更新成功');
        setIsEditModalVisible(false);
        setEditingTask(null);
        
        // 直接更新任务列表中的对应任务
        const updatedTask = response.data;
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === editingTask.id ? updatedTask : task
          )
        );
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
        
        // 直接从任务列表中移除该任务
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      } else {
        message.error('任务删除失败');
      }
    } catch (error) {
      console.error('删除任务失败:', error);
      message.error('删除任务失败，请稍后重试');
    }
  };

  // 快速录入任务
  const handleQuickSave = async () => {
    if (!quickInput.trim()) {
      message.warning('请输入任务内容');
      return;
    }

    try {
      setIsQuickSaving(true);
      
      // 获取展开表单的数据（如果有的话）
      const expandedValues = isExpanded ? await expandedForm.validateFields().catch(() => ({})) : {};
      
      const taskData: CreateTaskRequest = {
        title: expandedValues.title || quickInput.trim(),
        content: expandedValues.content || quickInput.trim(),
        priority: expandedValues.priority || 'routine',
        type: expandedValues.type || 'task',
        estimatedDuration: expandedValues.estimatedDuration || undefined,
        hasDeadline: expandedValues.hasDeadline || false,
        suggestedTimeframe: expandedValues.suggestedTimeframe || undefined,
        isRecurring: expandedValues.isRecurring || false,
        frequency: expandedValues.frequency || undefined
      };
      
      const response = await taskService.createTask(taskData);
      if (response.success && response.data) {
        message.success('任务创建成功');
        setQuickInput(''); // 清空输入
        expandedForm.resetFields(); // 重置展开表单
        setIsExpanded(false); // 折叠展开区域
        
        // 直接添加到任务列表中，避免重新获取数据
        const newTask = response.data;
        setTasks(prevTasks => [...prevTasks, newTask]);
      } else {
        message.error('任务创建失败');
      }
    } catch (error) {
      console.error('快速创建任务失败:', error);
      message.error('任务创建失败，请稍后重试');
    } finally {
      setIsQuickSaving(false);
    }
  };

  const handleReview = () => {
    // TODO: 实现复盘功能
    console.log('开始复盘');
  };

  // 根据优先级和状态分类任务
  const scheduledTasks = tasks.filter(task => 
    task.priority === 'important_urgent' && !task.completed && task.status === 'pending'
  );
  const priorityTasks = tasks.filter(task => 
    (task.priority === 'important_not_urgent' || task.priority === 'not_important_urgent' || task.priority === 'routine') && !task.completed && task.status === 'pending'
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
        <Title level={2} className={styles.title}>任务管理</Title>
        <Text className={styles.subtitle}>
          {new Date().toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}
        </Text>
        <Button
          type="text"
          onClick={refreshTasks}
          loading={refreshing}
          className={styles.refreshButton}
        >
          刷新
        </Button>
      </div>

      {/* 快速录入区域 */}
      <div className={styles.addSection}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="添加新任务..."
            className={styles.addInput}
            onPressEnter={handleQuickSave}
            maxLength={200}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleQuickSave}
            loading={isQuickSaving}
            className={styles.addButton}
          >
            添加
          </Button>
        </Space.Compact>
        
        {/* 展开/折叠按钮 */}
        <div className={styles.expandToggle}>
          <Button
            type="text"
            icon={isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.expandButton}
          >
            {isExpanded ? '收起详细信息' : '展开详细信息'}
          </Button>
        </div>
        
        {/* 展开的详细表单 */}
        {isExpanded && (
          <div className={styles.expandedForm}>
            <Form
              form={expandedForm}
              layout="vertical"
              size="small"
              requiredMark={false}
              className={styles.compactForm}
            >
              {/* 第一行：基本信息 */}
              <div className={styles.formRow}>
                <Form.Item
                  name="title"
                  label="标题"
                  initialValue={quickInput}
                  style={{ flex: 2, marginRight: 16 }}
                >
                  <Input placeholder="任务标题" />
                </Form.Item>
                
                <Form.Item
                  name="type"
                  label="类型"
                  initialValue="task"
                  style={{ flex: 1, marginRight: 16 }}
                >
                  <Select>
                    <Option value="task">任务</Option>
                    <Option value="idea">想法</Option>
                    <Option value="link">链接</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="priority"
                  label="优先级"
                  initialValue="routine"
                  style={{ flex: 1 }}
                >
                  <Select>
                    <Option value="important_urgent">重要紧急</Option>
                    <Option value="important_not_urgent">重要不紧急</Option>
                    <Option value="not_important_urgent">不重要紧急</Option>
                    <Option value="routine">常规任务</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* 第二行：预估时间 */}
              <div className={styles.formRow}>
                <Form.Item
                  name="estimatedDuration"
                  label="预估时间"
                  style={{ flex: 1 }}
                >
                  <Input placeholder="如：30分钟、2小时" />
                </Form.Item>
              </div>

              {/* 第三行：详细内容 */}
              <Form.Item
                name="content"
                label="详细内容"
                initialValue={quickInput}
              >
                <TextArea 
                  placeholder="详细内容（可选）" 
                  rows={2}
                />
              </Form.Item>

              {/* 第四行：时间设置 */}
              <div className={styles.formRow}>
                <Form.Item
                  name="hasDeadline"
                  label="有截止时间"
                  valuePropName="checked"
                  style={{ flex: 1, marginRight: 16 }}
                >
                  <input type="checkbox" />
                </Form.Item>
                
                <Form.Item
                  name="suggestedTimeframe"
                  label="建议时间段"
                  style={{ flex: 1, marginRight: 16 }}
                >
                  <Select placeholder="选择时间段">
                    <Option value="morning">早晨</Option>
                    <Option value="afternoon">下午</Option>
                    <Option value="evening">晚上</Option>
                    <Option value="anytime">随时</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="isRecurring"
                  label="重复任务"
                  valuePropName="checked"
                  style={{ flex: 1 }}
                >
                  <input type="checkbox" />
                </Form.Item>
              </div>

              {/* 第五行：重复频率（如果选择了重复任务） */}
              <Form.Item
                name="frequency"
                label="重复频率"
                style={{ display: 'none' }}
              >
                <Select placeholder="选择频率">
                  <Option value="daily">每天</Option>
                  <Option value="weekly">每周</Option>
                  <Option value="monthly">每月</Option>
                </Select>
              </Form.Item>
            </Form>
          </div>
        )}
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
        <Button
          type="primary"
          onClick={handleReview}
          size="large"
          block
          className={styles.reviewButton}
        >
          开始复盘
        </Button>
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
