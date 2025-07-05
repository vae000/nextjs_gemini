import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

// 允许的文件类型
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain'
]

// 最大文件大小（5MB）
const MAX_FILE_SIZE = 5 * 1024 * 1024

// POST请求 - 文件上传
export async function POST(request: NextRequest) {
  try {
    // 获取FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    const description = formData.get('description') as string
    
    // 验证文件是否存在
    if (!file) {
      return NextResponse.json(
        { error: '没有选择文件' },
        { status: 400 }
      )
    }
    
    // 验证文件类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          error: '不支持的文件类型',
          allowedTypes: ALLOWED_TYPES 
        },
        { status: 400 }
      )
    }
    
    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: '文件过大',
          maxSize: '5MB',
          currentSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`
        },
        { status: 400 }
      )
    }
    
    // 生成唯一文件名
    const timestamp = Date.now()
    const originalName = file.name
    const extension = path.extname(originalName)
    const filename = `${timestamp}-${Math.random().toString(36).substring(2)}${extension}`
    
    // 创建文件路径
    const uploadsDir = path.join(process.cwd(), 'public/uploads')
    const filePath = path.join(uploadsDir, filename)
    
    // 将文件转换为Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // 保存文件
    await writeFile(filePath, buffer)
    
    // 构造响应数据
    const fileInfo = {
      id: timestamp,
      originalName,
      filename,
      size: file.size,
      type: file.type,
      description: description || '',
      url: `/uploads/${filename}`,
      uploadTime: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      message: '文件上传成功',
      data: fileInfo,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('文件上传错误:', error)
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    )
  }
}

// GET请求 - 获取上传的文件列表
export async function GET(request: NextRequest) {
  // 这里可以从数据库获取文件列表
  // 为了演示，我们返回一个模拟的文件列表
  const mockFiles = [
    {
      id: 1,
      originalName: 'example.jpg',
      filename: '1703123456-abc123.jpg',
      size: 1024000,
      type: 'image/jpeg',
      description: '示例图片',
      url: '/uploads/1703123456-abc123.jpg',
      uploadTime: '2024-01-01T10:00:00.000Z'
    },
    {
      id: 2,
      originalName: 'document.pdf',
      filename: '1703123457-def456.pdf',
      size: 2048000,
      type: 'application/pdf',
      description: '示例文档',
      url: '/uploads/1703123457-def456.pdf',
      uploadTime: '2024-01-01T11:00:00.000Z'
    }
  ]
  
  return NextResponse.json({
    success: true,
    data: mockFiles,
    total: mockFiles.length,
    timestamp: new Date().toISOString()
  })
}

// DELETE请求 - 删除文件
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('id')
    
    if (!fileId) {
      return NextResponse.json(
        { error: '缺少文件ID' },
        { status: 400 }
      )
    }
    
    // 这里应该从数据库查找文件信息
    // 为了演示，我们假设删除成功
    
    return NextResponse.json({
      success: true,
      message: '文件删除成功',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('文件删除错误:', error)
    return NextResponse.json(
      { error: '文件删除失败' },
      { status: 500 }
    )
  }
} 