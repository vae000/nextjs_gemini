import { PrismaClient } from '@prisma/client'

// 防止在开发环境中创建多个Prisma客户端实例
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// 在开发环境中将Prisma客户端实例保存到全局变量
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// 导出Prisma类型
export type { User, Post, Comment, Role } from '@prisma/client' 