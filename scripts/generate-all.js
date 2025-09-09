#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 开始生成所有样式配置文件...\n');

try {
  // 生成 CSS 变量
  console.log('📝 生成 CSS 变量...');
  execSync('node scripts/generate-css-variables.js', { stdio: 'inherit' });
  
  
  // 生成 Ant Design 主题
  console.log('🎨 生成 Ant Design 主题...');
  execSync('node scripts/generate-antd-theme.js', { stdio: 'inherit' });
  
  console.log('\n✅ 所有样式配置文件生成完成！');
  console.log('\n📋 生成的文件：');
  console.log('  - src/styles/variables.css');
  console.log('  - src/lib/theme.ts');
  console.log('\n💡 使用说明：');
  console.log('  1. 修改 src/lib/design-tokens.ts 中的设计令牌');
  console.log('  2. 运行 npm run generate:styles 重新生成所有配置');
  console.log('  3. 在项目中使用生成的文件');
  
} catch (error) {
  console.error('❌ 生成失败:', error.message);
  process.exit(1);
}
