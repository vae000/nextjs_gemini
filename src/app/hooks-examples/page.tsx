'use client'

import { useState } from 'react'
import { useApi, useApiMutation, useAuth, useFileUpload, usePagination } from '@/hooks/useApi'
import ExamplesNavigation from '@/components/ExamplesNavigation'

interface User {
  id: number
  name: string
  email: string
  age: number
  role: string
}

export default function HooksExamplesPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // 1. 使用useAuth Hook管理认证状态
  const { isAuthenticated, user, loading: authLoading, login, logout } = useAuth()

  // 2. 使用useApi Hook获取数据
  const { data: helloData, loading: helloLoading, error: helloError, refetch: refetchHello } = useApi<any>('/api/hello')

  // 3. 使用useApiMutation Hook进行数据操作
  const { mutate: createUser, loading: createLoading } = useApiMutation<User, Partial<User>>('/api/users', 'POST')
  const { mutate: updateUser, loading: updateLoading } = useApiMutation<User, Partial<User>>('/api/users/1', 'PUT')
  const { mutate: deleteUser, loading: deleteLoading } = useApiMutation<User>('/api/users/1', 'DELETE')

  // 4. 使用usePagination Hook处理分页数据
  const {
    data: users,
    pagination,
    loading: usersLoading,
    error: usersError,
    search,
    updateSearch,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    refetch: refetchUsers
  } = usePagination<User>('/api/users', 1, 5)

  // 5. 使用useFileUpload Hook处理文件上传
  const { uploading, progress, error: uploadError, upload } = useFileUpload()

  // 处理登录
  const handleLogin = async () => {
    const result = await login({
      email: 'admin@example.com',
      password: 'admin123'
    })
    
    if (result.success) {
      alert('登录成功！')
    } else {
      alert(result.error || '登录失败')
    }
  }

  // 处理创建用户
  const handleCreateUser = async () => {
    try {
      const newUser = await createUser({
        name: '新用户' + Date.now(),
        email: `user${Date.now()}@example.com`,
        age: Math.floor(Math.random() * 50) + 18
      })
      
      if (newUser) {
        alert('用户创建成功！')
        refetchUsers() // 刷新用户列表
      }
    } catch (error) {
      alert('创建用户失败')
    }
  }

  // 处理更新用户
  const handleUpdateUser = async () => {
    try {
      const updatedUser = await updateUser({
        name: '更新的用户名' + Date.now()
      })
      
      if (updatedUser) {
        alert('用户更新成功！')
        refetchUsers() // 刷新用户列表
      }
    } catch (error) {
      alert('更新用户失败')
    }
  }

  // 处理删除用户
  const handleDeleteUser = async () => {
    if (!confirm('确定要删除用户吗？')) return
    
    try {
      await deleteUser()
      alert('用户删除成功！')
      refetchUsers() // 刷新用户列表
    } catch (error) {
      alert('删除用户失败')
    }
  }

  // 处理文件上传
  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('请选择文件')
      return
    }

    try {
      const result = await upload(selectedFile, '测试上传')
      alert('文件上传成功！')
      console.log('上传结果:', result)
    } catch (error) {
      alert('文件上传失败')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">使用自定义Hooks调用API Routes</h1>
        
        <ExamplesNavigation />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 认证状态 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">认证状态 (useAuth)</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  状态: {isAuthenticated ? '已登录' : '未登录'}
                </span>
                <div className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              
              {isAuthenticated && user && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>用户:</strong> {user.name}
                  </p>
                  <p className="text-sm text-green-800">
                    <strong>邮箱:</strong> {user.email}
                  </p>
                  <p className="text-sm text-green-800">
                    <strong>角色:</strong> {user.role}
                  </p>
                </div>
              )}
              
              <button
                onClick={isAuthenticated ? logout : handleLogin}
                className={`w-full px-4 py-2 rounded text-white ${
                  isAuthenticated 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isAuthenticated ? '注销' : '登录'}
              </button>
            </div>
          </div>

          {/* API数据获取 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">数据获取 (useApi)</h2>
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium text-gray-700 mb-2">Hello API响应:</h3>
                {helloLoading && <p className="text-sm text-gray-500">加载中...</p>}
                {helloError && <p className="text-sm text-red-500">错误: {helloError}</p>}
                {helloData && (
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(helloData, null, 2)}
                  </pre>
                )}
              </div>
              
              <button
                onClick={refetchHello}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={helloLoading}
              >
                {helloLoading ? '刷新中...' : '刷新数据'}
              </button>
            </div>
          </div>

          {/* 数据操作 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">数据操作 (useApiMutation)</h2>
            <div className="space-y-3">
              <button
                onClick={handleCreateUser}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={createLoading}
              >
                {createLoading ? '创建中...' : '创建用户'}
              </button>
              
              <button
                onClick={handleUpdateUser}
                className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                disabled={updateLoading}
              >
                {updateLoading ? '更新中...' : '更新用户'}
              </button>
              
              <button
                onClick={handleDeleteUser}
                className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                disabled={deleteLoading}
              >
                {deleteLoading ? '删除中...' : '删除用户'}
              </button>
            </div>
          </div>
        </div>

        {/* 分页用户列表 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">分页用户列表 (usePagination)</h2>
          
          {/* 搜索框 */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="搜索用户..."
              value={search}
              onChange={(e) => updateSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* 用户列表 */}
          <div className="space-y-3 mb-4">
            {usersLoading && <p className="text-center text-gray-500">加载中...</p>}
            {usersError && <p className="text-center text-red-500">错误: {usersError}</p>}
            
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
                </div>
              </div>
            ))}
          </div>
          
          {/* 分页控件 */}
          {pagination && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevPage}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                  上一页
                </button>
                
                <span className="text-sm text-gray-600">
                  第 {pagination.page} 页 / 共 {pagination.totalPages} 页
                </span>
                
                <button
                  onClick={nextPage}
                  disabled={!pagination.hasNext}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                  下一页
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">每页显示:</label>
                <select
                  value={pagination.limit}
                  onChange={(e) => changeLimit(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                
                <span className="text-sm text-gray-600">
                  总共 {pagination.total} 条记录
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 文件上传 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">文件上传 (useFileUpload)</h2>
          
          <div className="space-y-4">
            <div>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                accept="image/*,application/pdf,.txt"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {selectedFile && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  选择的文件: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            )}
            
            {uploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">上传进度: {progress}%</p>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {uploadError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">上传错误: {uploadError}</p>
              </div>
            )}
            
            <button
              onClick={handleFileUpload}
              disabled={!selectedFile || uploading}
              className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-300"
            >
              {uploading ? '上传中...' : '上传文件'}
            </button>
          </div>
        </div>

        {/* 代码示例 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">代码示例</h2>
          <div className="bg-gray-100 rounded-lg p-4 text-sm space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">1. 使用useAuth Hook:</h3>
              <pre className="text-gray-600 whitespace-pre-wrap">{`import { useAuth } from '@/hooks/useApi'

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth()
  
  const handleLogin = async () => {
    const result = await login({
      email: 'admin@example.com',
      password: 'admin123'
    })
    
    if (result.success) {
      alert('登录成功！')
    }
  }
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>欢迎, {user.name}!</p>
          <button onClick={logout}>注销</button>
        </div>
      ) : (
        <button onClick={handleLogin}>登录</button>
      )}
    </div>
  )
}`}</pre>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">2. 使用useApi Hook:</h3>
              <pre className="text-gray-600 whitespace-pre-wrap">{`import { useApi } from '@/hooks/useApi'

function UserList() {
  const { data, loading, error, refetch } = useApi('/api/users')
  
  if (loading) return <p>加载中...</p>
  if (error) return <p>错误: {error}</p>
  
  return (
    <div>
      {data?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button onClick={refetch}>刷新</button>
    </div>
  )
}`}</pre>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">3. 使用useApiMutation Hook:</h3>
              <pre className="text-gray-600 whitespace-pre-wrap">{`import { useApiMutation } from '@/hooks/useApi'

function CreateUser() {
  const { mutate: createUser, loading } = useApiMutation('/api/users', 'POST')
  
  const handleCreate = async () => {
    try {
      const newUser = await createUser({
        name: '新用户',
        email: 'new@example.com',
        age: 25
      })
      alert('创建成功！')
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
    </div>
  )
} 