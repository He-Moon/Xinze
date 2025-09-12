# 样式系统

## 设计理念
所有样式配置从 `src/lib/design-tokens.ts` 自动生成，确保一致性。

## 快速使用

### 修改样式
编辑 `src/lib/design-tokens.ts` 文件，然后运行：
```bash
npm run generate:styles
```

### 使用方式
- **CSS变量**: `var(--primary-color)`
- **Ant Design**: 自动应用主题
- **响应式**: 使用断点变量