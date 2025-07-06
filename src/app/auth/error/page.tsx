'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'

const errorMessages: { [key: string]: string } = {
  Configuration: '服务器配置错误',
  AccessDenied: '访问被拒绝',
  Verification: '验证失败',
  Default: '登录时发生错误',
  Signin: '登录失败',
  OAuthSignin: 'OAuth 登录失败',
  OAuthCallback: 'OAuth 回调失败',
  OAuthCreateAccount: '无法创建 OAuth 账户',
  EmailCreateAccount: '无法创建邮箱账户',
  Callback: '回调失败',
  OAuthAccountNotLinked: '该邮箱已被其他登录方式使用',
  EmailSignin: '邮箱登录失败',
  CredentialsSignin: '用户名或密码错误',
  SessionRequired: '需要登录才能访问此页面',
}

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Default'
  const errorMessage = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo 和标题 */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={24}
              priority
            />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Gemini
            </span>
          </div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            认证错误
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            登录过程中发生了错误
          </p>
        </div>

        {/* 错误信息 */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">
                  {errorMessage}
                </h3>
                <div className="mt-2 text-sm">
                  <p>
                    {error === 'OAuthAccountNotLinked' && (
                      '该邮箱地址已经与其他登录方式关联。请使用原来的登录方式，或者使用不同的邮箱地址。'
                    )}
                    {error === 'CredentialsSignin' && (
                      '请检查您的邮箱地址和密码是否正确。'
                    )}
                    {error === 'AccessDenied' && (
                      '您没有权限访问此应用。请联系管理员。'
                    )}
                    {!['OAuthAccountNotLinked', 'CredentialsSignin', 'AccessDenied'].includes(error) && (
                      '请稍后重试，或联系技术支持。'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              重新登录
            </Link>
            
            {error === 'OAuthAccountNotLinked' && (
              <Link
                href="/auth/signup"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                使用其他邮箱注册
              </Link>
            )}
          </div>
        </div>

        {/* 返回首页链接 */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            ← 返回首页
          </Link>
        </div>

        {/* 调试信息（仅开发环境） */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-xs text-gray-600 dark:text-gray-400">
            <p><strong>错误代码:</strong> {error}</p>
            <p><strong>URL:</strong> {window.location.href}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}
