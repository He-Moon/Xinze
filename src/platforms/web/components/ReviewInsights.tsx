'use client';

import { useState } from 'react';
import { Card, Button, Space, Typography, Progress, Statistic, Row, Col, Divider, Timeline } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  BulbOutlined, 
  CalendarOutlined,
  TrophyOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import styles from './ReviewInsights.module.css';

const { Title, Text, Paragraph } = Typography;

interface DailyReview {
  date: string;
  completed: number;
  total: number;
  insights: string[];
  principles: {
    followed: string[];
    violated: string[];
  };
}

interface WeeklySummary {
  week: string;
  completionRate: number;
  principleAlignment: number;
  insights: string[];
  trends: string[];
}

export default function ReviewInsights() {
  const [dailyReview] = useState<DailyReview>({
    date: '2024-01-15',
    completed: 8,
    total: 12,
    insights: [
      '今天完成了重要的项目提案，感觉很有成就感',
      '在团队会议中提出了新的想法，得到了大家的认可',
      '阅读时间比预期少，需要调整时间安排'
    ],
    principles: {
      followed: ['保持学习心态', '主动沟通'],
      violated: ['时间管理', '专注力']
    }
  });

  const [weeklySummary] = useState<WeeklySummary>({
    week: '2024年第3周',
    completionRate: 75,
    principleAlignment: 68,
    insights: [
      '本周在项目推进方面表现良好，但个人学习时间不足',
      '团队协作能力有所提升，但时间管理仍需改进',
      '发现自己在压力下容易偏离既定原则'
    ],
    trends: [
      '任务完成率呈上升趋势',
      '学习时间逐渐减少',
      '团队沟通频率增加'
    ]
  });

  const handleStartReview = () => {
    // TODO: 实现开始复盘功能
    console.log('开始复盘');
  };

  const handleExportReport = () => {
    // TODO: 实现导出报告功能
    console.log('导出报告');
  };

  const completionRate = Math.round((dailyReview.completed / dailyReview.total) * 100);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>复盘与洞见</Title>
        <Text className={styles.subtitle}>回顾过去，洞察未来</Text>
      </div>

      <div className={styles.content}>
        {/* 今日复盘 */}
        <Card className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <CalendarOutlined className={styles.sectionIcon} />
            <Title level={3} className={styles.sectionTitle}>今日复盘</Title>
          </div>
          
          <div className={styles.dailyStats}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Statistic
                  title="任务完成"
                  value={dailyReview.completed}
                  suffix={`/ ${dailyReview.total}`}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="完成率"
                  value={completionRate}
                  suffix="%"
                  valueStyle={{ color: completionRate >= 80 ? '#52c41a' : completionRate >= 60 ? '#faad14' : '#ff4d4f' }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Progress
                  type="circle"
                  percent={completionRate}
                  size={80}
                  strokeColor={completionRate >= 80 ? '#52c41a' : completionRate >= 60 ? '#faad14' : '#ff4d4f'}
                />
              </Col>
            </Row>
          </div>

          <Divider />

          <div className={styles.insightsSection}>
            <Title level={4} className={styles.subsectionTitle}>今日感悟</Title>
            <ul className={styles.insightsList}>
              {dailyReview.insights.map((insight, index) => (
                <li key={index} className={styles.insightItem}>
                  <Text>{insight}</Text>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.principlesSection}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div className={styles.principlesBox}>
                  <Title level={5} className={styles.principlesTitle}>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                    遵循的心则
                  </Title>
                  <ul className={styles.principlesList}>
                    {dailyReview.principles.followed.map((principle, index) => (
                      <li key={index} className={styles.principleItem}>
                        <Text>{principle}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className={styles.principlesBox}>
                  <Title level={5} className={styles.principlesTitle}>
                    <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                    违背的心则
                  </Title>
                  <ul className={styles.principlesList}>
                    {dailyReview.principles.violated.map((principle, index) => (
                      <li key={index} className={styles.principleItem}>
                        <Text>{principle}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        {/* 周总结 */}
        <Card className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <BarChartOutlined className={styles.sectionIcon} />
            <Title level={3} className={styles.sectionTitle}>周总结</Title>
          </div>
          
          <div className={styles.weeklyStats}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Statistic
                  title="任务完成率"
                  value={weeklySummary.completionRate}
                  suffix="%"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="心则对齐度"
                  value={weeklySummary.principleAlignment}
                  suffix="%"
                  prefix={<BulbOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <div className={styles.weekInfo}>
                  <Text strong>{weeklySummary.week}</Text>
                </div>
              </Col>
            </Row>
          </div>

          <Divider />

          <div className={styles.weeklyInsights}>
            <Title level={4} className={styles.subsectionTitle}>本周洞察</Title>
            <ul className={styles.insightsList}>
              {weeklySummary.insights.map((insight, index) => (
                <li key={index} className={styles.insightItem}>
                  <Text>{insight}</Text>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.trendsSection}>
            <Title level={4} className={styles.subsectionTitle}>趋势分析</Title>
            <Timeline>
              {weeklySummary.trends.map((trend, index) => (
                <Timeline.Item key={index}>
                  <Text>{trend}</Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        </Card>
      </div>

      <div className={styles.footer}>
        <Space size="large">
          <Button
            type="primary"
            size="large"
            onClick={handleStartReview}
            className={styles.actionButton}
          >
            开始复盘
          </Button>
          <Button
            size="large"
            onClick={handleExportReport}
            className={styles.actionButton}
          >
            导出报告
          </Button>
        </Space>
      </div>
    </div>
  );
}
