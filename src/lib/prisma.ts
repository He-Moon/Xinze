import { PrismaClient } from '@prisma/client';

// 为 Vercel 无服务器环境优化的 Prisma 配置
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // 连接池配置
    transactionOptions: {
      maxWait: 5000, // 5秒
      timeout: 10000, // 10秒
    },
  });
};

// 在 Vercel 环境中，每次都创建新的客户端实例以避免 prepared statement 冲突
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 只在非 Vercel 环境中使用全局实例
export const prisma = process.env.VERCEL 
  ? createPrismaClient()
  : globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient());

// 优雅关闭处理
if (typeof window === 'undefined' && !process.env.VERCEL) {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

// 错误处理包装器
export const withPrisma = async <T>(
  operation: (prisma: PrismaClient) => Promise<T>
): Promise<T> => {
  try {
    return await operation(prisma);
  } catch (error) {
    console.error('Prisma operation error:', error);
    throw error;
  }
};

export default prisma;
