import { NextRequest, NextResponse } from 'next/server'

// 模拟用户数据
const users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', age: 25 },
  { id: 2, name: '李四', email: 'lisi@example.com', age: 30 },
  { id: 3, name: '王五', email: 'wangwu@example.com', age: 28 }
]

// GET请求 - 获取单个用户
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const userId = parseInt(id)
  
  // 验证ID格式
  if (isNaN(userId)) {
    return NextResponse.json(
      { error: '无效的用户ID格式' },
      { status: 400 }
    )
  }
  
  // 查找用户
  const user = users.find(u => u.id === userId)
  
  if (!user) {
    return NextResponse.json(
      { error: '用户不存在' },
      { status: 404 }
    )
  }
  
  return NextResponse.json({
    success: true,
    data: user,
    timestamp: new Date().toISOString()
  })
}

// PUT请求 - 更新用户信息
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = parseInt(id)
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: '无效的用户ID格式' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }
    
    // 更新用户信息
    users[userIndex] = { ...users[userIndex], ...body }
    
    return NextResponse.json({
      success: true,
      message: '用户信息已更新',
      data: users[userIndex],
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: '更新失败，请检查请求格式' },
      { status: 400 }
    )
  }
}

// DELETE请求 - 删除用户
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const userId = parseInt(id)
  
  if (isNaN(userId)) {
    return NextResponse.json(
      { error: '无效的用户ID格式' },
      { status: 400 }
    )
  }
  
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex === -1) {
    return NextResponse.json(
      { error: '用户不存在' },
      { status: 404 }
    )
  }
  
  // 删除用户
  const deletedUser = users.splice(userIndex, 1)[0]
  
  return NextResponse.json({
    success: true,
    message: '用户已删除',
    data: deletedUser,
    timestamp: new Date().toISOString()
  })
} 