'use client';

import { useState } from 'react';
import { Card, Switch, Button, Space, Typography, Divider, Select, Upload, Avatar, Row, Col } from 'antd';
import { 
  UserOutlined, 
  SettingOutlined, 
  EyeOutlined, 
  DownloadOutlined,
  UploadOutlined,
  MoonOutlined,
  SunOutlined,
  BellOutlined,
  LockOutlined
} from '@ant-design/icons';
import styles from './Settings.module.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [aiTone, setAiTone] = useState('friendly');
  const [aiDepth, setAiDepth] = useState('medium');

  const handleExportData = () => {
    // TODO: 实现数据导出功能
    console.log('导出数据');
  };

  const handleImportData = () => {
    // TODO: 实现数据导入功能
    console.log('导入数据');
  };

  const handleSaveSettings = () => {
    // TODO: 实现保存设置功能
    console.log('保存设置');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>设置</Title>
        <Text className={styles.subtitle}>个性化你的心则体验</Text>
      </div>

      <div className={styles.content}>
        {/* 个人信息 */}
        <Card className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <UserOutlined className={styles.sectionIcon} />
            <Title level={3} className={styles.sectionTitle}>个人信息</Title>
          </div>
          
          <div className={styles.profileSection}>
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} sm={8}>
                <div className={styles.avatarSection}>
                  <Avatar size={80} icon={<UserOutlined />} className={styles.avatar} />
                  <Upload className={styles.upload}>
                    <Button icon={<UploadOutlined />} size="small">
                      更换头像
                    </Button>
                  </Upload>
                </div>
              </Col>
              <Col xs={24} sm={16}>
                <div className={styles.profileInfo}>
                  <Title level={4} className={styles.profileName}>心则用户</Title>
                  <Text type="secondary">user@example.com</Text>
                  <Paragraph className={styles.profileDescription}>
                    用心则记录生活，用行动改变未来
                  </Paragraph>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        {/* 外观设置 */}
        <Card className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <SettingOutlined className={styles.sectionIcon} />
            <Title level={3} className={styles.sectionTitle}>外观设置</Title>
          </div>
          
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <Title level={5} className={styles.settingTitle}>
                <MoonOutlined style={{ marginRight: 8 }} />
                深色模式
              </Title>
              <Text type="secondary">切换到深色主题，保护眼睛</Text>
            </div>
            <Switch
              checked={darkMode}
              onChange={setDarkMode}
              className={styles.settingSwitch}
            />
          </div>

          <Divider />

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <Title level={5} className={styles.settingTitle}>
                <BellOutlined style={{ marginRight: 8 }} />
                通知提醒
              </Title>
              <Text type="secondary">接收任务提醒和复盘通知</Text>
            </div>
            <Switch
              checked={notifications}
              onChange={setNotifications}
              className={styles.settingSwitch}
            />
          </div>
        </Card>

        {/* 隐私设置 */}
        <Card className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <LockOutlined className={styles.sectionIcon} />
            <Title level={3} className={styles.sectionTitle}>隐私设置</Title>
          </div>
          
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <Title level={5} className={styles.settingTitle}>
                <EyeOutlined style={{ marginRight: 8 }} />
                隐私模式
              </Title>
              <Text type="secondary">某些记录仅自己可见</Text>
            </div>
            <Switch
              checked={privacyMode}
              onChange={setPrivacyMode}
              className={styles.settingSwitch}
            />
          </div>
        </Card>

        {/* AI 助理设置 */}
        <Card className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <SettingOutlined className={styles.sectionIcon} />
            <Title level={3} className={styles.sectionTitle}>AI 助理设置</Title>
          </div>
          
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <Title level={5} className={styles.settingTitle}>对话口吻</Title>
              <Text type="secondary">选择 AI 助理的交流风格</Text>
            </div>
            <Select
              value={aiTone}
              onChange={setAiTone}
              className={styles.settingSelect}
            >
              <Option value="friendly">友好亲切</Option>
              <Option value="professional">专业严谨</Option>
              <Option value="casual">轻松随意</Option>
              <Option value="motivational">激励鼓舞</Option>
            </Select>
          </div>

          <Divider />

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <Title level={5} className={styles.settingTitle}>分析深度</Title>
              <Text type="secondary">AI 分析的详细程度</Text>
            </div>
            <Select
              value={aiDepth}
              onChange={setAiDepth}
              className={styles.settingSelect}
            >
              <Option value="light">浅层分析</Option>
              <Option value="medium">中等深度</Option>
              <Option value="deep">深度分析</Option>
            </Select>
          </div>
        </Card>

        {/* 数据管理 */}
        <Card className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <DownloadOutlined className={styles.sectionIcon} />
            <Title level={3} className={styles.sectionTitle}>数据管理</Title>
          </div>
          
          <div className={styles.dataActions}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div className={styles.dataActionItem}>
                <div className={styles.dataActionInfo}>
                  <Title level={5} className={styles.dataActionTitle}>导出数据</Title>
                  <Text type="secondary">导出你的所有数据为 PDF 或 Excel 格式</Text>
                </div>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExportData}
                  className={styles.dataActionButton}
                >
                  导出
                </Button>
              </div>

              <div className={styles.dataActionItem}>
                <div className={styles.dataActionInfo}>
                  <Title level={5} className={styles.dataActionTitle}>导入数据</Title>
                  <Text type="secondary">从其他应用导入数据</Text>
                </div>
                <Button
                  icon={<UploadOutlined />}
                  onClick={handleImportData}
                  className={styles.dataActionButton}
                >
                  导入
                </Button>
              </div>
            </Space>
          </div>
        </Card>
      </div>

      <div className={styles.footer}>
        <Button
          type="primary"
          size="large"
          onClick={handleSaveSettings}
          className={styles.saveButton}
        >
          保存设置
        </Button>
      </div>
    </div>
  );
}
