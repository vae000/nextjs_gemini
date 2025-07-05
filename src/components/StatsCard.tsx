import { Stats } from '@/lib/api';

// 这是一个 Server Component（默认行为）
// 它在服务器上运行，可以进行复杂的计算和数据处理
export default function StatsCard({ stats }: { stats: Stats }) {
  console.log("🖥️ Server Component: 渲染统计卡片");
  
  // 服务器端计算（不会发送到客户端）
  const growthRate = Math.floor(Math.random() * 20) + 5;
  const efficiency = Math.floor((stats.totalViews / stats.totalPosts) * 100) / 100;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        📊 平台统计 (Server Component)
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 总用户数 */}
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-2xl">👥</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalUsers}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            总用户数
          </div>
        </div>
        
        {/* 总文章数 */}
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-2xl">📝</span>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.totalPosts}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            总文章数
          </div>
        </div>
        
        {/* 总浏览量 */}
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-2xl">👁️</span>
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.totalViews.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            总浏览量
          </div>
        </div>
        
        {/* 平均阅读时间 */}
        <div className="text-center">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-2xl">⏱️</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.avgReadTime}分钟
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            平均阅读时间
          </div>
        </div>
      </div>
      
      {/* 服务器端计算的额外指标 */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🔢 服务器端计算指标
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📈</span>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  +{growthRate}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  月增长率
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚡</span>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {efficiency}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  内容效率
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 说明文本 */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          🖥️ <strong>Server Component 特性：</strong>
          这些数据在服务器上获取和计算，包括复杂的统计分析。
          服务器端计算不会增加客户端的 JavaScript 负担。
        </p>
      </div>
    </div>
  );
} 