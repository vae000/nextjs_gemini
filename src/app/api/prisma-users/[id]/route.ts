import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/db-operations'
import { Role } from '@prisma/client'

// GET请求 - 获取单个用户
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = parseInt(id)
    
    // 验证ID格式
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: '无效的用户ID' },
        { status: 400 }
      )
    }
    
    // 查找用户
    const user = await UserService.findUserById(userId)
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    })
    
  } catch (error) {
    console.error('获取用户详情错误:', error)
    return NextResponse.json(
      { error: '获取用户详情失败' },
      { status: 500 }
    )
  }
}

// PUT请求 - 更新用户
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = parseInt(id)
    const body = await request.json()
    
    // 验证ID格式
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: '无效的用户ID' },
        { status: 400 }
      )
    }
    
    // 验证邮箱格式（如果提供）
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { error: '邮箱格式不正确' },
          { status: 400 }
        )
      }
    }
    
    // 验证角色（如果提供）
    if (body.role && !Object.values(Role).includes(body.role)) {
      return NextResponse.json(
        { error: '无效的用户角色' },
        { status: 400 }
      )
    }
    
    // 更新用户
    const updatedUser = await UserService.updateUser(userId, {
      name: body.name,
      email: body.email,
      role: body.role,
      avatar: body.avatar,
      bio: body.bio,
    })
    
    return NextResponse.json({
      success: true,
      message: '用户更新成功',
      data: updatedUser,
      timestamp: new Date().toISOString(),
    })
    
  } catch (error: any) {
    console.error('更新用户错误:', error)
    
    // 处理Prisma错误
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: '邮箱已被使用' },
        { status: 409 }
      )
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: '更新用户失败' },
      { status: 500 }
    )
  }
}

// DELETE请求 - 删除用户
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = parseInt(id)
    
    // 验证ID格式
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: '无效的用户ID' },
        { status: 400 }
      )
    }
    
    // 删除用户
    await UserService.deleteUser(userId)
    
    return NextResponse.json({
      success: true,
      message: '用户删除成功',
      timestamp: new Date().toISOString(),
    })
    
  } catch (error: any) {
    console.error('删除用户错误:', error)
    
    // 处理Prisma错误
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: '删除用户失败' },
      { status: 500 }
    )
  }
} 