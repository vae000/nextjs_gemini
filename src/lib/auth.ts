import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'
import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'

/**
 * 获取服务器端会话
 */
export async function getSession() {
  return await getServerSession(authOptions)
}

/**
 * 认证中间件 - 检查用户是否已登录
 */
export async function requireAuth() {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json(
      { error: '未登录，请先登录' },
      { status: 401 }
    )
  }
  
  return { session, user: session.user }
}

/**
 * 角色检查中间件 - 检查用户是否有指定角色
 */
export async function requireRole(allowedRoles: Role[]) {
  const authResult = await requireAuth()
  
  if (authResult instanceof NextResponse) {
    return authResult // 返回错误响应
  }
  
  const { session, user } = authResult
  
  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: '权限不足，无法访问此资源' },
      { status: 403 }
    )
  }
  
  return { session, user }
}

/**
 * 管理员权限检查
 */
export async function requireAdmin() {
  return await requireRole([Role.ADMIN])
}

/**
 * 管理员或版主权限检查
 */
export async function requireModerator() {
  return await requireRole([Role.ADMIN, Role.MODERATOR])
}

/**
 * 检查用户是否为资源所有者或管理员
 */
export async function requireOwnershipOrAdmin(resourceUserId: string) {
  const authResult = await requireAuth()
  
  if (authResult instanceof NextResponse) {
    return authResult
  }
  
  const { session, user } = authResult
  
  // 如果是管理员或者是资源所有者，则允许访问
  if (user.role === Role.ADMIN || user.id === resourceUserId) {
    return { session, user }
  }
  
  return NextResponse.json(
    { error: '权限不足，只能访问自己的资源' },
    { status: 403 }
  )
}

/**
 * API 路由认证装饰器
 */
export function withAuth(handler: (request: NextRequest, context: { session: any; user: any }) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authResult = await requireAuth()
    
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    return handler(request, authResult)
  }
}

/**
 * API 路由角色检查装饰器
 */
export function withRole(allowedRoles: Role[], handler: (request: NextRequest, context: { session: any; user: any }) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authResult = await requireRole(allowedRoles)
    
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    return handler(request, authResult)
  }
}

/**
 * 用户信息类型定义
 */
export interface AuthenticatedUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: Role
}

/**
 * 认证上下文类型定义
 */
export interface AuthContext {
  session: any
  user: AuthenticatedUser
}
