import { NextRequest, NextResponse } from 'next/server'
import { PostService } from '@/lib/db-operations'

// GET请求 - 获取文章列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // 获取查询参数
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || undefined
    const category = searchParams.get('category') || undefined
    const published = searchParams.get('published') === 'true' ? true : 
                     searchParams.get('published') === 'false' ? false : undefined
    const authorId = searchParams.get('authorId') || undefined
    
    // 参数验证
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: '无效的分页参数' },
        { status: 400 }
      )
    }
    
    // 获取文章数据
    const result = await PostService.getPosts({
      page,
      limit,
      search,
      category,
      published,
      authorId,
    })
    
    return NextResponse.json({
      success: true,
      data: result.posts,
      pagination: result.pagination,
      timestamp: new Date().toISOString(),
    })
    
  } catch (error) {
    console.error('获取文章列表错误:', error)
    return NextResponse.json(
      { error: '获取文章列表失败' },
      { status: 500 }
    )
  }
}

// POST请求 - 创建新文章
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 数据验证
    const requiredFields = ['title', 'slug', 'authorId']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `缺少必需字段: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }
    
    // 验证slug格式（只允许字母、数字、连字符）
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(body.slug)) {
      return NextResponse.json(
        { error: 'slug只能包含小写字母、数字和连字符' },
        { status: 400 }
      )
    }
    
    // 验证作者ID
    if (!body.authorId || typeof body.authorId !== 'string' || body.authorId.trim() === '') {
      return NextResponse.json(
        { error: '无效的作者ID' },
        { status: 400 }
      )
    }
    
    // 创建文章
    const newPost = await PostService.createPost({
      title: body.title,
      content: body.content,
      summary: body.summary,
      slug: body.slug,
      category: body.category,
      tags: body.tags || [],
      authorId: body.authorId,
      published: body.published || false,
    })
    
    return NextResponse.json({
      success: true,
      message: '文章创建成功',
      data: newPost,
      timestamp: new Date().toISOString(),
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('创建文章错误:', error)
    
    // 处理Prisma错误
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'slug已被使用' },
        { status: 409 }
      )
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: '作者不存在' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: '创建文章失败' },
      { status: 500 }
    )
  }
} 