import { NextRequest, NextResponse } from 'next/server'

// 模拟用户数据
const users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', age: 25, role: 'user' },
  { id: 2, name: '李四', email: 'lisi@example.com', age: 30, role: 'admin' },
  { id: 3, name: '王五', email: 'wangwu@example.com', age: 28, role: 'user' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', age: 35, role: 'admin' },
  { id: 5, name: '钱七', email: 'qianqi@example.com', age: 22, role: 'user' },
  { id: 6, name: '孙八', email: 'sunba@example.com', age: 29, role: 'user' }
]

// GET请求 - 获取用户列表
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  // 获取查询参数
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const search = searchParams.get('search') || ''
  const role = searchParams.get('role') || ''
  const sortBy = searchParams.get('sortBy') || 'id'
  const sortOrder = searchParams.get('sortOrder') || 'asc'
  
  // 参数验证
  if (page < 1 || limit < 1 || limit > 100) {
    return NextResponse.json(
      { error: '无效的分页参数' },
      { status: 400 }
    )
  }
  
  // 过滤数据
  let filteredUsers = users
  
  // 按名称或邮箱搜索
  if (search) {
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  // 按角色过滤
  if (role) {
    filteredUsers = filteredUsers.filter(user => user.role === role)
  }
  
  // 排序
  filteredUsers.sort((a, b) => {
    let aValue = a[sortBy as keyof typeof a]
    let bValue = b[sortBy as keyof typeof b]
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }
    
    if (sortOrder === 'desc') {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    } else {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    }
  })
  
  // 计算分页
  const total = filteredUsers.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)
  
  return NextResponse.json({
    success: true,
    data: paginatedUsers,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    },
    filters: {
      search,
      role,
      sortBy,
      sortOrder
    },
    timestamp: new Date().toISOString()
  })
}

// POST请求 - 创建新用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 数据验证
    const requiredFields = ['name', 'email', 'age']
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
    
    // 检查邮箱是否已存在
    const existingUser = users.find(u => u.email === body.email)
    if (existingUser) {
      return NextResponse.json(
        { error: '邮箱已被使用' },
        { status: 409 }
      )
    }
    
    // 创建新用户
    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name: body.name,
      email: body.email,
      age: parseInt(body.age),
      role: body.role || 'user'
    }
    
    users.push(newUser)
    
    return NextResponse.json({
      success: true,
      message: '用户创建成功',
      data: newUser,
      timestamp: new Date().toISOString()
    }, { status: 201 })
    
  } catch (error) {
    return NextResponse.json(
      { error: '创建失败，请检查请求格式' },
      { status: 400 }
    )
  }
} 