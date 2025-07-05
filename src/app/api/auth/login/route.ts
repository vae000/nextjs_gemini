import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// 模拟用户数据库
const users = [
  { 
    id: 1, 
    email: 'admin@example.com', 
    password: 'admin123', 
    name: '管理员', 
    role: 'admin' 
  },
  { 
    id: 2, 
    email: 'user@example.com', 
    password: 'user123', 
    name: '普通用户', 
    role: 'user' 
  }
]

// 简单的JWT token生成（实际项目中应该使用更安全的方式）
function generateToken(user: any) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24小时过期
  }
  
  // 实际项目中应该使用 jsonwebtoken 库
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

// POST请求 - 用户登录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    // 数据验证
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      )
    }
    
    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      )
    }
    
    // 查找用户
    const user = users.find(u => u.email === email)
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 401 }
      )
    }
    
    // 验证密码（实际项目中应该使用bcrypt等加密库）
    if (user.password !== password) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      )
    }
    
    // 生成JWT token
    const token = generateToken(user)
    
    // 设置cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24小时
    })
    
    // 返回用户信息（不包含密码）
    const userInfo = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
    
    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        user: userInfo,
        token
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json(
      { error: '登录失败，请重试' },
      { status: 500 }
    )
  }
}

// GET请求 - 获取登录状态
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }
    
    // 解析token（实际项目中应该使用jsonwebtoken库验证）
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString())
      
      // 检查token是否过期
      if (payload.exp * 1000 < Date.now()) {
        return NextResponse.json(
          { error: 'Token已过期' },
          { status: 401 }
        )
      }
      
      // 返回用户信息
      const userInfo = {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role
      }
      
      return NextResponse.json({
        success: true,
        data: {
          user: userInfo,
          isAuthenticated: true
        },
        timestamp: new Date().toISOString()
      })
      
    } catch (error) {
      return NextResponse.json(
        { error: '无效的Token' },
        { status: 401 }
      )
    }
    
  } catch (error) {
    console.error('验证Token错误:', error)
    return NextResponse.json(
      { error: '验证失败' },
      { status: 500 }
    )
  }
} 