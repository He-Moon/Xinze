import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('开始创建种子数据...');

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('123456', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '管理员',
      password: hashedPassword,
    },
  });

  console.log('创建用户:', user);

  // 创建示例任务
  const task1 = await prisma.task.create({
    data: {
      title: '完成项目文档',
      description: '编写详细的项目说明文档',
      type: 'task',
      content: '需要包含API文档、部署指南等',
      priority: 3,
      status: 'pending',
      userId: user.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: '学习新技术',
      description: '学习React Native开发',
      type: 'idea',
      content: '移动端开发技能提升',
      priority: 2,
      status: 'in_progress',
      userId: user.id,
    },
  });

  console.log('创建任务:', task1, task2);

  // 创建示例目标
  const goal = await prisma.goal.create({
    data: {
      title: '成为全栈开发者',
      description: '掌握前后端开发技能',
      priority: 5,
      status: 'active',
      userId: user.id,
    },
  });

  console.log('创建目标:', goal);

  // 创建示例价值观
  const value1 = await prisma.value.create({
    data: {
      name: '学习成长',
      description: '持续学习和自我提升',
      weight: 9,
      userId: user.id,
    },
  });

  const value2 = await prisma.value.create({
    data: {
      name: '工作效率',
      description: '高效完成工作任务',
      weight: 8,
      userId: user.id,
    },
  });

  console.log('创建价值观:', value1, value2);

  console.log('种子数据创建完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
