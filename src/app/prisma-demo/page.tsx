import Link from 'next/link'
import { UserService, PostService } from '@/lib/db-operations'

export default async function PrismaDemoPage() {
  // 在服务端获取数据
  let users: any[] = []
  let posts: any[] = []
  let error: string | null = null

  try {
    // 获取用户数据
    const usersResult = await UserService.getUsers({ limit: 5 })
    users = usersResult.users

    // 获取文章数据
    const postsResult = await PostService.getPosts({ limit: 5, published: true })
    posts = postsResult.posts
  } catch (err) {
    error = '数据库连接失败，请确保数据库已配置并运行'
    console.error('数据库错误:', err)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 导航栏 */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                Next.js + Prisma 演示
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Prisma ORM 演示
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            展示Next.js与Prisma ORM的集成，包括用户管理、文章管理等功能。
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  数据库连接错误
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                  <p className="mt-2">
                    请确保：
                    <br />
                    1. PostgreSQL数据库已启动
                    <br />
                    2. 环境变量DATABASE_URL已正确配置
                    <br />
                    3. 已运行数据库迁移：<code className="bg-red-100 dark:bg-red-800 px-1 rounded">npx prisma db push</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 用户列表 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  用户列表
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  从数据库获取的用户数据
                </p>
              </div>
              <div className="p-6">
                {users.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    暂无用户数据
                  </p>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {user.name || '未设置姓名'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.email}
                          </p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'ADMIN' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : user.role === 'MODERATOR'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {user.role}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {user._count.posts} 篇文章
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {user._count.comments} 条评论
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 文章列表 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  文章列表
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  已发布的文章
                </p>
              </div>
              <div className="p-6">
                {posts.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    暂无文章数据
                  </p>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {post.summary}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              作者：{post.author.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {post.views} 次浏览
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {post._count.comments} 条评论
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {post.category && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {post.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* API 端点信息 */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              API 端点
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              可用的Prisma API端点
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">用户API</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs font-mono mr-2">
                      GET
                    </span>
                    <code className="text-gray-600 dark:text-gray-400">/api/prisma-users</code>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs font-mono mr-2">
                      POST
                    </span>
                    <code className="text-gray-600 dark:text-gray-400">/api/prisma-users</code>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs font-mono mr-2">
                      GET
                    </span>
                    <code className="text-gray-600 dark:text-gray-400">/api/prisma-users/[id]</code>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded text-xs font-mono mr-2">
                      PUT
                    </span>
                    <code className="text-gray-600 dark:text-gray-400">/api/prisma-users/[id]</code>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded text-xs font-mono mr-2">
                      DELETE
                    </span>
                    <code className="text-gray-600 dark:text-gray-400">/api/prisma-users/[id]</code>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">文章API</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs font-mono mr-2">
                      GET
                    </span>
                    <code className="text-gray-600 dark:text-gray-400">/api/prisma-posts</code>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs font-mono mr-2">
                      POST
                    </span>
                    <code className="text-gray-600 dark:text-gray-400">/api/prisma-posts</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            🚀 开始使用
          </h3>
          <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
            <div>
              <strong>1. 配置数据库连接：</strong>
              <br />
              在项目根目录创建 <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">.env.local</code> 文件，
              添加：<code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">DATABASE_URL="postgresql://..."</code>
            </div>
            <div>
              <strong>2. 生成Prisma客户端：</strong>
              <br />
              运行：<code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">npm run db:generate</code>
            </div>
            <div>
              <strong>3. 同步数据库结构：</strong>
              <br />
              运行：<code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">npm run db:push</code>
            </div>
            <div>
              <strong>4. 初始化测试数据：</strong>
              <br />
              运行：<code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">npm run db:seed</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 