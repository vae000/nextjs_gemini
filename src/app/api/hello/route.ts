import { NextRequest, NextResponse } from 'next/server'

// GET请求处理
export async function GET(request: NextRequest) {
  // 获取查询参数
  const searchParams = request.nextUrl.searchParams
  const name = searchParams.get('name') || 'World'
  
  return NextResponse.json({
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
    method: 'GET'
  })
}

// POST请求处理
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json()
    
    // 简单的数据验证
    if (!body.name) {
      return NextResponse.json(
        { error: '缺少name参数' },
        { status: 400 }
      )
    }
    
    // 处理数据
    const response = {
      message: `你好, ${body.name}!`,
      data: body,
      timestamp: new Date().toISOString(),
      method: 'POST'
    }
    
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: '无效的JSON格式' },
      { status: 400 }
    )
  }
}

// PUT请求处理
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({
      message: '数据已更新',
      data: body,
      timestamp: new Date().toISOString(),
      method: 'PUT'
    })
  } catch (error) {
    return NextResponse.json(
      { error: '更新失败' },
      { status: 400 }
    )
  }
}

// DELETE请求处理
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json(
      { error: '缺少id参数' },
      { status: 400 }
    )
  }
  
  return NextResponse.json({
    message: `ID为 ${id} 的数据已删除`,
    timestamp: new Date().toISOString(),
    method: 'DELETE'
  })
} 