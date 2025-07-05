import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('开始种子数据初始化...')

  // 创建管理员用户
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '系统管理员',
      password: adminPassword,
      role: Role.ADMIN,
      bio: '系统管理员账户',
    },
  })

  // 创建普通用户
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: '普通用户',
      password: userPassword,
      role: Role.USER,
      bio: '这是一个普通用户账户',
    },
  })

  // 创建作者用户
  const authorPassword = await bcrypt.hash('author123', 10)
  const author = await prisma.user.upsert({
    where: { email: 'author@example.com' },
    update: {},
    create: {
      email: 'author@example.com',
      name: '内容作者',
      password: authorPassword,
      role: Role.MODERATOR,
      bio: '专业的内容创作者',
    },
  })

  console.log('用户创建完成:', { admin: admin.id, user: user.id, author: author.id })

  // 创建示例文章
  const posts = [
    {
      title: 'Next.js 15 新特性详解',
      slug: 'nextjs-15-features',
      summary: '深入了解Next.js 15的新特性和改进，包括App Router、Server Components等。',
      content: `# Next.js 15 新特性详解

Next.js 15 带来了许多令人兴奋的新特性和改进。

## 主要特性

### 1. App Router 稳定版
App Router 现在已经稳定，提供了更好的性能和开发体验。

### 2. Server Components
服务器组件让我们能够在服务器端渲染React组件，提高性能。

### 3. 改进的缓存机制
新的缓存策略让应用更快更高效。

## 总结

Next.js 15 是一个重要的版本，值得每个开发者关注。`,
      category: '技术教程',
      tags: ['Next.js', 'React', '前端开发'],
      published: true,
      authorId: author.id,
    },
    {
      title: 'TypeScript 最佳实践',
      slug: 'typescript-best-practices',
      summary: '分享TypeScript开发中的最佳实践和常见陷阱。',
      content: `# TypeScript 最佳实践

TypeScript 是现代前端开发的重要工具。

## 类型定义

### 1. 接口 vs 类型别名
- 接口用于定义对象结构
- 类型别名用于复杂类型

### 2. 泛型使用
泛型让代码更加灵活和可重用。

## 总结

掌握这些最佳实践，让你的TypeScript代码更加健壮。`,
      category: '编程语言',
      tags: ['TypeScript', 'JavaScript', '类型系统'],
      published: true,
      authorId: author.id,
    },
    {
      title: 'Prisma ORM 入门指南',
      slug: 'prisma-orm-guide',
      summary: '从零开始学习Prisma ORM，包括安装、配置和基本使用。',
      content: `# Prisma ORM 入门指南

Prisma 是一个现代化的数据库工具包。

## 安装配置

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

## 数据模型定义

在schema.prisma文件中定义数据模型。

## 数据库操作

使用Prisma Client进行数据库操作。

## 总结

Prisma让数据库操作变得简单而安全。`,
      category: '数据库',
      tags: ['Prisma', 'ORM', '数据库'],
      published: false,
      authorId: admin.id,
    },
  ]

  for (const postData of posts) {
    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: postData,
    })
    console.log('文章创建完成:', post.title)
  }

  // 创建示例评论
  const publishedPosts = await prisma.post.findMany({
    where: { published: true },
    take: 2,
  })

  if (publishedPosts.length > 0) {
    const comments = [
      {
        content: '这篇文章写得很好，学到了很多！',
        authorId: user.id,
        postId: publishedPosts[0].id,
      },
      {
        content: '感谢分享，对我很有帮助。',
        authorId: admin.id,
        postId: publishedPosts[0].id,
      },
      {
        content: '期待更多这样的技术文章。',
        authorId: user.id,
        postId: publishedPosts[1].id,
      },
    ]

    for (const commentData of comments) {
      const comment = await prisma.comment.create({
        data: commentData,
      })
      console.log('评论创建完成:', comment.id)
    }
  }

  console.log('种子数据初始化完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 