import { prisma } from './prisma'
import { User, Post, Comment, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

// 用户操作
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

  // 根据邮箱查找用户
  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    })
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

  // 获取用户列表
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

// 文章操作
export class PostService {
  // 创建文章
  static async createPost(data: {
    title: string
    content?: string
    summary?: string
    slug: string
    category?: string
    tags?: string[]
    authorId: number
    published?: boolean
  }) {
    return prisma.post.create({
      data,
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
    })
  }

  // 获取文章列表
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

    return {
      posts,
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

  // 根据ID获取文章
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

  // 根据slug获取文章
  static async getPostBySlug(slug: string) {
    return prisma.post.findUnique({
      where: { slug },
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
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }

  // 更新文章
  static async updatePost(id: number, data: Partial<Post>) {
    return prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })
  }

  // 删除文章
  static async deletePost(id: number) {
    return prisma.post.delete({
      where: { id },
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

  // 点赞文章
  static async likePost(id: number) {
    return prisma.post.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
    })
  }
}

// 评论操作
export class CommentService {
  // 创建评论
  static async createComment(data: {
    content: string
    authorId: number
    postId: number
    parentId?: number
  }) {
    return prisma.comment.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
  }

  // 获取评论列表
  static async getComments(postId: number) {
    return prisma.comment.findMany({
      where: { postId },
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
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  // 删除评论
  static async deleteComment(id: number) {
    return prisma.comment.delete({
      where: { id },
    })
  }
} 