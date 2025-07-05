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
    
    // 验证角色
    if (body.role && !Object.values(Role).includes(body.role)) {
      return NextResponse.json(
        { error: '无效的用户角色' },
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