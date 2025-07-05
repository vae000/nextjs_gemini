import Link from 'next/link'

export default function APIGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">📚 页面调用API Routes完整指南</h1>
        
        {/* 导航到实际示例 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 快速开始</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/api-test" className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="text-3xl mb-2">🧪</div>
              <h3 className="font-semibold text-blue-800">API测试</h3>
              <p className="text-sm text-blue-600">在线测试所有API功能</p>
            </Link>
            
            <Link href="/examples" className="block p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
              <div className="text-3xl mb-2">🖥️</div>
              <h3 className="font-semibold text-green-800">客户端示例</h3>
              <p className="text-sm text-green-600">React组件中调用API</p>
            </Link>
            
            <Link href="/server-examples" className="block p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="text-3xl mb-2">🔧</div>
              <h3 className="font-semibold text-purple-800">服务端示例</h3>
              <p className="text-sm text-purple-600">服务端组件中调用API</p>
            </Link>
            
            <Link href="/hooks-examples" className="block p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
              <div className="text-3xl mb-2">🪝</div>
              <h3 className="font-semibold text-orange-800">Hooks示例</h3>
              <p className="text-sm text-orange-600">自定义Hooks简化开发</p>
            </Link>
          </div>
        </div>

        {/* 学习内容概览 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 客户端调用 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🖥️ 客户端调用API Routes</h2>
            
            <h3 className="text-lg font-medium text-gray-700 mb-3">基础用法</h3>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">{`// 基本的GET请求
const fetchData = async () => {
  try {
    const response = await fetch('/api/users')
    const result = await response.json()
    
    if (result.success) {
      setUsers(result.data)
    } else {
      setError(result.error)
    }
  } catch (err) {
    setError('网络错误')
  }
}`}</pre>
            </div>

            <h3 className="text-lg font-medium text-gray-700 mb-3">POST请求示例</h3>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">{`// 创建数据的POST请求
const createUser = async (userData) => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })
    
    const result = await response.json()
    // 处理响应...
  } catch (err) {
    // 错误处理...
  }
}`}</pre>
            </div>

            <h3 className="text-lg font-medium text-gray-700 mb-3">特点与优势</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 可以使用相对URL路径</li>
              <li>• 自动包含认证cookies</li>
              <li>• 支持用户交互和状态更新</li>
              <li>• 可以实现实时数据更新</li>
              <li>• 支持错误重试和用户反馈</li>
            </ul>
          </div>

          {/* 服务端调用 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔧 服务端调用API Routes</h2>
            
            <h3 className="text-lg font-medium text-gray-700 mb-3">基础用法</h3>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">{`// 服务端数据获取
async function getUsers() {
  const response = await fetch(
    'http://localhost:3000/api/users',
    { cache: 'no-store' }
  )
  
  const result = await response.json()
  return result.data || []
}

// 在服务端组件中使用
export default async function Page() {
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

            <h3 className="text-lg font-medium text-gray-700 mb-3">认证处理</h3>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">{`import { cookies } from 'next/headers'

async function getAuthData() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value
  
  const response = await fetch('/api/protected', {
    headers: {
      Cookie: \`auth-token=\${token}\`
    }
  })
  
  return response.json()
}`}</pre>
            </div>

            <h3 className="text-lg font-medium text-gray-700 mb-3">特点与优势</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 需要使用完整的URL</li>
              <li>• 可以配置缓存策略</li>
              <li>• 在服务器端执行，SEO友好</li>
              <li>• 数据在页面渲染时就已准备好</li>
              <li>• 可以直接访问cookies</li>
            </ul>
          </div>
        </div>

        {/* 自定义Hooks */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🪝 使用自定义Hooks简化开发</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">useApi Hook</h3>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <pre className="text-sm text-gray-600 whitespace-pre-wrap">{`// 封装GET请求
function useApi(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(url)
      const result = await response.json()
      setData(result.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [url])
  
  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  return { data, loading, error, refetch: fetchData }
}

// 使用
function UserList() {
  const { data, loading, error } = useApi('/api/users')
  
  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>
  
  return (
    <div>
      {data?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">useApiMutation Hook</h3>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <pre className="text-sm text-gray-600 whitespace-pre-wrap">{`// 封装POST/PUT/DELETE请求
function useApiMutation(url, method = 'POST') {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const mutate = useCallback(async (payload) => {
    setLoading(true)
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      const result = await response.json()
      return result.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, method])
  
  return { mutate, loading, error }
}

// 使用
function CreateUser() {
  const { mutate: createUser, loading } = useApiMutation('/api/users')
  
  const handleCreate = async () => {
    try {
      await createUser({ name: '新用户', email: 'new@example.com' })
      alert('创建成功!')
    } catch (error) {
      alert('创建失败')
    }
  }
  
  return (
    <button onClick={handleCreate} disabled={loading}>
      {loading ? '创建中...' : '创建用户'}
    </button>
  )
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* 最佳实践 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">💡 最佳实践</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">错误处理</h3>
              <ul className="space-y-2 text-gray-600 mb-4">
                <li>• 始终使用try-catch包装API调用</li>
                <li>• 检查响应状态码和业务状态</li>
                <li>• 提供有意义的错误信息给用户</li>
                <li>• 实现错误重试机制</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-700 mb-3">加载状态</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 显示加载指示器</li>
                <li>• 防止重复提交</li>
                <li>• 禁用相关按钮</li>
                <li>• 提供取消功能（如果适用）</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">认证处理</h3>
              <ul className="space-y-2 text-gray-600 mb-4">
                <li>• 使用credentials: 'include'包含cookies</li>
                <li>• 处理401未认证响应</li>
                <li>• 实现自动重新登录</li>
                <li>• 安全存储认证信息</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-700 mb-3">性能优化</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 使用适当的缓存策略</li>
                <li>• 实现分页加载</li>
                <li>• 避免不必要的重复请求</li>
                <li>• 使用防抖/节流优化搜索</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 常见问题 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">❓ 常见问题</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Q: 客户端调用和服务端调用有什么区别？</h3>
              <p className="text-gray-600">
                客户端调用在浏览器中执行，支持用户交互和实时更新；服务端调用在服务器上执行，SEO友好且初始加载快。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Q: 什么时候使用服务端调用？</h3>
              <p className="text-gray-600">
                当你需要SEO优化、初始页面加载速度、或者数据在页面渲染时就需要准备好时，使用服务端调用。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Q: 如何处理认证状态？</h3>
              <p className="text-gray-600">
                在客户端使用useAuth Hook管理认证状态；在服务端使用cookies() API获取认证信息。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Q: 如何优化API调用性能？</h3>
              <p className="text-gray-600">
                使用适当的缓存策略、实现分页、避免重复请求、使用防抖节流、合理使用自定义Hooks。
              </p>
            </div>
          </div>
        </div>

        {/* 总结 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎯 学习总结</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-blue-800 mb-3">你已经学会了：</h3>
              <ul className="space-y-2 text-blue-700">
                <li>✅ 在客户端组件中调用API Routes</li>
                <li>✅ 在服务端组件中调用API Routes</li>
                <li>✅ 使用自定义Hooks简化开发</li>
                <li>✅ 处理认证、错误和加载状态</li>
                <li>✅ 实现分页、搜索和文件上传</li>
                <li>✅ 掌握最佳实践和性能优化</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-purple-800 mb-3">下一步可以：</h3>
              <ul className="space-y-2 text-purple-700">
                <li>🚀 集成数据库（Prisma、MongoDB）</li>
                <li>🔐 实现更复杂的认证系统</li>
                <li>📊 添加数据可视化和图表</li>
                <li>🔄 实现实时功能（WebSocket）</li>
                <li>🌐 部署到生产环境</li>
                <li>📈 性能监控和优化</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 