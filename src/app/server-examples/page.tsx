import { cookies } from 'next/headers'
import Link from 'next/link'

// 强制动态渲染
export const dynamic = 'force-dynamic'

// 定义类型
interface User {
  id: number
  name: string
  email: string
  age: number
  role: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 服务端数据获取函数
async function getUsers(): Promise<User[]> {
  try {
    // 在服务端调用API Routes
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/users`, {
      // 服务端fetch可以使用绝对URL
      cache: 'no-store', // 或者使用 'force-cache' 进行缓存
    })

    if (!response.ok) {
      throw new Error('获取用户数据失败')
    }

    const result: ApiResponse<User[]> = await response.json()
    return result.data || []
  } catch (error) {
    console.error('服务端获取用户数据错误:', error)
    return []
  }
}

// 获取用户认证状态
async function getAuthStatus(): Promise<{ isAuthenticated: boolean; user?: any }> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return { isAuthenticated: false }
    }

    // 服务端调用认证API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/login`, {
      headers: {
        Cookie: `auth-token=${token}`
      },
      cache: 'no-store'
    })

    const result: ApiResponse<any> = await response.json()
    
    if (result.success) {
      return { isAuthenticated: true, user: result.data?.user }
    } else {
      return { isAuthenticated: false }
    }
  } catch (error) {
    console.error('服务端验证认证状态错误:', error)
    return { isAuthenticated: false }
  }
}

// 服务端组件
export default async function ServerExamplesPage() {
  // 在服务端获取数据
  const users = await getUsers()
  const authStatus = await getAuthStatus()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">服务端调用API Routes示例</h1>
        
        {/* 简单导航 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <Link href="/api-test" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              🧪 API测试
            </Link>
            <Link href="/examples" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              🖥️ 客户端示例
            </Link>
            <span className="px-4 py-2 bg-gray-500 text-white rounded">
              🔧 服务端示例 (当前)
            </span>
            <Link href="/hooks-examples" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              🪝 Hooks示例
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 认证状态 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">认证状态</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  服务端检测登录状态: {authStatus.isAuthenticated ? '已登录' : '未登录'}
                </span>
                <div className={`w-3 h-3 rounded-full ${authStatus.isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              
              {authStatus.isAuthenticated && authStatus.user && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-800 mb-2">用户信息</h3>
                  <p className="text-sm text-green-700">
                    姓名: {authStatus.user.name}
                  </p>
                  <p className="text-sm text-green-700">
                    邮箱: {authStatus.user.email}
                  </p>
                  <p className="text-sm text-green-700">
                    角色: {authStatus.user.role}
                  </p>
                </div>
              )}
              
              {!authStatus.isAuthenticated && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    请先登录以查看用户信息
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 用户列表 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              用户列表 (服务端渲染)
            </h2>
            
            <div className="space-y-3">
              {users.length > 0 ? (
                users.map(user => (
                  <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      年龄: {user.age} | 角色: {user.role}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  暂无用户数据
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 代码示例 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">服务端调用代码示例</h2>
          <div className="bg-gray-100 rounded-lg p-4 text-sm space-y-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">1. 服务端数据获取:</h3>
              <pre className="text-gray-600 whitespace-pre-wrap">{`// 服务端组件中的数据获取
async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      cache: 'no-store', // 或者使用 'force-cache' 进行缓存
    })

    if (!response.ok) {
      throw new Error('获取用户数据失败')
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('服务端获取用户数据错误:', error)
    return []
  }
}

// 在服务端组件中使用
export default async function ServerPage() {
  const users = await getUsers()
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}`}</pre>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">2. 服务端认证检查:</h3>
              <pre className="text-gray-600 whitespace-pre-wrap">{`import { cookies } from 'next/headers'

async function getAuthStatus() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return { isAuthenticated: false }
  }

  const response = await fetch('http://localhost:3000/api/auth/login', {
    headers: {
      Cookie: \`auth-token=\${token}\`
    },
    cache: 'no-store'
  })

  const result = await response.json()
  return result.success 
    ? { isAuthenticated: true, user: result.data.user }
    : { isAuthenticated: false }
}`}</pre>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">3. 服务端vs客户端对比:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <h4 className="font-medium text-blue-800 mb-2">服务端调用</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 需要完整的URL</li>
                    <li>• 可以使用cookies() API</li>
                    <li>• 支持缓存策略</li>
                    <li>• 在服务器上执行</li>
                    <li>• SEO友好</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <h4 className="font-medium text-green-800 mb-2">客户端调用</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• 可以使用相对URL</li>
                    <li>• 自动包含cookies</li>
                    <li>• 支持用户交互</li>
                    <li>• 在浏览器中执行</li>
                    <li>• 动态更新</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 注意事项 */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">⚠️ 注意事项</h2>
          <ul className="space-y-2 text-yellow-700">
            <li>• 服务端调用API Routes需要使用完整的URL</li>
            <li>• 使用 <code className="bg-yellow-100 px-2 py-1 rounded">cookies()</code> API来处理认证状态</li>
            <li>• 合理使用缓存策略：<code className="bg-yellow-100 px-2 py-1 rounded">cache: 'no-store'</code> 或 <code className="bg-yellow-100 px-2 py-1 rounded">cache: 'force-cache'</code></li>
            <li>• 服务端组件中的数据获取在构建时或请求时执行</li>
            <li>• 错误处理要考虑服务端和客户端的不同情况</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 