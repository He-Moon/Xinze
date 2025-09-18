'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Button, Avatar, Dropdown, Typography, Space, Modal, App, Tabs } from 'antd';
import { 
  PlusOutlined, 
  CalendarOutlined, 
  AimOutlined, 
  BarChartOutlined, 
  SettingOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useAuthContext } from '../../../components/providers/AuthProvider';
import QuickCapture from '../components/QuickCapture';
import TaskManagement from '../components/TodayView';
import GoalsAndPrinciples from '../components/GoalsAndPrinciples';
import ReviewInsights from '../components/ReviewInsights';
import Settings from '../components/Settings';
import styles from './Dashboard.module.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

type MenuKey = 'capture' | 'today' | 'goals' | 'review' | 'settings';

export default function Dashboard() {
  const { user, logout, isLoading } = useAuthContext();
  const [selectedKey, setSelectedKey] = useState<MenuKey>('capture');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const router = useRouter();
  const { message } = App.useApp();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const result = await logout();
      if (result.success) {
        message.success('退出登录成功');
        router.push('/login');
      } else {
        message.error(result.message || '退出登录失败');
      }
    } catch (error) {
      message.error('退出登录时发生错误');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const showLogoutConfirm = () => {
    Modal.confirm({
      title: '确认退出登录',
      content: '您确定要退出登录吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: handleLogout,
    });
  };

  // 刷新任务列表
  const handleTaskCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // 刷新目标列表
  const handleGoalCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // 刷新心则列表
  const handlePrincipleCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: isLoggingOut ? '退出中...' : '退出登录',
      onClick: isLoggingOut ? undefined : showLogoutConfirm,
      disabled: isLoggingOut,
    },
  ];

  const tabItems = [
    {
      key: 'capture',
      label: (
        <span className={styles.tabLabel}>
          <PlusOutlined />
          快速捕捉
        </span>
      ),
    },
    {
      key: 'today',
      label: (
        <span className={styles.tabLabel}>
          <CalendarOutlined />
          任务管理
        </span>
      ),
    },
    {
      key: 'goals',
      label: (
        <span className={styles.tabLabel}>
          <AimOutlined />
          目标心则
        </span>
      ),
    },
    {
      key: 'review',
      label: (
        <span className={styles.tabLabel}>
          <BarChartOutlined />
          复盘洞见
        </span>
      ),
    },
    {
      key: 'settings',
      label: (
        <span className={styles.tabLabel}>
          <SettingOutlined />
          设置
        </span>
      ),
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'capture':
        return <QuickCapture 
          onTaskCreated={handleTaskCreated} 
          onGoalCreated={handleGoalCreated}
          onPrincipleCreated={handlePrincipleCreated}
        />;
      case 'today':
        return <TaskManagement refreshTrigger={refreshTrigger} />;
      case 'goals':
        return <GoalsAndPrinciples refreshTrigger={refreshTrigger} />;
      case 'review':
        return <ReviewInsights />;
      case 'settings':
        return <Settings />;
      default:
        return <QuickCapture 
          onTaskCreated={handleTaskCreated} 
          onGoalCreated={handleGoalCreated}
          onPrincipleCreated={handlePrincipleCreated}
        />;
    }
  };

  return (
    <div className={styles.fullScreenLayout}>
      <Header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <span className={styles.logoText}>心</span>
            </div>
            <span className={styles.logoTitle}>心则</span>
          </div>
        </div>
        
        <div className={styles.headerCenter}>
          <Tabs
            activeKey={selectedKey}
            onChange={(key) => setSelectedKey(key as MenuKey)}
            items={tabItems}
            className={styles.navTabs}
            size="large"
          />
        </div>
        
        <div className={styles.headerRight}>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button type="text" className={styles.userButton}>
              <Space>
                <Avatar size="small" icon={<UserOutlined />} />
                <Text>{user?.name || '用户'}</Text>
              </Space>
            </Button>
          </Dropdown>
        </div>
      </Header>
      
      <Content className={styles.content}>
        {renderContent()}
      </Content>
    </div>
  );
}
