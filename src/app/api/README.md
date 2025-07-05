# Next.js API Routes 学习指南

## 📚 概述

本目录包含了完整的Next.js API Routes学习示例，从基础到高级，涵盖了实际开发中常用的API模式。

## 🎯 学习目标

- 理解Next.js API Routes的基本概念
- 掌握路由处理器的使用方法
- 学会处理不同的HTTP方法
- 了解数据验证和错误处理
- 掌握认证和授权机制
- 学会文件上传处理

## 📁 目录结构

```
src/app/api/
├── README.md                    # 本文档
├── hello/
│   └── route.ts                # 基础API示例
├── users/
│   ├── route.ts                # 用户列表API
│   └── [id]/
│       └── route.ts            # 动态路由API
├── upload/
│   └── route.ts                # 文件上传API
├── auth/
│   ├── login/
│   │   └── route.ts            # 登录API
│   └── logout/
│       └── route.ts            # 注销API
└── protected/
    └── profile/
        └── route.ts            # 受保护的API
```

## 🔧 API Routes 基础概念

### 1. 路由处理器（Route Handlers）

在Next.js 13+的App Router中，API Routes使用`route.ts`文件定义：

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello World' })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ received: body })
}
```

### 2. 支持的HTTP方法

- `GET` - 获取数据
- `POST` - 创建数据
- `PUT` - 更新数据
- `DELETE` - 删除数据
- `PATCH` - 部分更新
- `HEAD` - 获取响应头
- `OPTIONS` - 跨域预检

### 3. 请求对象（NextRequest）

```typescript
export async function GET(request: NextRequest) {
  // 获取查询参数
  const searchParams = request.nextUrl.searchParams
  const name = searchParams.get('name')
  
  // 获取请求头
  const userAgent = request.headers.get('user-agent')
  
  // 获取URL信息
  const url = request.nextUrl
  
  return NextResponse.json({ name, userAgent, url: url.pathname })
}
```

### 4. 响应对象（NextResponse）

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 成功响应
    return NextResponse.json({
      success: true,
      data: body
    })
  } catch (error) {
    // 错误响应
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    )
  }
}
```

## 📝 API示例详解

### 1. 基础API - `/api/hello`

**功能**: 演示基本的GET/POST/PUT/DELETE操作

**特点**:
- 处理查询参数
- 处理请求体
- 数据验证
- 错误处理

**测试**:
```bash
# GET请求
curl http://localhost:3000/api/hello

# GET请求带参数
curl http://localhost:3000/api/hello?name=张三

# POST请求
curl -X POST http://localhost:3000/api/hello \
  -H "Content-Type: application/json" \
  -d '{"name": "李四", "age": 25}'
```

### 2. 用户管理API - `/api/users`

**功能**: 完整的用户CRUD操作

**特点**:
- 数据分页
- 搜索和过滤
- 数据排序
- 输入验证
- 重复检查

**测试**:
```bash
# 获取用户列表
curl http://localhost:3000/api/users

# 分页和搜索
curl http://localhost:3000/api/users?page=1&limit=5&search=张

# 获取单个用户
curl http://localhost:3000/api/users/1

# 创建用户
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "新用户", "email": "new@example.com", "age": 30}'
```

### 3. 动态路由API - `/api/users/[id]`

**功能**: 基于ID的单个用户操作

**特点**:
- 动态路由参数
- 参数验证
- 404错误处理
- 权限检查

**测试**:
```bash
# 获取用户
curl http://localhost:3000/api/users/1

# 更新用户
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "更新的名字"}'

# 删除用户
curl -X DELETE http://localhost:3000/api/users/1
```

### 4. 文件上传API - `/api/upload`

**功能**: 文件上传和管理

**特点**:
- FormData处理
- 文件类型验证
- 文件大小限制
- 文件存储
- 唯一文件名生成

**测试**:
```bash
# 上传文件
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/your/file.jpg" \
  -F "description=测试图片"

# 获取文件列表
curl http://localhost:3000/api/upload
```

### 5. 认证API - `/api/auth/login`

**功能**: 用户登录认证

**特点**:
- 密码验证
- JWT Token生成
- Cookie设置
- 会话管理

**测试**:
```bash
# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'

# 检查登录状态
curl http://localhost:3000/api/auth/login \
  -H "Cookie: auth-token=your-token"
```

### 6. 受保护的API - `/api/protected/profile`

**功能**: 需要认证的用户资料操作

**特点**:
- 认证中间件
- 权限检查
- 用户信息获取
- 安全更新

**测试**:
```bash
# 获取用户资料（需要先登录）
curl http://localhost:3000/api/protected/profile \
  -H "Cookie: auth-token=your-token"

# 更新用户资料
curl -X PUT http://localhost:3000/api/protected/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=your-token" \
  -d '{"name": "新名字", "preferences": {"theme": "dark"}}'
```

## 🛡️ 最佳实践

### 1. 错误处理

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 数据验证
    if (!body.email) {
      return NextResponse.json(
        { error: '邮箱不能为空', field: 'email' },
        { status: 400 }
      )
    }
    
    // 业务逻辑
    const result = await processData(body)
    
    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('API错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
```

### 2. 数据验证

```typescript
// 简单验证
function validateUser(data: any) {
  const errors: string[] = []
  
  if (!data.name) errors.push('姓名不能为空')
  if (!data.email) errors.push('邮箱不能为空')
  if (data.age && (data.age < 0 || data.age > 150)) {
    errors.push('年龄必须在0-150之间')
  }
  
  return errors
}

// 在API中使用
export async function POST(request: NextRequest) {
  const body = await request.json()
  const errors = validateUser(body)
  
  if (errors.length > 0) {
    return NextResponse.json(
      { error: '数据验证失败', details: errors },
      { status: 400 }
    )
  }
  
  // 继续处理...
}
```

### 3. 认证中间件

```typescript
function authenticateRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    return { error: '未认证', status: 401 }
  }
  
  try {
    const user = verifyToken(token)
    return { user }
  } catch (error) {
    return { error: '无效Token', status: 401 }
  }
}

// 在受保护的API中使用
export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request)
  
  if ('error' in auth) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status }
    )
  }
  
  // 继续处理认证用户的请求...
}
```

### 4. 分页处理

```typescript
function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')))
  const offset = (page - 1) * limit
  
  return { page, limit, offset }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const { page, limit, offset } = getPaginationParams(searchParams)
  
  const data = await getData(offset, limit)
  const total = await getDataCount()
  
  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: offset + limit < total,
      hasPrev: page > 1
    }
  })
}
```

## 🔍 调试技巧

### 1. 日志记录

```typescript
export async function POST(request: NextRequest) {
  console.log('收到POST请求:', request.url)
  
  try {
    const body = await request.json()
    console.log('请求体:', body)
    
    const result = await processData(body)
    console.log('处理结果:', result)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('处理错误:', error)
    return NextResponse.json(
      { error: '处理失败' },
      { status: 500 }
    )
  }
}
```

### 2. 开发工具

- 使用浏览器开发者工具查看网络请求
- 使用Postman或curl测试API
- 查看Next.js终端输出的日志

### 3. 常见问题

1. **CORS问题**: 在需要时添加CORS头
2. **Cookie问题**: 确保cookie设置正确
3. **JSON解析失败**: 检查请求头Content-Type
4. **路由不匹配**: 确保文件路径正确

## 🚀 进阶主题

### 1. 中间件集成

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 对所有 /api/protected/* 路径进行认证检查
  if (request.nextUrl.pathname.startsWith('/api/protected/')) {
    const token = request.cookies.get('auth-token')
    
    if (!token) {
      return NextResponse.json(
        { error: '未认证' },
        { status: 401 }
      )
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/protected/:path*'
}
```

### 2. 速率限制

```typescript
const rateLimitMap = new Map()

function checkRateLimit(ip: string, limit: number = 10, window: number = 60000) {
  const now = Date.now()
  const userRequests = rateLimitMap.get(ip) || []
  
  // 清除过期请求
  const validRequests = userRequests.filter((time: number) => now - time < window)
  
  if (validRequests.length >= limit) {
    return false
  }
  
  validRequests.push(now)
  rateLimitMap.set(ip, validRequests)
  
  return true
}

export async function GET(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: '请求过于频繁' },
      { status: 429 }
    )
  }
  
  // 继续处理请求...
}
```

## 📚 学习资源

- [Next.js API Routes官方文档](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [HTTP状态码参考](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [RESTful API设计最佳实践](https://restfulapi.net/)

## 🎯 练习建议

1. 创建一个博客文章API（增删改查）
2. 实现用户评论系统API
3. 添加图片上传和压缩功能
4. 实现API访问日志记录
5. 添加数据缓存机制

## 🔄 下一步

完成API Routes学习后，可以继续学习：

1. 数据库集成（Prisma、MongoDB）
2. 第三方服务集成（邮件、支付）
3. 实时功能（WebSocket、Server-Sent Events）
4. API文档生成（Swagger/OpenAPI）
5. 性能优化和缓存策略

---

**提示**: 访问 `/api-test` 页面可以在浏览器中测试所有API功能！ 