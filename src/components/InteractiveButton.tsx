'use client'

import { useState } from 'react';

// 这是一个 Client Component（需要 'use client' 指令）
// 它在浏览器中运行，支持交互和状态管理
export default function InteractiveButton() {
  console.log("💻 Client Component: 渲染交互按钮");
  
  const [count, setCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [message, setMessage] = useState("点击按钮开始交互！");

  const handleClick = () => {
    setCount(count + 1);
    setMessage(`你已经点击了 ${count + 1} 次！`);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setMessage(isLiked ? "取消了点赞" : "点赞成功！");
  };

  const handleReset = () => {
    setCount(0);
    setIsLiked(false);
    setMessage("重置成功！");
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
      <h3 className="text-xl font-bold mb-4">💻 Client Component 交互演示</h3>
      
      {/* 状态显示 */}
      <div className="bg-white/20 rounded-lg p-4 mb-4">
        <p className="text-lg font-medium mb-2">{message}</p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🔢</span>
            <span>计数: {count}</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-2">{isLiked ? '❤️' : '🤍'}</span>
            <span>点赞: {isLiked ? '已点赞' : '未点赞'}</span>
          </div>
        </div>
      </div>
      
      {/* 交互按钮 */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleClick}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
        >
          点击计数 (+1)
        </button>
        
        <button
          onClick={handleLike}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
        >
          {isLiked ? '取消点赞' : '点赞'}
        </button>
        
        <button
          onClick={handleReset}
          className="bg-red-500/50 hover:bg-red-500/70 px-4 py-2 rounded-lg transition-colors"
        >
          重置
        </button>
      </div>
      
      {/* 特性说明 */}
      <div className="mt-4 text-sm opacity-90">
        <p>🎯 这个组件展示了 Client Component 的特性：</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>需要 'use client' 指令</li>
          <li>可以使用 React Hooks (useState)</li>
          <li>支持事件处理 (onClick)</li>
          <li>在浏览器中运行</li>
          <li>支持实时状态更新</li>
        </ul>
      </div>
    </div>
  );
} 