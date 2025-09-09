'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Menu, Button, Avatar, Dropdown, Typography, Space, Modal, App } from 'antd';
import { 
  PlusOutlined, 
  CalendarOutlined, 
  MenuOutlined, 
  AimOutlined, 
  BarChartOutlined, 
  SettingOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useAuthContext } from '../../../components/providers/AuthProvider';
import QuickCapture from '../components/QuickCapture';
import TodayView from '../components/TodayView';
import GoalsAndPrinciples from '../components/GoalsAndPrinciples';
import ReviewInsights from '../components/ReviewInsights';
import Settings from '../components/Settings';
import styles from './Dashboard.module.css';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

type MenuKey = 'capture' | 'today' | 'goals' | 'review' | 'settings';

export default function Dashboard() {
  const { user, logout, isLoading } = useAuthContext();
  const [selectedKey, setSelectedKey] = useState<MenuKey>('capture');
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  const menuItems = [
    {
      key: 'capture',
      icon: <PlusOutlined />,
      label: '快速捕捉',
    },
    {
      key: 'today',
      icon: <CalendarOutlined />,
      label: '今日任务',
    },
    {
      key: 'goals',
      icon: <AimOutlined />,
      label: '目标心则',
    },
    {
      key: 'review',
      icon: <BarChartOutlined />,
      label: '复盘洞见',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'capture':
        return <QuickCapture />;
      case 'today':
        return <TodayView />;
      case 'goals':
        return <GoalsAndPrinciples />;
      case 'review':
        return <ReviewInsights />;
      case 'settings':
        return <Settings />;
      default:
        return <QuickCapture />;
    }
  };

  return (
    <Layout className={styles.layout}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className={styles.sider}
      >
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <span className={styles.logoText}>心</span>
          </div>
          {!collapsed && <span className={styles.logoTitle}>心则</span>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key as MenuKey)}
          className={styles.menu}
        />
      </Sider>
      
      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerLeft}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className={styles.trigger}
            />
            <Title level={4} className={styles.pageTitle}>
              {menuItems.find(item => item.key === selectedKey)?.label}
            </Title>
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
      </Layout>
    </Layout>
  );
}
