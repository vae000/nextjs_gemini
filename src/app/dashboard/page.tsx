import { Suspense } from 'react';
import { getUsers, getStats, getRecentActivity } from '@/lib/api';
import UserCard from '@/components/UserCard';
import StatsCard from '@/components/StatsCard';
import InteractiveButton from '@/components/InteractiveButton';
import Link from 'next/link';
import Image from 'next/image';

// 加载组件
function LoadingCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    </div>
  );
}

// 用户列表组件 (Server Component)
async function UserList() {
  console.log("🖥️ Server Component: 开始获取用户数据");
  const users = await getUsers();
  console.log("🖥️ Server Component: 用户数据获取完成");
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// 统计信息组件 (Server Component)
async function StatsDashboard() {
  console.log("🖥️ Server Component: 开始获取统计数据");
  const stats = await getStats();
  console.log("🖥️ Server Component: 统计数据获取完成");
  
  return <StatsCard stats={stats} />;
}

// 最新活动组件 (Server Component)
async function RecentActivity() {
  console.log("🖥️ Server Component: 开始获取活动数据");
  const activities = await getRecentActivity();
  console.log("🖥️ Server Component: 活动数据获取完成");
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        📈 最新活动 (Server Component)
      </h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm">📝</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">{activity}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Math.floor(Math.random() * 60) + 1} 分钟前
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <p className="text-sm text-green-800 dark:text-green-200">
          🖥️ <strong>Server Component 特性：</strong>
          这些活动数据在服务器上实时获取，可以直接访问数据库或外部API，
          无需客户端的额外 JavaScript 代码。
        </p>
      </div>
    </div>
  );
}

// 主页面组件 (Server Component)
export default function Dashboard() {
  console.log("🖥️ Server Component: 渲染仪表板主页面");
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 导航栏 */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  className="dark:invert"
                  src="/next.svg"
                  alt="Next.js logo"
                  width={120}
                  height={24}
                  priority
                />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  Gemini
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                首页
              </Link>
              <Link
                href="/about"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                关于
              </Link>
              <Link
                href="/blog"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                博客
              </Link>
              <span className="text-blue-600 dark:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                仪表板
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🚀 Server Components 演示仪表板
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            体验 Server Components 的强大功能：异步数据获取、服务器端计算、零客户端 JavaScript
          </p>
        </div>

        {/* 核心概念说明 */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🧠 Server Components 核心概念
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                🖥️ Server Components
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• 在服务器上运行（默认行为）</li>
                <li>• 可以直接访问数据库和文件系统</li>
                <li>• 零客户端 JavaScript 负担</li>
                <li>• 支持异步数据获取</li>
                <li>• 更好的 SEO 和性能</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                💻 Client Components
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• 需要 'use client' 指令</li>
                <li>• 在浏览器中运行</li>
                <li>• 支持交互和状态管理</li>
                <li>• 可以使用 React Hooks</li>
                <li>• 处理用户事件</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            📊 实时统计信息
          </h2>
          <Suspense fallback={<LoadingCard />}>
            <StatsDashboard />
          </Suspense>
        </div>

        {/* 交互式组件演示 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            💫 Client Component 交互演示
          </h2>
          <InteractiveButton />
        </div>

        {/* 双栏布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 用户列表 */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              👥 用户列表 (Server Components)
            </h2>
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            }>
              <UserList />
            </Suspense>
          </div>

          {/* 最新活动 */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              📈 最新活动
            </h2>
            <Suspense fallback={<LoadingCard />}>
              <RecentActivity />
            </Suspense>
          </div>
        </div>

        {/* 技术说明 */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🔧 技术实现细节
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🎯 这个页面展示了什么？
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• 异步数据获取 (await getUsers())</li>
                <li>• 服务器端计算和处理</li>
                <li>• Suspense 边界的使用</li>
                <li>• 加载状态的优雅处理</li>
                <li>• Server 和 Client 组件的混合使用</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                ⚡ 性能优势
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• 减少客户端 JavaScript 体积</li>
                <li>• 更快的首屏加载时间</li>
                <li>• 更好的 SEO 表现</li>
                <li>• 服务器端缓存利用</li>
                <li>• 流式渲染支持</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 