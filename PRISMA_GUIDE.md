# 🗄️ Prisma ORM 完整使用指南

> 在Next.js项目中集成和使用Prisma ORM的完整指南

## 📋 目录

1. [项目概述](#项目概述)
2. [安装和配置](#安装和配置)
3. [数据模型设计](#数据模型设计)
4. [数据库操作](#数据库操作)
5. [API集成](#api集成)
6. [最佳实践](#最佳实践)
7. [常见问题](#常见问题)

---

## 🎯 项目概述

本项目演示了如何在Next.js 15项目中集成Prisma ORM，包括：

- **用户管理系统**：用户注册、登录、角色管理
- **文章系统**：文章发布、分类、标签管理
- **评论系统**：文章评论、回复功能
- **完整的API Routes**：RESTful API设计
- **类型安全**：TypeScript全面支持

### 技术栈

- **Next.js 15**：App Router + Server Components
- **Prisma ORM**：数据库操作和类型生成
- **PostgreSQL**：关系型数据库
- **TypeScript**：类型安全
- **bcrypt**：密码加密
- **Tailwind CSS**：样式框架

---

## 🔧 安装和配置

### 1. 安装依赖

```bash
# 安装Prisma核心包
npm install prisma @prisma/client

# 安装密码加密库
npm install bcrypt @types/bcrypt

# 安装TypeScript执行器（用于种子文件）
npm install -D tsx
```

### 2. 初始化Prisma

```bash
# 初始化Prisma项目
npx prisma init
```

这会创建：
- `prisma/schema.prisma`：数据模型定义文件
- `.env`：环境变量文件（需要手动配置）

### 3. 配置环境变量

在项目根目录创建`.env.local`文件：

```env
# 数据库连接字符串
DATABASE_URL="postgresql://username:password@localhost:5432/nextjs_gemini_db"

# 开发环境配置
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 配置package.json脚本

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

## 📊 数据模型设计

### Schema文件结构

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 用户模型
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  avatar    String?
  bio       String?
  posts     Post[]
  comments  Comment[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

// 文章模型
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  summary   String?
  published Boolean  @default(false)
  slug      String   @unique
  category  String?
  tags      String[]
  readTime  Int?     @default(5)
  views     Int      @default(0)
  likes     Int      @default(0)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  Int
  comments  Comment[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}

// 评论模型
model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  Int
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    Int
  parentId  Int?     // 用于回复评论
  parent    Comment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("comments")
}

// 用户角色枚举
enum Role {
  USER
  ADMIN
  MODERATOR
}
```

### 关键设计要点

1. **关系设计**：
   - 用户与文章：一对多关系
   - 用户与评论：一对多关系
   - 文章与评论：一对多关系
   - 评论自引用：支持回复功能

2. **数据类型**：
   - `String[]`：标签数组
   - `DateTime`：时间戳
   - `Boolean`：发布状态
   - `Int`：数值类型

3. **约束和索引**：
   - `@unique`：唯一约束
   - `@default`：默认值
   - `@map`：表名映射
   - `onDelete: Cascade`：级联删除

---

## 🔄 数据库操作

### 1. Prisma客户端配置

```typescript
// src/lib/prisma.ts
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
```

### 2. 数据操作封装

```typescript
// src/lib/db-operations.ts
import { prisma } from './prisma'
import { User, Post, Comment, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

// 用户操作类
export class UserService {
  // 创建用户
  static async createUser(data: {
    email: string
    name?: string
    password: string
    role?: Role
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  // 获取用户列表（带分页）
  static async getUsers(options: {
    page?: number
    limit?: number
    search?: string
    role?: Role
  } = {}) {
    const { page = 1, limit = 10, search, role } = options
    const skip = (page - 1) * limit

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(role && { role }),
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ])

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    }
  }

  // 根据ID查找用户
  static async findUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    })
  }

  // 更新用户信息
  static async updateUser(id: number, data: Partial<User>) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  // 删除用户
  static async deleteUser(id: number) {
    return prisma.user.delete({
      where: { id },
    })
  }
}
```

### 3. 高级查询示例

```typescript
// 复杂查询示例
export class PostService {
  // 获取文章列表（带关联数据）
  static async getPosts(options: {
    page?: number
    limit?: number
    search?: string
    category?: string
    published?: boolean
    authorId?: number
  } = {}) {
    const { page = 1, limit = 10, search, category, published, authorId } = options
    const skip = (page - 1) * limit

    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { content: { contains: search, mode: 'insensitive' as const } },
          { summary: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(category && { category }),
      ...(published !== undefined && { published }),
      ...(authorId && { authorId }),
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({ where }),
    ])

    return { posts, pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: skip + limit < total, hasPrev: page > 1 } }
  }

  // 获取文章详情（包含评论）
  static async getPostById(id: number) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }

  // 增加文章浏览量
  static async incrementViews(id: number) {
    return prisma.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    })
  }
}
```

---

## 🔗 API集成

### 1. API Routes结构

```
src/app/api/
├── prisma-users/
│   ├── route.ts          # 用户列表、创建用户
│   └── [id]/
│       └── route.ts      # 用户详情、更新、删除
├── prisma-posts/
│   ├── route.ts          # 文章列表、创建文章
│   └── [id]/
│       └── route.ts      # 文章详情、更新、删除
└── prisma-comments/
    └── route.ts          # 评论管理
```

### 2. 用户API示例

```typescript
// src/app/api/prisma-users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/db-operations'
import { Role } from '@prisma/client'

// GET请求 - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // 获取查询参数
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || undefined
    const role = searchParams.get('role') as Role | undefined
    
    // 参数验证
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: '无效的分页参数' },
        { status: 400 }
      )
    }
    
    // 获取用户数据
    const result = await UserService.getUsers({
      page,
      limit,
      search,
      role,
    })
    
    return NextResponse.json({
      success: true,
      data: result.users,
      pagination: result.pagination,
      timestamp: new Date().toISOString(),
    })
    
  } catch (error) {
    console.error('获取用户列表错误:', error)
    return NextResponse.json(
      { error: '获取用户列表失败' },
      { status: 500 }
    )
  }
}

// POST请求 - 创建新用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 数据验证
    const requiredFields = ['email', 'password']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `缺少必需字段: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      )
    }
    
    // 验证密码强度
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: '密码至少需要6个字符' },
        { status: 400 }
      )
    }
    
    // 创建用户
    const newUser = await UserService.createUser({
      email: body.email,
      name: body.name,
      password: body.password,
      role: body.role || Role.USER,
    })
    
    return NextResponse.json({
      success: true,
      message: '用户创建成功',
      data: newUser,
      timestamp: new Date().toISOString(),
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('创建用户错误:', error)
    
    // 处理Prisma错误
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: '邮箱已被使用' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: '创建用户失败' },
      { status: 500 }
    )
  }
}
```

### 3. 错误处理

```typescript
// 常见Prisma错误码处理
function handlePrismaError(error: any) {
  switch (error.code) {
    case 'P2002':
      return { error: '数据已存在（唯一约束冲突）', status: 409 }
    case 'P2003':
      return { error: '外键约束失败', status: 400 }
    case 'P2025':
      return { error: '记录不存在', status: 404 }
    case 'P2014':
      return { error: '删除失败（存在依赖关系）', status: 409 }
    default:
      return { error: '数据库操作失败', status: 500 }
  }
}
```

---

## 🌱 数据库初始化

### 1. 种子文件

```typescript
// prisma/seed.ts
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

  // 创建示例文章
  const posts = [
    {
      title: 'Next.js 15 新特性详解',
      slug: 'nextjs-15-features',
      summary: '深入了解Next.js 15的新特性和改进。',
      content: '# Next.js 15 新特性详解\n\n...',
      category: '技术教程',
      tags: ['Next.js', 'React', '前端开发'],
      published: true,
      authorId: admin.id,
    },
    // 更多文章...
  ]

  for (const postData of posts) {
    await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: postData,
    })
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
```

### 2. 数据库操作命令

```bash
# 生成Prisma客户端
npm run db:generate

# 同步数据库结构（开发环境）
npm run db:push

# 创建迁移文件（生产环境）
npm run db:migrate

# 运行种子数据
npm run db:seed

# 打开数据库管理界面
npm run db:studio
```

---

## 🎨 前端集成

### 1. 服务端组件使用

```typescript
// src/app/prisma-demo/page.tsx
import { UserService, PostService } from '@/lib/db-operations'

export default async function PrismaDemoPage() {
  // 在服务端获取数据
  let users: any[] = []
  let posts: any[] = []
  let error: string | null = null

  try {
    // 获取用户数据
    const usersResult = await UserService.getUsers({ limit: 5 })
    users = usersResult.users

    // 获取文章数据
    const postsResult = await PostService.getPosts({ limit: 5, published: true })
    posts = postsResult.posts
  } catch (err) {
    error = '数据库连接失败，请确保数据库已配置并运行'
    console.error('数据库错误:', err)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {error ? (
        <div className="error-message">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 用户列表 */}
          <div className="user-list">
            <h2>用户列表</h2>
            {users.map((user) => (
              <div key={user.id} className="user-card">
                <h3>{user.name || '未设置姓名'}</h3>
                <p>{user.email}</p>
                <span className="role-badge">{user.role}</span>
              </div>
            ))}
          </div>

          {/* 文章列表 */}
          <div className="post-list">
            <h2>文章列表</h2>
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
                <div className="post-meta">
                  <span>作者：{post.author.name}</span>
                  <span>{post.views} 次浏览</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

### 2. 客户端API调用

```typescript
// 自定义Hook示例
import { useState, useEffect } from 'react'

export function useUsers(options: {
  page?: number
  limit?: number
  search?: string
} = {}) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (options.page) params.set('page', options.page.toString())
        if (options.limit) params.set('limit', options.limit.toString())
        if (options.search) params.set('search', options.search)

        const response = await fetch(`/api/prisma-users?${params}`)
        const data = await response.json()

        if (data.success) {
          setUsers(data.data)
        } else {
          setError(data.error || '获取用户失败')
        }
      } catch (err) {
        setError('网络请求失败')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [options.page, options.limit, options.search])

  return { users, loading, error }
}
```

---

## 🏆 最佳实践

### 1. 性能优化

```typescript
// 使用select减少数据传输
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // 只选择需要的字段
  },
})

// 使用include获取关联数据
const posts = await prisma.post.findMany({
  include: {
    author: {
      select: {
        id: true,
        name: true,
      },
    },
    _count: {
      select: {
        comments: true,
      },
    },
  },
})

// 使用事务处理复杂操作
await prisma.$transaction([
  prisma.user.create({ data: userData }),
  prisma.post.create({ data: postData }),
])
```

### 2. 错误处理

```typescript
// 统一错误处理
export async function handleDatabaseOperation<T>(
  operation: () => Promise<T>
): Promise<{ data?: T; error?: string }> {
  try {
    const data = await operation()
    return { data }
  } catch (error: any) {
    console.error('数据库操作错误:', error)
    
    if (error.code?.startsWith('P')) {
      // Prisma错误
      return { error: handlePrismaError(error).error }
    }
    
    return { error: '操作失败' }
  }
}
```

### 3. 类型安全

```typescript
// 使用Prisma生成的类型
import type { User, Post, Prisma } from '@prisma/client'

// 定义包含关联数据的类型
type UserWithPosts = Prisma.UserGetPayload<{
  include: {
    posts: true
    _count: {
      select: {
        comments: true
      }
    }
  }
}>

// 使用类型安全的查询
const getUserWithPosts = async (id: number): Promise<UserWithPosts | null> => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      posts: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  })
}
```

### 4. 环境配置

```typescript
// 不同环境的配置
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
  errorFormat: 'pretty',
})

// 连接池配置
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})
```

---

## 🔍 常见问题

### 1. 数据库连接问题

**问题**：`Error: P1001: Can't reach database server`

**解决方案**：
```bash
# 检查数据库是否运行
sudo systemctl status postgresql

# 检查连接字符串
echo $DATABASE_URL

# 测试连接
npx prisma db pull
```

### 2. 类型错误

**问题**：`Module '"@prisma/client"' has no exported member 'User'`

**解决方案**：
```bash
# 生成Prisma客户端
npx prisma generate

# 重启TypeScript服务
# 在VS Code中: Ctrl+Shift+P -> TypeScript: Restart TS Server
```

### 3. 迁移问题

**问题**：Schema更改后数据库不同步

**解决方案**：
```bash
# 开发环境：直接推送更改
npx prisma db push

# 生产环境：创建迁移
npx prisma migrate dev --name describe-your-change
```

### 4. 性能问题

**问题**：查询速度慢

**解决方案**：
```typescript
// 添加数据库索引
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
  
  @@index([email])
  @@index([name])
}

// 使用查询优化
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
  where: {
    email: {
      contains: searchTerm,
      mode: 'insensitive',
    },
  },
  orderBy: {
    createdAt: 'desc',
  },
  take: 10,
})
```

---

## 🚀 部署注意事项

### 1. 环境变量

```bash
# 生产环境变量
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

### 2. 构建配置

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

### 3. Docker配置

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📚 学习资源

### 官方文档
- [Prisma官方文档](https://www.prisma.io/docs)
- [Next.js数据获取](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [PostgreSQL文档](https://www.postgresql.org/docs/)

### 实用工具
- [Prisma Studio](https://www.prisma.io/studio)：数据库可视化管理
- [Prisma ERD Generator](https://github.com/keonik/prisma-erd-generator)：生成数据库关系图
- [Prisma JSON Schema Generator](https://github.com/valentinpalkovic/prisma-json-schema-generator)：生成JSON Schema

### 最佳实践
- [Prisma最佳实践](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Next.js + Prisma示例](https://github.com/prisma/prisma-examples)

---

## 🎯 总结

通过本指南，您已经学会了：

1. ✅ **Prisma ORM的安装和配置**
2. ✅ **数据模型的设计和关系定义**
3. ✅ **数据库操作的最佳实践**
4. ✅ **API Routes的完整实现**
5. ✅ **前端集成和错误处理**
6. ✅ **性能优化和部署配置**

Prisma ORM为Next.js应用提供了强大的数据库操作能力，结合TypeScript的类型安全特性，让您能够构建稳定、高效的全栈应用。

继续探索更多高级特性，如实时订阅、数据库连接池、中间件等，进一步提升您的应用性能和用户体验！

---

**🔗 相关链接**
- [项目演示页面](/prisma-demo)
- [API接口文档](/api-guide)
- [Next.js学习路径](/NEXTJS_LEARNING_PATH.md) 