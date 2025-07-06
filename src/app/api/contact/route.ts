import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema, type ContactFormResponse } from '@/lib/validations/contact';
import { sendContactEmail } from '@/lib/email';
import { rateLimit, contactFormLimiter } from '@/lib/rate-limit';
import { simpleCSRFCheck } from '@/lib/csrf';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// 输入清理函数
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // 移除script标签
    .replace(/<[^>]*>/g, '') // 移除HTML标签
    .replace(/javascript:/gi, '') // 移除javascript:协议
    .replace(/on\w+\s*=/gi, ''); // 移除事件处理器
}

// 深度清理对象
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

export async function POST(request: NextRequest) {
  try {
    // CSRF保护检查
    if (!simpleCSRFCheck(request)) {
      return NextResponse.json(
        {
          success: false,
          message: '请求来源验证失败',
        } as ContactFormResponse,
        { status: 403 }
      );
    }

    // 速率限制检查
    const rateLimitResult = rateLimit(contactFormLimiter)(request);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: rateLimitResult.error,
          resetTime: rateLimitResult.resetTime,
        } as ContactFormResponse,
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime || '',
          }
        }
      );
    }

    // 解析请求体
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: '无效的请求格式',
        } as ContactFormResponse,
        { status: 400 }
      );
    }

    // 输入清理
    const sanitizedBody = sanitizeObject(body);

    // 数据验证
    const validationResult = contactFormSchema.safeParse(sanitizedBody);
    
    if (!validationResult.success) {
      const errors: Record<string, string[]> = {};
      validationResult.error.errors.forEach((error) => {
        const field = error.path.join('.');
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(error.message);
      });

      return NextResponse.json(
        {
          success: false,
          message: '表单数据验证失败',
          errors,
        } as ContactFormResponse,
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // 获取当前用户会话（如果已登录）
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    // 保存到数据库
    let contactRecord;
    try {
      contactRecord = await prisma.contact.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          company: validatedData.company || null,
          subject: validatedData.subject,
          message: validatedData.message,
          userId: userId,
          status: 'PENDING',
          isRead: false,
        },
      });
    } catch (error) {
      console.error('数据库保存失败:', error);
      return NextResponse.json(
        {
          success: false,
          message: '数据保存失败，请稍后重试',
        } as ContactFormResponse,
        { status: 500 }
      );
    }

    // 发送邮件
    let emailSent = false;
    try {
      emailSent = await sendContactEmail(validatedData);
    } catch (error) {
      console.error('邮件发送失败:', error);
      // 邮件发送失败不影响整体流程，只记录日志
    }

    // 返回成功响应
    return NextResponse.json(
      {
        success: true,
        message: emailSent 
          ? '消息发送成功！我们会尽快回复您。' 
          : '消息已保存，但邮件通知发送失败。我们会尽快处理您的消息。',
        data: {
          id: contactRecord.id,
          createdAt: contactRecord.createdAt.toISOString(),
        },
      } as ContactFormResponse,
      { 
        status: 201,
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
        }
      }
    );

  } catch (error) {
    console.error('联系表单API错误:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: '服务器内部错误，请稍后重试',
      } as ContactFormResponse,
      { status: 500 }
    );
  }
}

// 获取联系记录（仅管理员）
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: '权限不足' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && ['PENDING', 'PROCESSING', 'RESOLVED', 'CLOSED'].includes(status)) {
      where.status = status;
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.contact.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('获取联系记录失败:', error);
    return NextResponse.json(
      { success: false, message: '获取数据失败' },
      { status: 500 }
    );
  }
}

// 处理OPTIONS请求（CORS预检）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
