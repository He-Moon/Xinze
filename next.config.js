/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除过时的 appDir 配置
  images: {
    domains: ['localhost'],
  },
  
  // 优化编译性能
  swcMinify: true,
  
  // 仅在非 Turbopack 模式下使用 webpack 配置
  ...(process.env.TURBOPACK !== '1' && {
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
    webpack: (config, { dev, isServer }) => {
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
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;