'use client'

import Image from "next/image";
import { useSession, signIn, signOut } from 'next-auth/react';

// 导航栏组件
function Navigation() {
  const { data: session, status } = useSession();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Image
                className="dark:invert"
                src="/next.svg"
                alt="Next.js logo"
                width={120}
                height={24}
                priority
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Gemini
              </span>
            </div>
          </div>

          {/* 导航菜单 */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="#"
                className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                首页
              </a>
              <a
                href="/about"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                关于
              </a>
              <a
                href="/blog"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                博客
              </a>
              <a
                href="/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                仪表板
              </a>
              <a
                href="/prisma-demo"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Prisma演示
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                联系
              </a>
            </div>
          </div>

          {/* 右侧按钮 */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="text-gray-600 dark:text-gray-300 px-3 py-2">
                加载中...
              </div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || '用户头像'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {session.user.name || session.user.email}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {session.user.role}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  退出
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => signIn()}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  登录
                </button>
                <a
                  href="/auth/signup"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  注册
                </a>
              </>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* 导航栏 */}
      <Navigation />

      {/* 主要内容 */}
      <div className="pt-16"> {/* 为固定导航栏留出空间 */}
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                欢迎来到 Next.js
                <br />
                <span className="text-blue-600">Gemini 项目</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                从零开始学习，结合 Gemini CLI 构建现代化 Web 应用
              </p>
            </div>

            <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
              <li className="mb-2 tracking-[-.01em]">
                开始编辑{" "}
                <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
                  src/app/page.tsx
                </code>
                文件
              </li>
              <li className="tracking-[-.01em]">
                保存并即时查看您的更改
              </li>
            </ol>

            <div className="flex gap-4 items-center flex-col sm:flex-row">
              <a
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  className="dark:invert"
                  src="/vercel.svg"
                  alt="Vercel logomark"
                  width={20}
                  height={20}
                />
                立即部署
              </a>
              <a
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                阅读文档
              </a>
            </div>

            {/* 学习资源部分 */}
            <div className="w-full max-w-4xl mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                🚀 学习资源
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* API Routes 完整指南 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">📚</span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        API Routes 完整指南
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                      详细的 API Routes 学习指南，包含理论教学、实践示例和最佳实践
                    </p>
                    <a
                      href="/api-guide"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      开始学习
                    </a>
                  </div>
                </div>

                {/* API 在线测试 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">🧪</span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        API 在线测试
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                      在线测试所有 API 功能，包含用户管理、认证、文件上传等
                    </p>
                    <a
                      href="/api-test"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      立即测试
                    </a>
                  </div>
                </div>

                {/* 客户端调用示例 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">💻</span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        客户端调用示例
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                      学习如何在 React 组件中调用 API Routes
                    </p>
                    <a
                      href="/examples"
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      查看示例
                    </a>
                  </div>
                </div>

                {/* 服务端调用示例 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">🖥️</span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        服务端调用示例
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                      学习如何在服务端组件中调用 API
                    </p>
                    <a
                      href="/server-examples"
                      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm font-medium"
                    >
                      查看示例
                    </a>
                  </div>
                </div>

                {/* 自定义 Hooks 示例 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">🪝</span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        自定义 Hooks 示例
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                      使用封装的 Hooks 简化 API 调用
                    </p>
                    <a
                      href="/hooks-examples"
                      className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm font-medium"
                    >
                      查看示例
                    </a>
                  </div>
                </div>

                {/* Prisma ORM 演示 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">🗄️</span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Prisma ORM 演示
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                      完整的 Prisma ORM 集成示例，包含用户管理、文章系统等
                    </p>
                    <a
                      href="/prisma-demo"
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
                    >
                      查看演示
                    </a>
                  </div>
                </div>

                {/* 学习路径 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">🗺️</span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Next.js 学习路径
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                      完整的 Next.js 学习路径规划，从基础到高级
                    </p>
                    <a
                      href="/NEXTJS_LEARNING_PATH.md"
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      查看路径
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="/file.svg"
                alt="File icon"
                width={16}
                height={16}
              />
              学习
            </a>
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="/window.svg"
                alt="Window icon"
                width={16}
                height={16}
              />
              示例
            </a>
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="/globe.svg"
                alt="Globe icon"
                width={16}
                height={16}
              />
              跳转到 nextjs.org →
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}
