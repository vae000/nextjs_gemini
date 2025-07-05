import { User, formatDate } from '@/lib/api';

// 这是一个 Server Component（默认行为）
// 它在服务器上运行，可以直接访问服务器资源
export default function UserCard({ user }: { user: User }) {
  console.log("🖥️ Server Component: 渲染用户卡片", user.name);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* 用户头像 */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl mr-4">
          {user.avatar}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.role}
          </p>
        </div>
      </div>
      
      {/* 用户信息 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <span className="mr-2">📧</span>
          <span>{user.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <span className="mr-2">🕒</span>
          <span>最后登录：{formatDate(user.lastLogin)}</span>
        </div>
      </div>
      
      {/* 统计信息 */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {user.posts}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            文章数量
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {user.followers}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            关注者
          </div>
        </div>
      </div>
    </div>
  );
} 