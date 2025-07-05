'use client'

import { useState, useEffect } from 'react'
import ExamplesNavigation from '@/components/ExamplesNavigation'

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

export default function ExamplesPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 1. 获取用户列表 - GET请求
  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/users')
      const result: ApiResponse<User[]> = await response.json()
      
      if (result.success && result.data) {
        setUsers(result.data)
      } else {
        setError(result.error || '获取用户列表失败')
      }
    } catch (err) {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  // 2. 创建用户 - POST请求
  const createUser = async () => {
    const userData = {
      name: '新用户' + Date.now(),
      email: `user${Date.now()}@example.com`,
      age: Math.floor(Math.random() * 50) + 18
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })

      const result: ApiResponse<User> = await response.json()
      
      if (result.success && result.data) {
        // 更新用户列表
        setUsers(prev => [...prev, result.data!])
        alert('用户创建成功！')
      } else {
        alert(result.error || '创建用户失败')
      }
    } catch (err) {
      alert('网络错误')
    }
  }

  // 3. 删除用户 - DELETE请求
  const deleteUser = async (userId: number) => {
    if (!confirm('确定要删除这个用户吗？')) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      const result: ApiResponse<User> = await response.json()
      
      if (result.success) {
        // 从列表中移除用户
        setUsers(prev => prev.filter(user => user.id !== userId))
        alert('用户删除成功！')
      } else {
        alert(result.error || '删除用户失败')
      }
    } catch (err) {
      alert('网络错误')
    }
  }

  // 4. 更新用户 - PUT请求
  const updateUser = async (userId: number, updateData: Partial<User>) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      const result: ApiResponse<User> = await response.json()
      
      if (result.success && result.data) {
        // 更新用户列表
        setUsers(prev => prev.map(user => 
          user.id === userId ? result.data! : user
        ))
        alert('用户更新成功！')
      } else {
        alert(result.error || '更新用户失败')
      }
    } catch (err) {
      alert('网络错误')
    }
  }

  // 5. 用户登录 - POST请求
  const login = async () => {
    const credentials = {
      email: 'admin@example.com',
      password: 'admin123'
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 包含cookies
        body: JSON.stringify(credentials)
      })

      const result: ApiResponse<any> = await response.json()
      
      if (result.success) {
        setIsAuthenticated(true)
        alert('登录成功！')
      } else {
        alert(result.error || '登录失败')
      }
    } catch (err) {
      alert('登录网络错误')
    }
  }

  // 6. 用户注销 - POST请求
  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      const result: ApiResponse<any> = await response.json()
      
      if (result.success) {
        setIsAuthenticated(false)
        alert('注销成功！')
      } else {
        alert(result.error || '注销失败')
      }
    } catch (err) {
      alert('注销网络错误')
    }
  }

  // 7. 获取用户资料 - 需要认证的API
  const getUserProfile = async () => {
    try {
      const response = await fetch('/api/protected/profile', {
        credentials: 'include'
      })

      const result: ApiResponse<any> = await response.json()
      
      if (result.success && result.data) {
        alert(`用户资料: ${JSON.stringify(result.data, null, 2)}`)
      } else {
        alert(result.error || '获取用户资料失败')
      }
    } catch (err) {
      alert('获取用户资料网络错误')
    }
  }

  // 8. 检查登录状态
  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        credentials: 'include'
      })

      const result: ApiResponse<any> = await response.json()
      
      if (result.success) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (err) {
      setIsAuthenticated(false)
    }
  }

  // 页面加载时获取用户列表和检查登录状态
  useEffect(() => {
    fetchUsers()
    checkAuthStatus()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">页面调用API Routes示例</h1>
        
        <ExamplesNavigation />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：操作按钮 */}
          <div className="space-y-6">
            {/* 认证操作 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">认证操作</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    登录状态: {isAuthenticated ? '已登录' : '未登录'}
                  </span>
                  <div className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                <button
                  onClick={login}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={isAuthenticated}
                >
                  登录 (admin@example.com)
                </button>
                <button
                  onClick={logout}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  disabled={!isAuthenticated}
                >
                  注销
                </button>
                <button
                  onClick={getUserProfile}
                  className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                  disabled={!isAuthenticated}
                >
                  获取用户资料
                </button>
              </div>
            </div>

            {/* 用户管理操作 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">用户管理</h2>
              <div className="space-y-3">
                <button
                  onClick={fetchUsers}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? '加载中...' : '刷新用户列表'}
                </button>
                <button
                  onClick={createUser}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  创建随机用户
                </button>
              </div>
            </div>

            {/* 快速测试 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">快速测试</h2>
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    const response = await fetch('/api/hello')
                    const data = await response.json()
                    alert(`Hello API响应: ${JSON.stringify(data, null, 2)}`)
                  }}
                  className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  测试Hello API
                </button>
                <button
                  onClick={async () => {
                    const response = await fetch('/api/hello?name=测试用户')
                    const data = await response.json()
                    alert(`Hello API响应: ${JSON.stringify(data, null, 2)}`)
                  }}
                  className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  测试Hello API (带参数)
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：用户列表 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">用户列表</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                错误: {error}
              </div>
            )}
            
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        年龄: {user.age} | 角色: {user.role}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateUser(user.id, { 
                          name: user.name + '(已更新)' 
                        })}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                      >
                        更新
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {users.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  暂无用户数据
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 代码示例 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">代码示例</h2>
          <div className="bg-gray-100 rounded-lg p-4 text-sm">
            <h3 className="font-medium text-gray-700 mb-2">1. 基本的GET请求:</h3>
            <pre className="text-gray-600 mb-4 whitespace-pre-wrap">{`const fetchUsers = async () => {
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

            <h3 className="font-medium text-gray-700 mb-2">2. 带请求体的POST请求:</h3>
            <pre className="text-gray-600 mb-4 whitespace-pre-wrap">{`const createUser = async (userData) => {
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

            <h3 className="font-medium text-gray-700 mb-2">3. 需要认证的请求:</h3>
            <pre className="text-gray-600 whitespace-pre-wrap">{`const getUserProfile = async () => {
  try {
    const response = await fetch('/api/protected/profile', {
      credentials: 'include' // 包含cookies
    })
    
    const result = await response.json()
    // 处理响应...
  } catch (err) {
    // 错误处理...
  }
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  )
} 