'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
  {
    title: '完整学习指南',
    href: '/api-guide',
    description: '页面调用API Routes完整教程',
    icon: '📚'
  },
  {
    title: 'API Routes测试',
    href: '/api-test',
    description: '在线测试所有API Routes功能',
    icon: '🧪'
  },
  {
    title: '客户端调用示例',
    href: '/examples',
    description: '学习如何在客户端组件中调用API',
    icon: '🖥️'
  },
  {
    title: '服务端调用示例',
    href: '/server-examples',
    description: '学习如何在服务端组件中调用API',
    icon: '🔧'
  },
  {
    title: '自定义Hooks示例',
    href: '/hooks-examples',
    description: '使用自定义Hooks简化API调用',
    icon: '🪝'
  }
]

export default function ExamplesNavigation() {
  const pathname = usePathname()

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 API Routes学习导航</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                isActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className={`font-semibold mb-2 ${isActive ? 'text-blue-800' : 'text-gray-800'}`}>
                  {item.title}
                </h3>
                <p className={`text-sm ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                  {item.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">💡 学习建议</h3>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. 阅读 <strong>完整学习指南</strong>，了解全貌和最佳实践</li>
          <li>2. 从 <strong>API Routes测试</strong> 开始，了解API的基本功能</li>
          <li>3. 学习 <strong>客户端调用示例</strong>，掌握在React组件中调用API</li>
          <li>4. 理解 <strong>服务端调用示例</strong>，学习SSR和SEO优化</li>
          <li>5. 使用 <strong>自定义Hooks示例</strong>，提高代码复用性和维护性</li>
        </ol>
      </div>
    </div>
  )
} 