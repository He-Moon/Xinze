#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 导入设计令牌
const { designTokens } = require('../src/lib/design-tokens.ts');

/**
 * 生成 CSS 变量
 */
function generateCSSVariables() {
  let css = `/* 自动生成的 CSS 变量 - 请勿手动修改 */
/* 此文件由 scripts/generate-css-variables.js 自动生成 */
/* 如需修改，请编辑 src/lib/design-tokens.ts */

:root {
  /* 主色系 */
  --primary-color: ${designTokens.colors.primary};
  --primary-color-hover: ${designTokens.colors.primaryHover};
  --primary-color-active: ${designTokens.colors.primaryActive};
  --primary-color-light: ${designTokens.colors.primaryLight};
  
  /* 功能色 */
  --success-color: ${designTokens.colors.success};
  --success-color-hover: ${designTokens.colors.successHover};
  --warning-color: ${designTokens.colors.warning};
  --warning-color-hover: ${designTokens.colors.warningHover};
  --error-color: ${designTokens.colors.error};
  --error-color-hover: ${designTokens.colors.errorHover};
  --info-color: ${designTokens.colors.info};
  --info-color-hover: ${designTokens.colors.infoHover};
  
  /* 文本色 */
  --text-color: ${designTokens.colors.text};
  --text-color-secondary: ${designTokens.colors.textSecondary};
  --text-color-tertiary: ${designTokens.colors.textTertiary};
  --text-color-quaternary: ${designTokens.colors.textQuaternary};
  --text-color-disabled: ${designTokens.colors.textDisabled};
  
  /* 背景色 */
  --bg-color: ${designTokens.colors.bg};
  --bg-color-container: ${designTokens.colors.bgContainer};
  --bg-color-elevated: ${designTokens.colors.bgElevated};
  --bg-color-layout: ${designTokens.colors.bgLayout};
  --bg-color-spotlight: ${designTokens.colors.bgSpotlight};
  --bg-color-mask: ${designTokens.colors.bgMask};
  
  /* 边框色 */
  --border-color: ${designTokens.colors.border};
  --border-color-secondary: ${designTokens.colors.borderSecondary};
  --border-color-split: ${designTokens.colors.borderSplit};
  
  /* 间距系统 */
  --spacing-xs: ${designTokens.spacing.xs}px;
  --spacing-sm: ${designTokens.spacing.sm}px;
  --spacing-md: ${designTokens.spacing.md}px;
  --spacing-lg: ${designTokens.spacing.lg}px;
  --spacing-xl: ${designTokens.spacing.xl}px;
  --spacing-xxl: ${designTokens.spacing.xxl}px;
  --spacing-xxxl: ${designTokens.spacing.xxxl}px;
  
  /* 圆角系统 */
  --border-radius-none: ${designTokens.borderRadius.none}px;
  --border-radius-sm: ${designTokens.borderRadius.sm}px;
  --border-radius-md: ${designTokens.borderRadius.md}px;
  --border-radius-lg: ${designTokens.borderRadius.lg}px;
  --border-radius-round: ${designTokens.borderRadius.round};
  
  /* 阴影系统 */
  --shadow-none: ${designTokens.shadows.none};
  --shadow-sm: ${designTokens.shadows.sm};
  --shadow-md: ${designTokens.shadows.md};
  --shadow-lg: ${designTokens.shadows.lg};
  
  /* 字体系统 */
  --font-family: ${designTokens.typography.fontFamily};
  --font-family-code: ${designTokens.typography.fontFamilyCode};
  --font-size: ${designTokens.typography.fontSize}px;
  --font-size-xs: ${designTokens.typography.fontSizeXs}px;
  --font-size-sm: ${designTokens.typography.fontSizeSm}px;
  --font-size-lg: ${designTokens.typography.fontSizeLg}px;
  --font-size-xl: ${designTokens.typography.fontSizeXl}px;
  --font-size-xxl: ${designTokens.typography.fontSizeXxl}px;
  --line-height: ${designTokens.typography.lineHeight};
  --line-height-xs: ${designTokens.typography.lineHeightXs};
  --line-height-sm: ${designTokens.typography.lineHeightSm};
  --line-height-lg: ${designTokens.typography.lineHeightLg};
  --line-height-xl: ${designTokens.typography.lineHeightXl};
  --line-height-xxl: ${designTokens.typography.lineHeightXxl};
  
  /* 动画系统 */
  --motion-duration-fast: ${designTokens.motion.durationFast};
  --motion-duration-mid: ${designTokens.motion.durationMid};
  --motion-duration-slow: ${designTokens.motion.durationSlow};
  --motion-ease-in-out: ${designTokens.motion.easeInOut};
  --motion-ease-out: ${designTokens.motion.easeOut};
  --motion-ease-in: ${designTokens.motion.easeIn};
  
  /* 断点系统 */
  --breakpoint-xs: ${designTokens.breakpoints.xs}px;
  --breakpoint-sm: ${designTokens.breakpoints.sm}px;
  --breakpoint-md: ${designTokens.breakpoints.md}px;
  --breakpoint-lg: ${designTokens.breakpoints.lg}px;
  --breakpoint-xl: ${designTokens.breakpoints.xl}px;
  --breakpoint-xxl: ${designTokens.breakpoints.xxl}px;
  
  /* 层级系统 */
  --z-index-modal: ${designTokens.zIndex.modal};
  --z-index-popover: ${designTokens.zIndex.popover};
  --z-index-tooltip: ${designTokens.zIndex.tooltip};
  --z-index-notification: ${designTokens.zIndex.notification};
  --z-index-message: ${designTokens.zIndex.message};
  --z-index-drawer: ${designTokens.zIndex.drawer};
}

/* 深色主题变量 */
@media (prefers-color-scheme: dark) {
  :root {
    /* 深色主色系 */
    --primary-color: ${designTokens.colors.dark.primary};
    --primary-color-hover: ${designTokens.colors.dark.primaryHover};
    --primary-color-active: ${designTokens.colors.dark.primaryActive};
    --primary-color-light: ${designTokens.colors.dark.primaryLight};
    
    /* 深色功能色 */
    --success-color: ${designTokens.colors.dark.success};
    --success-color-hover: ${designTokens.colors.dark.successHover};
    --warning-color: ${designTokens.colors.dark.warning};
    --warning-color-hover: ${designTokens.colors.dark.warningHover};
    --error-color: ${designTokens.colors.dark.error};
    --error-color-hover: ${designTokens.colors.dark.errorHover};
    --info-color: ${designTokens.colors.dark.info};
    --info-color-hover: ${designTokens.colors.dark.infoHover};
    
    /* 深色文本色 */
    --text-color: ${designTokens.colors.dark.text};
    --text-color-secondary: ${designTokens.colors.dark.textSecondary};
    --text-color-tertiary: ${designTokens.colors.dark.textTertiary};
    --text-color-quaternary: ${designTokens.colors.dark.textQuaternary};
    --text-color-disabled: ${designTokens.colors.dark.textDisabled};
    
    /* 深色背景色 */
    --bg-color: ${designTokens.colors.dark.bg};
    --bg-color-container: ${designTokens.colors.dark.bgContainer};
    --bg-color-elevated: ${designTokens.colors.dark.bgElevated};
    --bg-color-layout: ${designTokens.colors.dark.bgLayout};
    --bg-color-spotlight: ${designTokens.colors.dark.bgSpotlight};
    --bg-color-mask: ${designTokens.colors.dark.bgMask};
    
    /* 深色边框色 */
    --border-color: ${designTokens.colors.dark.border};
    --border-color-secondary: ${designTokens.colors.dark.borderSecondary};
    --border-color-split: ${designTokens.colors.dark.borderSplit};
  }
}
`;

  // 写入文件
  const outputPath = path.join(__dirname, '../src/styles/variables.css');
  fs.writeFileSync(outputPath, css);
  console.log('✅ CSS 变量已生成到 src/styles/variables.css');
}

// 运行生成函数
generateCSSVariables();
