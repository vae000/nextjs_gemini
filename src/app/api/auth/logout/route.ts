import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// POST请求 - 用户注销
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    // 删除认证cookie
    cookieStore.delete('auth-token')
    
    return NextResponse.json({
      success: true,
      message: '退出登录成功',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('退出登录错误:', error)
    return NextResponse.json(
      { error: '退出登录失败' },
      { status: 500 }
    )
  }
}

// GET请求 - 获取登录状态并清除
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    // 删除认证cookie
    cookieStore.delete('auth-token')
    
    return NextResponse.json({
      success: true,
      message: '已退出登录',
      data: {
        wasAuthenticated: !!token
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('获取登录状态错误:', error)
    return NextResponse.json(
      { error: '操作失败' },
      { status: 500 }
    )
  }
} 