#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 导入设计令牌
const { designTokens } = require('../src/lib/design-tokens.ts');

/**
 * 生成 Ant Design 主题配置
 */
function generateAntdTheme() {
  const theme = `// 自动生成的 Ant Design 主题配置 - 请勿手动修改
// 此文件由 scripts/generate-antd-theme.js 自动生成
// 如需修改，请编辑 src/lib/design-tokens.ts

import { ThemeConfig } from 'antd';
import { designTokens } from './design-tokens';

// 浅色主题
export const theme: ThemeConfig = {
  token: {
    // 主色系
    colorPrimary: '${designTokens.colors.primary}',
    colorSuccess: '${designTokens.colors.success}',
    colorWarning: '${designTokens.colors.warning}',
    colorError: '${designTokens.colors.error}',
    colorInfo: '${designTokens.colors.info}',
    
    // 文本色
    colorTextBase: '${designTokens.colors.text}',
    colorTextSecondary: '${designTokens.colors.textSecondary}',
    colorTextTertiary: '${designTokens.colors.textTertiary}',
    colorTextQuaternary: '${designTokens.colors.textQuaternary}',
    colorTextDisabled: '${designTokens.colors.textDisabled}',
    
    // 背景色
    colorBgBase: '${designTokens.colors.bg}',
    colorBgContainer: '${designTokens.colors.bgContainer}',
    colorBgElevated: '${designTokens.colors.bgElevated}',
    colorBgLayout: '${designTokens.colors.bgLayout}',
    colorBgSpotlight: '${designTokens.colors.bgSpotlight}',
    colorBgMask: '${designTokens.colors.bgMask}',
    
    // 边框色
    colorBorder: '${designTokens.colors.border}',
    colorBorderSecondary: '${designTokens.colors.borderSecondary}',
    colorSplit: '${designTokens.colors.borderSplit}',
    
    // 字体
    fontFamily: '${designTokens.typography.fontFamily}',
    fontFamilyCode: '${designTokens.typography.fontFamilyCode}',
    fontSize: ${designTokens.typography.fontSize},
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    
    // 行高
    lineHeight: ${designTokens.typography.lineHeight},
    lineHeightHeading1: 1.2105263157894737,
    lineHeightHeading2: 1.2666666666666666,
    lineHeightHeading3: 1.3333333333333333,
    lineHeightHeading4: 1.4,
    lineHeightHeading5: 1.5,
    
    // 圆角
    borderRadius: ${designTokens.borderRadius.md},
    borderRadiusLG: ${designTokens.borderRadius.lg},
    borderRadiusSM: ${designTokens.borderRadius.sm},
    borderRadiusXS: ${designTokens.borderRadius.sm},
    
    // 阴影
    boxShadow: '${designTokens.shadows.md}',
    boxShadowSecondary: '${designTokens.shadows.sm}',
    boxShadowTertiary: '${designTokens.shadows.sm}',
    
    // 间距
    padding: ${designTokens.spacing.lg},
    paddingLG: ${designTokens.spacing.xl},
    paddingSM: ${designTokens.spacing.md},
    paddingXS: ${designTokens.spacing.sm},
    paddingXXS: ${designTokens.spacing.xs},
    
    margin: ${designTokens.spacing.lg},
    marginLG: ${designTokens.spacing.xl},
    marginSM: ${designTokens.spacing.md},
    marginXS: ${designTokens.spacing.sm},
    marginXXS: ${designTokens.spacing.xs},
    
    // 动画
    motionDurationFast: '${designTokens.motion.durationFast}',
    motionDurationMid: '${designTokens.motion.durationMid}',
    motionDurationSlow: '${designTokens.motion.durationSlow}',
    motionEaseInOut: '${designTokens.motion.easeInOut}',
    motionEaseOut: '${designTokens.motion.easeOut}',
    motionEaseIn: '${designTokens.motion.easeIn}',
  },
  components: {
    // 按钮组件
    Button: {
      borderRadius: ${designTokens.borderRadius.md},
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      controlHeightXS: 24,
      paddingInline: 16,
      paddingBlock: 8,
      fontWeight: 500,
      boxShadow: '${designTokens.shadows.sm}',
      colorPrimary: '${designTokens.colors.primary}',
      colorPrimaryHover: '${designTokens.colors.primaryHover}',
      colorPrimaryActive: '${designTokens.colors.primaryActive}',
      colorText: '${designTokens.colors.text}',
      colorTextSecondary: '${designTokens.colors.textSecondary}',
      colorTextTertiary: '${designTokens.colors.textTertiary}',
      colorTextQuaternary: '${designTokens.colors.textQuaternary}',
      colorTextDisabled: '${designTokens.colors.textDisabled}',
      colorBgContainer: '${designTokens.colors.bgContainer}',
      colorBorder: '${designTokens.colors.border}',
      colorBorderSecondary: '${designTokens.colors.borderSecondary}',
      colorFillSecondary: '${designTokens.colors.bgLayout}',
      colorFillTertiary: '${designTokens.colors.bgSpotlight}',
      colorFillQuaternary: '${designTokens.colors.bgElevated}',
      motionDurationFast: '${designTokens.motion.durationFast}',
      motionDurationMid: '${designTokens.motion.durationMid}',
      motionDurationSlow: '${designTokens.motion.durationSlow}',
      motionEaseInOut: '${designTokens.motion.easeInOut}',
      motionEaseOut: '${designTokens.motion.easeOut}',
      motionEaseIn: '${designTokens.motion.easeIn}',
    },
    
    // 卡片组件
    Card: {
      borderRadius: ${designTokens.borderRadius.lg},
      boxShadow: '${designTokens.shadows.md}',
      paddingLG: ${designTokens.spacing.xl},
      padding: ${designTokens.spacing.lg},
      paddingSM: ${designTokens.spacing.md},
    },
    
    // 输入框组件
    Input: {
      borderRadius: ${designTokens.borderRadius.md},
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 12,
      paddingBlock: 8,
      colorText: '${designTokens.colors.text}',
      colorTextSecondary: '${designTokens.colors.textSecondary}',
      colorTextTertiary: '${designTokens.colors.textTertiary}',
      colorTextQuaternary: '${designTokens.colors.textQuaternary}',
      colorTextDisabled: '${designTokens.colors.textDisabled}',
      colorTextPlaceholder: '${designTokens.colors.textTertiary}',
      colorBgContainer: '${designTokens.colors.bgContainer}',
      colorBorder: '${designTokens.colors.border}',
      colorBorderSecondary: '${designTokens.colors.borderSecondary}',
      colorPrimary: '${designTokens.colors.primary}',
      colorPrimaryHover: '${designTokens.colors.primaryHover}',
      colorPrimaryActive: '${designTokens.colors.primaryActive}',
      colorError: '${designTokens.colors.error}',
      colorErrorHover: '${designTokens.colors.errorHover}',
      colorWarning: '${designTokens.colors.warning}',
      colorWarningHover: '${designTokens.colors.warningHover}',
      colorSuccess: '${designTokens.colors.success}',
      colorSuccessHover: '${designTokens.colors.successHover}',
      colorInfo: '${designTokens.colors.info}',
      colorInfoHover: '${designTokens.colors.infoHover}',
      motionDurationFast: '${designTokens.motion.durationFast}',
      motionDurationMid: '${designTokens.motion.durationMid}',
      motionDurationSlow: '${designTokens.motion.durationSlow}',
      motionEaseInOut: '${designTokens.motion.easeInOut}',
      motionEaseOut: '${designTokens.motion.easeOut}',
      motionEaseIn: '${designTokens.motion.easeIn}',
    },
    
    // 选择器组件
    Select: {
      borderRadius: ${designTokens.borderRadius.md},
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
    },
    
    // 表格组件
    Table: {
      borderRadius: ${designTokens.borderRadius.lg},
      headerBg: '${designTokens.colors.bgSpotlight}',
      headerColor: '${designTokens.colors.text}',
      rowHoverBg: '${designTokens.colors.bgLayout}',
    },
    
    // 模态框组件
    Modal: {
      borderRadius: ${designTokens.borderRadius.lg},
      boxShadow: '${designTokens.shadows.lg}',
    },
    
    // 抽屉组件
    Drawer: {
      borderRadius: ${designTokens.borderRadius.lg},
      boxShadow: '${designTokens.shadows.lg}',
    },
    
    // 通知组件
    Notification: {
      borderRadius: ${designTokens.borderRadius.lg},
      boxShadow: '${designTokens.shadows.lg}',
    },
    
    // 消息组件
    Message: {
      borderRadius: ${designTokens.borderRadius.md},
      boxShadow: '${designTokens.shadows.md}',
    },
    
    // 标签组件
    Tag: {
      borderRadius: ${designTokens.borderRadius.sm},
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
      borderRadius: ${designTokens.borderRadius.sm},
    },
    
    // 分页组件
    Pagination: {
      borderRadius: ${designTokens.borderRadius.md},
    },
    
    // 菜单组件
    Menu: {
      borderRadius: ${designTokens.borderRadius.md},
      itemBorderRadius: ${designTokens.borderRadius.sm},
      colorText: '${designTokens.colors.text}',
      colorTextSecondary: '${designTokens.colors.textSecondary}',
      colorTextTertiary: '${designTokens.colors.textTertiary}',
      colorTextQuaternary: '${designTokens.colors.textQuaternary}',
      colorTextDisabled: '${designTokens.colors.textDisabled}',
      colorBgContainer: '${designTokens.colors.bgContainer}',
      colorBgElevated: '${designTokens.colors.bgElevated}',
      colorPrimary: '${designTokens.colors.primary}',
      colorPrimaryHover: '${designTokens.colors.primaryHover}',
      colorPrimaryActive: '${designTokens.colors.primaryActive}',
      colorBorder: '${designTokens.colors.border}',
      colorBorderSecondary: '${designTokens.colors.borderSecondary}',
      motionDurationFast: '${designTokens.motion.durationFast}',
      motionDurationMid: '${designTokens.motion.durationMid}',
      motionDurationSlow: '${designTokens.motion.durationSlow}',
      motionEaseInOut: '${designTokens.motion.easeInOut}',
      motionEaseOut: '${designTokens.motion.easeOut}',
      motionEaseIn: '${designTokens.motion.easeIn}',
    },
    
    // Tab 组件
    Tabs: {
      borderRadius: ${designTokens.borderRadius.md},
      colorText: '${designTokens.colors.text}',
      colorTextSecondary: '${designTokens.colors.textSecondary}',
      colorTextTertiary: '${designTokens.colors.textTertiary}',
      colorTextQuaternary: '${designTokens.colors.textQuaternary}',
      colorTextDisabled: '${designTokens.colors.textDisabled}',
      colorBgContainer: '${designTokens.colors.bgContainer}',
      colorBgElevated: '${designTokens.colors.bgElevated}',
      colorPrimary: '${designTokens.colors.primary}',
      colorPrimaryHover: '${designTokens.colors.primaryHover}',
      colorPrimaryActive: '${designTokens.colors.primaryActive}',
      colorBorder: '${designTokens.colors.border}',
      colorBorderSecondary: '${designTokens.colors.borderSecondary}',
      colorFillSecondary: '${designTokens.colors.bgLayout}',
      colorFillTertiary: '${designTokens.colors.bgSpotlight}',
      colorFillQuaternary: '${designTokens.colors.bgElevated}',
      motionDurationFast: '${designTokens.motion.durationFast}',
      motionDurationMid: '${designTokens.motion.durationMid}',
      motionDurationSlow: '${designTokens.motion.durationSlow}',
      motionEaseInOut: '${designTokens.motion.easeInOut}',
      motionEaseOut: '${designTokens.motion.easeOut}',
      motionEaseIn: '${designTokens.motion.easeIn}',
    },
    
    // 面包屑组件
    Breadcrumb: {
      fontSize: 14,
      linkColor: '${designTokens.colors.primary}',
      linkHoverColor: '${designTokens.colors.primaryHover}',
    },
    
    // 步骤条组件
    Steps: {
      borderRadius: ${designTokens.borderRadius.md},
    },
    
    // 时间轴组件
    Timeline: {
      fontSize: 14,
    },
    
    // 折叠面板组件
    Collapse: {
      borderRadius: ${designTokens.borderRadius.md},
      headerBg: '${designTokens.colors.bgSpotlight}',
    },
    
    // 手风琴组件
    Accordion: {
      borderRadius: ${designTokens.borderRadius.md},
      headerBg: '${designTokens.colors.bgSpotlight}',
    },
  },
};

// 深色主题
export const darkTheme: ThemeConfig = {
  ...theme,
  token: {
    ...theme.token,
    // 深色主题颜色调整
    colorPrimary: '${designTokens.colors.dark.primary}',
    colorSuccess: '${designTokens.colors.dark.success}',
    colorWarning: '${designTokens.colors.dark.warning}',
    colorError: '${designTokens.colors.dark.error}',
    colorInfo: '${designTokens.colors.dark.info}',
    
    // 深色背景
    colorBgBase: '${designTokens.colors.dark.bg}',
    colorBgContainer: '${designTokens.colors.dark.bgContainer}',
    colorBgElevated: '${designTokens.colors.dark.bgElevated}',
    colorBgLayout: '${designTokens.colors.dark.bgLayout}',
    colorBgSpotlight: '${designTokens.colors.dark.bgSpotlight}',
    colorBgMask: '${designTokens.colors.dark.bgMask}',
    
    // 深色文字
    colorTextBase: '${designTokens.colors.dark.text}',
    colorTextSecondary: '${designTokens.colors.dark.textSecondary}',
    colorTextTertiary: '${designTokens.colors.dark.textTertiary}',
    colorTextQuaternary: '${designTokens.colors.dark.textQuaternary}',
    colorTextDisabled: '${designTokens.colors.dark.textDisabled}',
    
    // 深色边框
    colorBorder: '${designTokens.colors.dark.border}',
    colorBorderSecondary: '${designTokens.colors.dark.borderSecondary}',
    colorSplit: '${designTokens.colors.dark.borderSplit}',
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
      colorPrimary: '${designTokens.colors.primary}',
    },
  },
  green: {
    ...theme,
    token: {
      ...theme.token,
      colorPrimary: '${designTokens.colors.success}',
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
  xs: ${designTokens.breakpoints.xs},
  sm: ${designTokens.breakpoints.sm},
  md: ${designTokens.breakpoints.md},
  lg: ${designTokens.breakpoints.lg},
  xl: ${designTokens.breakpoints.xl},
  xxl: ${designTokens.breakpoints.xxl},
};

// 媒体查询工具
export const mediaQueries = {
  xs: \`@media (max-width: \${breakpoints.xs}px)\`,
  sm: \`@media (max-width: \${breakpoints.sm}px)\`,
  md: \`@media (max-width: \${breakpoints.md}px)\`,
  lg: \`@media (max-width: \${breakpoints.lg}px)\`,
  xl: \`@media (max-width: \${breakpoints.xl}px)\`,
  xxl: \`@media (max-width: \${breakpoints.xxl}px)\`,
};
`;

  // 写入文件
  const outputPath = path.join(__dirname, '../src/lib/theme.ts');
  fs.writeFileSync(outputPath, theme);
  console.log('✅ Ant Design 主题配置已生成到 src/lib/theme.ts');
}

// 运行生成函数
generateAntdTheme();
