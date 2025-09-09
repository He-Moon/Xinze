# 样式系统使用指南

## 🎯 设计理念

本项目采用**单一数据源**的设计理念，所有样式配置都从 `src/lib/design-tokens.ts` 自动生成，确保一致性并简化维护。

## 📁 文件结构

```
src/
├── lib/
│   ├── design-tokens.ts          # 🎯 单一数据源 - 所有设计令牌
│   └── theme.ts                  # 🤖 自动生成的 Ant Design 主题
├── styles/
│   ├── variables.css             # 🤖 自动生成的 CSS 变量
│   └── antd-custom.css          # 🎨 自定义 Ant Design 样式
├── app/
│   └── globals.css               # 🌐 全局样式（引用自动生成的文件）
scripts/
├── generate-all.js              # 🚀 生成所有配置文件
├── generate-css-variables.js    # 📝 生成 CSS 变量
├── generate-tailwind-config.js  # ⚡ 生成 Tailwind 配置
└── generate-antd-theme.js       # 🎨 生成 Ant Design 主题
```

## 🚀 快速开始

### 1. 生成所有配置文件

```bash
# 生成所有样式配置文件
npm run generate:styles

# 或者分别生成
npm run generate:css      # 生成 CSS 变量
npm run generate:tailwind # 生成 Tailwind 配置
npm run generate:antd     # 生成 Ant Design 主题
```

### 2. 修改设计令牌

编辑 `src/lib/design-tokens.ts` 文件：

```typescript
export const designTokens = {
  colors: {
    primary: '#1890ff',        // 修改主色
    success: '#52c41a',        // 修改成功色
    // ... 其他颜色
  },
  spacing: {
    lg: 16,                    // 修改间距
    xl: 24,
    // ... 其他间距
  },
  // ... 其他设计令牌
};
```

### 3. 重新生成配置

```bash
npm run generate:styles
```

## 🎨 使用方式

### CSS 变量

在 CSS 中使用自动生成的变量：

```css
.my-component {
  color: var(--primary-color);
  background: var(--bg-color);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
}
```

### Tailwind 类

使用自动生成的 Tailwind 类：

```jsx
<div className="bg-primary text-white p-lg rounded-md shadow-md">
  使用 Tailwind 类
</div>
```

### Ant Design 主题

使用自动生成的主题：

```tsx
import { theme } from '@/lib/theme';

<ConfigProvider theme={theme}>
  <App />
</ConfigProvider>
```

## 🔧 自定义样式

### 1. 添加新的设计令牌

在 `src/lib/design-tokens.ts` 中添加：

```typescript
export const designTokens = {
  colors: {
    // 现有颜色...
    brand: '#ff6b6b',  // 新增品牌色
  },
  spacing: {
    // 现有间距...
    brand: 20,         // 新增品牌间距
  },
};
```

### 2. 重新生成配置

```bash
npm run generate:styles
```

### 3. 使用新令牌

```css
.brand-button {
  background: var(--brand-color);
  padding: var(--spacing-brand);
}
```

## 📱 响应式设计

使用自动生成的断点：

```css
@media (max-width: var(--breakpoint-md)) {
  .mobile-only {
    display: block;
  }
}
```

或使用 Tailwind 类：

```jsx
<div className="hidden md:block">
  桌面端显示
</div>
```

## 🌙 深色主题

深色主题会自动应用，无需额外配置：

```css
/* 自动支持深色主题 */
.my-component {
  color: var(--text-color);        /* 浅色: #262626, 深色: #ffffff */
  background: var(--bg-color);     /* 浅色: #ffffff, 深色: #141414 */
}
```

## 🎯 最佳实践

### 1. 优先使用设计令牌

```typescript
// ✅ 推荐：使用设计令牌
const primaryColor = designTokens.colors.primary;

// ❌ 避免：硬编码颜色
const primaryColor = '#1890ff';
```

### 2. 使用 CSS 变量

```css
/* ✅ 推荐：使用 CSS 变量 */
.button {
  color: var(--primary-color);
}

/* ❌ 避免：硬编码颜色 */
.button {
  color: #1890ff;
}
```

### 3. 使用 Tailwind 类

```jsx
// ✅ 推荐：使用 Tailwind 类
<div className="p-lg rounded-md shadow-md">

// ❌ 避免：内联样式
<div style={{ padding: '16px', borderRadius: '6px' }}>
```

## 🔄 工作流程

1. **修改设计令牌** → 编辑 `src/lib/design-tokens.ts`
2. **重新生成配置** → 运行 `npm run generate:styles`
3. **使用新样式** → 在组件中使用生成的类或变量
4. **测试验证** → 确保所有主题和响应式效果正常

## 🚨 注意事项

- **不要手动修改**生成的文件（`*.generated.*`）
- **始终从** `design-tokens.ts` 修改设计系统
- **生成后**记得提交所有生成的文件到版本控制
- **团队协作**时确保所有人使用相同的设计令牌

## 📚 相关文档

- [Ant Design 主题定制](https://ant.design/docs/react/customize-theme-cn)
- [Tailwind CSS 配置](https://tailwindcss.com/docs/configuration)
- [CSS 自定义属性](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
