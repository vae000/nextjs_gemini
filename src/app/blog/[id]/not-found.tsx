import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-700">
            404
          </h1>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          文章未找到
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          抱歉，您访问的博客文章不存在或已被移除。
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/blog"
            className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            返回博客列表
          </Link>
          <Link
            href="/"
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
} 