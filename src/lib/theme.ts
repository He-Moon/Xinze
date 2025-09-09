// 自动生成的 Ant Design 主题配置 - 请勿手动修改
// 此文件由 scripts/generate-antd-theme.js 自动生成
// 如需修改，请编辑 src/lib/design-tokens.ts

import { ThemeConfig } from 'antd';
import { designTokens } from './design-tokens';

// 浅色主题
export const theme: ThemeConfig = {
  token: {
    // 主色系
    colorPrimary: '#333333',
    colorSuccess: '#4caf50',
    colorWarning: '#ff9800',
    colorError: '#f44336',
    colorInfo: '#2196f3',
    
    // 文本色
    colorTextBase: '#333333',
    colorTextSecondary: '#666666',
    colorTextTertiary: '#999999',
    colorTextQuaternary: '#cccccc',
    colorTextDisabled: '#cccccc',
    
    // 背景色
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#fafafa',
    colorBgSpotlight: '#f5f5f5',
    colorBgMask: 'rgba(0, 0, 0, 0.5)',
    
    // 边框色
    colorBorder: '#e5e5e5',
    colorBorderSecondary: '#f0f0f0',
    colorSplit: '#f0f0f0',
    
    // 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontFamilyCode: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    
    // 行高
    lineHeight: 1.5,
    lineHeightHeading1: 1.2105263157894737,
    lineHeightHeading2: 1.2666666666666666,
    lineHeightHeading3: 1.3333333333333333,
    lineHeightHeading4: 1.4,
    lineHeightHeading5: 1.5,
    
    // 圆角
    borderRadius: 4,
    borderRadiusLG: 8,
    borderRadiusSM: 2,
    borderRadiusXS: 2,
    
    // 阴影
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    boxShadowSecondary: '0 1px 3px rgba(0, 0, 0, 0.1)',
    boxShadowTertiary: '0 1px 3px rgba(0, 0, 0, 0.1)',
    
    // 间距
    padding: 24,
    paddingLG: 32,
    paddingSM: 16,
    paddingXS: 8,
    paddingXXS: 4,
    
    margin: 24,
    marginLG: 32,
    marginSM: 16,
    marginXS: 8,
    marginXXS: 4,
    
    // 动画
    motionDurationFast: '0.15s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    motionEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
    motionEaseIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
  components: {
    // 按钮组件
    Button: {
      borderRadius: 4,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      controlHeightXS: 24,
      paddingInline: 16,
      paddingBlock: 8,
      fontWeight: 500,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      colorPrimary: '#333333',
      colorPrimaryHover: '#555555',
      colorPrimaryActive: '#222222',
      colorText: '#333333',
      colorTextSecondary: '#666666',
      colorTextTertiary: '#999999',
      colorTextQuaternary: '#cccccc',
      colorTextDisabled: '#cccccc',
      colorBgContainer: '#ffffff',
      colorBorder: '#e5e5e5',
      colorBorderSecondary: '#f0f0f0',
      colorFillSecondary: '#fafafa',
      colorFillTertiary: '#f5f5f5',
      colorFillQuaternary: '#ffffff',
      motionDurationFast: '0.15s',
      motionDurationMid: '0.2s',
      motionDurationSlow: '0.3s',
      motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      motionEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
      motionEaseIn: 'cubic-bezier(0.4, 0, 1, 1)',
    },
    
    // 卡片组件
    Card: {
      borderRadius: 8,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      paddingLG: 32,
      padding: 24,
      paddingSM: 16,
    },
    
    // 输入框组件
    Input: {
      borderRadius: 4,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 12,
      paddingBlock: 8,
      colorText: '#333333',
      colorTextSecondary: '#666666',
      colorTextTertiary: '#999999',
      colorTextQuaternary: '#cccccc',
      colorTextDisabled: '#cccccc',
      colorTextPlaceholder: '#999999',
      colorBgContainer: '#ffffff',
      colorBorder: '#e5e5e5',
      colorBorderSecondary: '#f0f0f0',
      colorPrimary: '#333333',
      colorPrimaryHover: '#555555',
      colorPrimaryActive: '#222222',
      colorError: '#f44336',
      colorErrorHover: '#ef5350',
      colorWarning: '#ff9800',
      colorWarningHover: '#ffb74d',
      colorSuccess: '#4caf50',
      colorSuccessHover: '#66bb6a',
      colorInfo: '#2196f3',
      colorInfoHover: '#42a5f5',
      motionDurationFast: '0.15s',
      motionDurationMid: '0.2s',
      motionDurationSlow: '0.3s',
      motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      motionEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
      motionEaseIn: 'cubic-bezier(0.4, 0, 1, 1)',
    },
    
    // 选择器组件
    Select: {
      borderRadius: 4,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
    },
    
    // 表格组件
    Table: {
      borderRadius: 8,
      headerBg: '#f5f5f5',
      headerColor: '#333333',
      rowHoverBg: '#fafafa',
    },
    
    // 模态框组件
    Modal: {
      borderRadius: 8,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    
    // 抽屉组件
    Drawer: {
      borderRadius: 8,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    
    // 通知组件
    Notification: {
      borderRadius: 8,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    
    // 消息组件
    Message: {
      borderRadius: 4,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    
    // 标签组件
    Tag: {
      borderRadius: 2,
      fontSize: 12,
      lineHeight: 1.5,
    },
    
    // 徽章组件
    Badge: {
      fontSize: 12,
      lineHeight: 1.5,
    },
    
    // 进度条组件
    Progress: {
      borderRadius: 2,
    },
    
    // 分页组件
    Pagination: {
      borderRadius: 4,
    },
    
    // 菜单组件
    Menu: {
      borderRadius: 4,
      itemBorderRadius: 2,
      colorText: '#333333',
      colorTextSecondary: '#666666',
      colorTextTertiary: '#999999',
      colorTextQuaternary: '#cccccc',
      colorTextDisabled: '#cccccc',
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
      colorPrimary: '#333333',
      colorPrimaryHover: '#555555',
      colorPrimaryActive: '#222222',
      colorBorder: '#e5e5e5',
      colorBorderSecondary: '#f0f0f0',
      motionDurationFast: '0.15s',
      motionDurationMid: '0.2s',
      motionDurationSlow: '0.3s',
      motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      motionEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
      motionEaseIn: 'cubic-bezier(0.4, 0, 1, 1)',
    },
    
    // Tab 组件
    Tabs: {
      borderRadius: 4,
      colorText: '#333333',
      colorTextSecondary: '#666666',
      colorTextTertiary: '#999999',
      colorTextQuaternary: '#cccccc',
      colorTextDisabled: '#cccccc',
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
      colorPrimary: '#333333',
      colorPrimaryHover: '#555555',
      colorPrimaryActive: '#222222',
      colorBorder: '#e5e5e5',
      colorBorderSecondary: '#f0f0f0',
      colorFillSecondary: '#fafafa',
      colorFillTertiary: '#f5f5f5',
      colorFillQuaternary: '#ffffff',
      motionDurationFast: '0.15s',
      motionDurationMid: '0.2s',
      motionDurationSlow: '0.3s',
      motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      motionEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
      motionEaseIn: 'cubic-bezier(0.4, 0, 1, 1)',
    },
    
    // 面包屑组件
    Breadcrumb: {
      fontSize: 14,
      linkColor: '#333333',
      linkHoverColor: '#555555',
    },
    
    // 步骤条组件
    Steps: {
      borderRadius: 4,
    },
    
    // 时间轴组件
    Timeline: {
      fontSize: 14,
    },
    
    // 折叠面板组件
    Collapse: {
      borderRadius: 4,
      headerBg: '#f5f5f5',
    },
    
    // 手风琴组件
    Accordion: {
      borderRadius: 4,
      headerBg: '#f5f5f5',
    },
  },
};

// 深色主题
export const darkTheme: ThemeConfig = {
  ...theme,
  token: {
    ...theme.token,
    // 深色主题颜色调整
    colorPrimary: '#ffffff',
    colorSuccess: '#4caf50',
    colorWarning: '#ff9800',
    colorError: '#f44336',
    colorInfo: '#2196f3',
    
    // 深色背景
    colorBgBase: '#1a1a1a',
    colorBgContainer: '#2a2a2a',
    colorBgElevated: '#333333',
    colorBgLayout: '#000000',
    colorBgSpotlight: '#2a2a2a',
    colorBgMask: 'rgba(0, 0, 0, 0.7)',
    
    // 深色文字
    colorTextBase: '#ffffff',
    colorTextSecondary: '#b3b3b3',
    colorTextTertiary: '#808080',
    colorTextQuaternary: '#4d4d4d',
    colorTextDisabled: '#666666',
    
    // 深色边框
    colorBorder: '#404040',
    colorBorderSecondary: '#333333',
    colorSplit: '#333333',
  },
};

// 主题预设
export const themePresets = {
  light: theme,
  dark: darkTheme,
  blue: {
    ...theme,
    token: {
      ...theme.token,
      colorPrimary: '#333333',
    },
  },
  green: {
    ...theme,
    token: {
      ...theme.token,
      colorPrimary: '#4caf50',
    },
  },
  purple: {
    ...theme,
    token: {
      ...theme.token,
      colorPrimary: '#722ed1',
    },
  },
  orange: {
    ...theme,
    token: {
      ...theme.token,
      colorPrimary: '#fa8c16',
    },
  },
};

// 主题工具函数
export const getTheme = (preset: keyof typeof themePresets = 'light') => {
  return themePresets[preset];
};

// 响应式断点
export const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

// 媒体查询工具
export const mediaQueries = {
  xs: `@media (max-width: ${breakpoints.xs}px)`,
  sm: `@media (max-width: ${breakpoints.sm}px)`,
  md: `@media (max-width: ${breakpoints.md}px)`,
  lg: `@media (max-width: ${breakpoints.lg}px)`,
  xl: `@media (max-width: ${breakpoints.xl}px)`,
  xxl: `@media (max-width: ${breakpoints.xxl}px)`,
};
