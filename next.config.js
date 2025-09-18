/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除过时的 appDir 配置
  images: {
    domains: ['localhost'],
  },
  
  // 优化编译性能
  swcMinify: true,
  
  // 实验性功能
  experimental: {
    // 其他实验性功能可以在这里添加
  },
  
  // 仅在非 Turbopack 模式下使用 webpack 配置
  ...(process.env.TURBOPACK !== '1' && {
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
    webpack: (config, { dev, isServer }) => {
      // 确保路径别名解析
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': require('path').resolve(__dirname, 'src'),
      };
      
      if (dev) {
        // 开发环境优化
        config.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
        };
      }
      return config;
    },
  }),
  
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-Requested-With' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;