'use client'

import { useState } from 'react'
import ExamplesNavigation from '@/components/ExamplesNavigation'

export default function APITestPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: 'admin@example.com', password: 'admin123' })

  const makeRequest = async (url: string, method: string = 'GET', body?: any) => {
    setLoading(true)
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 包含cookies
      }

      if (body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(url, options)
      const data = await response.json()
      
      setResult(JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        data
      }, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testFileUpload = async (file: File) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('description', '测试上传文件')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      const data = await response.json()
      setResult(JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        data
      }, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      testFileUpload(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Routes 测试页面</h1>
        
        <ExamplesNavigation />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：API测试按钮 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">基础API测试</h2>
              <div className="space-y-3">
                <button
                  onClick={() => makeRequest('/api/hello')}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  GET /api/hello
                </button>
                <button
                  onClick={() => makeRequest('/api/hello?name=张三')}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  disabled={loading}
                >
                  GET /api/hello?name=张三
                </button>
                <button
                  onClick={() => makeRequest('/api/hello', 'POST', { name: '李四', age: 25 })}
                  className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                  disabled={loading}
                >
                  POST /api/hello
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">用户管理API</h2>
              <div className="space-y-3">
                <button
                  onClick={() => makeRequest('/api/users')}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  GET /api/users
                </button>
                <button
                  onClick={() => makeRequest('/api/users?page=1&limit=3&search=张')}
                  className="w-full bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
                  disabled={loading}
                >
                  GET /api/users (搜索&分页)
                </button>
                <button
                  onClick={() => makeRequest('/api/users/1')}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  disabled={loading}
                >
                  GET /api/users/1
                </button>
                <button
                  onClick={() => makeRequest('/api/users', 'POST', { 
                    name: '新用户', 
                    email: 'newuser@example.com', 
                    age: 30 
                  })}
                  className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                  disabled={loading}
                >
                  POST /api/users
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">认证API</h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="邮箱"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="密码"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => makeRequest('/api/auth/login', 'POST', loginData)}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  disabled={loading}
                >
                  POST /api/auth/login
                </button>
                <button
                  onClick={() => makeRequest('/api/auth/login', 'GET')}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  GET /api/auth/login (检查登录状态)
                </button>
                <button
                  onClick={() => makeRequest('/api/auth/logout', 'POST')}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  disabled={loading}
                >
                  POST /api/auth/logout
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">受保护的API</h2>
              <div className="space-y-3">
                <button
                  onClick={() => makeRequest('/api/protected/profile')}
                  className="w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                  disabled={loading}
                >
                  GET /api/protected/profile
                </button>
                <button
                  onClick={() => makeRequest('/api/protected/profile', 'PUT', { 
                    name: '更新的用户名',
                    preferences: { theme: 'dark', language: 'zh-CN' }
                  })}
                  className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                  disabled={loading}
                >
                  PUT /api/protected/profile
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">文件上传API</h2>
              <div className="space-y-3">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf,.txt"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <button
                  onClick={() => makeRequest('/api/upload', 'GET')}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  GET /api/upload (文件列表)
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：结果显示 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">API响应结果</h2>
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              )}
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto h-96 whitespace-pre-wrap">
                {result || '点击左侧按钮测试API...'}
              </pre>
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">使用说明</h2>
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-700">测试步骤：</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>先测试基础API，了解基本的GET/POST请求</li>
              <li>测试用户管理API，体验CRUD操作</li>
              <li>使用默认账户登录：admin@example.com / admin123</li>
              <li>登录后测试受保护的API</li>
              <li>尝试上传文件（支持图片、PDF、文本文件）</li>
            </ol>
            
            <h3 className="text-lg font-semibold text-gray-700 mt-6">默认测试账户：</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>管理员：admin@example.com / admin123</li>
              <li>普通用户：user@example.com / user123</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 