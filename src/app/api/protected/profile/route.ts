import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// 认证中间件函数
async function authenticateUser(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) {
    return { error: '未登录', status: 401 }
  }
  
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    
    // 检查token是否过期
    if (payload.exp * 1000 < Date.now()) {
      return { error: 'Token已过期', status: 401 }
    }
    
    return { user: payload }
  } catch (error) {
    return { error: '无效的Token', status: 401 }
  }
}

// 权限检查函数
function checkPermission(user: any, requiredRole?: string) {
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return { error: '权限不足', status: 403 }
  }
  return { success: true }
}

// GET请求 - 获取用户资料
export async function GET(request: NextRequest) {
  try {
    // 认证用户
    const authResult = await authenticateUser(request)
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }
    
    const user = authResult.user
    
    // 模拟获取用户详细信息
    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: '2024-01-01T00:00:00.000Z',
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: 'light',
        language: 'zh-CN',
        notifications: true
      },
      stats: {
        postsCount: 5,
        commentsCount: 20,
        likesReceived: 50
      }
    }
    
    return NextResponse.json({
      success: true,
      data: userProfile,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('获取用户资料错误:', error)
    return NextResponse.json(
      { error: '获取用户资料失败' },
      { status: 500 }
    )
  }
}

// PUT请求 - 更新用户资料
export async function PUT(request: NextRequest) {
  try {
    // 认证用户
    const authResult = await authenticateUser(request)
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }
    
    const user = authResult.user
    const body = await request.json()
    
    // 验证可更新的字段
    const allowedFields = ['name', 'preferences']
    const updateData: any = {}
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }
    
    // 特殊处理：只有管理员才能更改角色
    if (body.role && user.role === 'admin') {
      updateData.role = body.role
    }
    
    // 模拟更新数据库
    const updatedProfile = {
      id: user.id,
      email: user.email,
      name: updateData.name || user.name,
      role: updateData.role || user.role,
      preferences: updateData.preferences || {
        theme: 'light',
        language: 'zh-CN',
        notifications: true
      },
      updatedAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      message: '用户资料更新成功',
      data: updatedProfile,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('更新用户资料错误:', error)
    return NextResponse.json(
      { error: '更新用户资料失败' },
      { status: 500 }
    )
  }
}

// DELETE请求 - 删除用户账户（只有管理员或用户本人可以删除）
export async function DELETE(request: NextRequest) {
  try {
    // 认证用户
    const authResult = await authenticateUser(request)
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }
    
    const user = authResult.user
    const { searchParams } = new URL(request.url)
    const targetUserId = searchParams.get('userId')
    
    // 如果没有指定用户ID，则删除当前用户账户
    const userIdToDelete = targetUserId ? parseInt(targetUserId) : user.id
    
    // 权限检查：只有管理员或用户本人可以删除账户
    if (user.role !== 'admin' && user.id !== userIdToDelete) {
      return NextResponse.json(
        { error: '无权限删除此用户' },
        { status: 403 }
      )
    }
    
    // 防止删除最后一个管理员账户
    if (user.role === 'admin' && user.id === userIdToDelete) {
      // 这里应该检查是否还有其他管理员
      // 为了演示，我们假设这是合法的删除
    }
    
    return NextResponse.json({
      success: true,
      message: '用户账户删除成功',
      deletedUserId: userIdToDelete,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('删除用户账户错误:', error)
    return NextResponse.json(
      { error: '删除用户账户失败' },
      { status: 500 }
    )
  }
} 