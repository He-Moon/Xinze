/**
 * 设计令牌 - 单一数据源
 * 所有颜色、间距、圆角、阴影等设计系统变量都在这里定义
 * 其他配置文件会自动从这个文件生成
 */

export const designTokens = {
  // 颜色系统 - 极简风格
  colors: {
    // 主色系 - 使用单色系
    primary: '#333333',
    primaryHover: '#555555',
    primaryActive: '#222222',
    primaryLight: '#f5f5f5',
    
    // 功能色 - 简化色彩
    success: '#4caf50',
    successHover: '#66bb6a',
    warning: '#ff9800',
    warningHover: '#ffb74d',
    error: '#f44336',
    errorHover: '#ef5350',
    info: '#2196f3',
    infoHover: '#42a5f5',
    
    // 文本色 - 灰度系统
    text: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textQuaternary: '#cccccc',
    textDisabled: '#cccccc',
    
    // 背景色 - 简洁背景
    bg: '#ffffff',
    bgContainer: '#ffffff',
    bgElevated: '#ffffff',
    bgLayout: '#fafafa',
    bgSpotlight: '#f5f5f5',
    bgMask: 'rgba(0, 0, 0, 0.5)',
    
    // 边框色 - 简化边框
    border: '#e5e5e5',
    borderSecondary: '#f0f0f0',
    borderSplit: '#f0f0f0',
    
    // 深色主题颜色 - 保持极简
    dark: {
      primary: '#ffffff',
      primaryHover: '#e0e0e0',
      primaryActive: '#f5f5f5',
      primaryLight: '#2a2a2a',
      
      success: '#4caf50',
      successHover: '#66bb6a',
      warning: '#ff9800',
      warningHover: '#ffb74d',
      error: '#f44336',
      errorHover: '#ef5350',
      info: '#2196f3',
      infoHover: '#42a5f5',
      
      text: '#ffffff',
      textSecondary: '#b3b3b3',
      textTertiary: '#808080',
      textQuaternary: '#4d4d4d',
      textDisabled: '#666666',
      
      bg: '#1a1a1a',
      bgContainer: '#2a2a2a',
      bgElevated: '#333333',
      bgLayout: '#000000',
      bgSpotlight: '#2a2a2a',
      bgMask: 'rgba(0, 0, 0, 0.7)',
      
      border: '#404040',
      borderSecondary: '#333333',
      borderSplit: '#333333',
    }
  },
  
  // 间距系统 - 简化间距
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  // 圆角系统 - 极简圆角
  borderRadius: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 8,
    round: '50%',
  },
  
  // 阴影系统 - 极简阴影
  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 2px 4px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  
  // 字体系统 - 极简字体
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontFamilyCode: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
    fontSize: 14,
    fontSizeXs: 12,
    fontSizeSm: 13,
    fontSizeLg: 16,
    fontSizeXl: 18,
    fontSizeXxl: 20,
    lineHeight: 1.5,
    lineHeightXs: 1.4,
    lineHeightSm: 1.45,
    lineHeightLg: 1.5,
    lineHeightXl: 1.4,
    lineHeightXxl: 1.3,
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    }
  },
  
  // 动画系统 - 极简动画
  motion: {
    durationFast: '0.15s',
    durationMid: '0.2s',
    durationSlow: '0.3s',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
  
  // 断点系统
  breakpoints: {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  },
  
  // 层级系统
  zIndex: {
    modal: 1000,
    popover: 1030,
    tooltip: 1060,
    notification: 1010,
    message: 1010,
    drawer: 1040,
  }
} as const;

// 类型定义
export type DesignTokens = typeof designTokens;
export type ColorTokens = typeof designTokens.colors;
export type SpacingTokens = typeof designTokens.spacing;
export type BorderRadiusTokens = typeof designTokens.borderRadius;
export type ShadowTokens = typeof designTokens.shadows;
export type TypographyTokens = typeof designTokens.typography;
export type MotionTokens = typeof designTokens.motion;
export type BreakpointTokens = typeof designTokens.breakpoints;
export type ZIndexTokens = typeof designTokens.zIndex;
