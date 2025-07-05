// 模拟API延迟
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 用户数据类型
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  lastLogin: string;
  posts: number;
  followers: number;
}

// 统计数据类型
export interface Stats {
  totalUsers: number;
  totalPosts: number;
  totalViews: number;
  avgReadTime: number;
}

// 模拟用户数据
const users: User[] = [
  {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com",
    avatar: "👨‍💻",
    role: "Frontend Developer",
    lastLogin: "2024-01-15T10:30:00Z",
    posts: 12,
    followers: 234
  },
  {
    id: 2,
    name: "李四",
    email: "lisi@example.com",
    avatar: "👩‍💻",
    role: "Full Stack Developer",
    lastLogin: "2024-01-14T15:45:00Z",
    posts: 8,
    followers: 156
  },
  {
    id: 3,
    name: "王五",
    email: "wangwu@example.com",
    avatar: "🧑‍💻",
    role: "Backend Developer",
    lastLogin: "2024-01-13T09:20:00Z",
    posts: 15,
    followers: 432
  },
  {
    id: 4,
    name: "赵六",
    email: "zhaoliu@example.com",
    avatar: "👨‍🎨",
    role: "UI/UX Designer",
    lastLogin: "2024-01-12T14:10:00Z",
    posts: 6,
    followers: 298
  }
];

// Server Component: 获取用户列表
export async function getUsers(): Promise<User[]> {
  console.log("🖥️ Server Component: 获取用户数据...");
  
  // 模拟网络延迟
  await delay(1000);
  
  // 在真实应用中，这里会是数据库查询
  // const users = await db.users.findMany();
  
  return users;
}

// Server Component: 获取单个用户
export async function getUserById(id: number): Promise<User | null> {
  console.log(`🖥️ Server Component: 获取用户 ID ${id} 的数据...`);
  
  // 模拟网络延迟
  await delay(800);
  
  // 在真实应用中，这里会是数据库查询
  // const user = await db.users.findUnique({ where: { id } });
  
  return users.find(user => user.id === id) || null;
}

// Server Component: 获取统计数据
export async function getStats(): Promise<Stats> {
  console.log("🖥️ Server Component: 获取统计数据...");
  
  // 模拟复杂的服务器端计算
  await delay(1200);
  
  // 在真实应用中，这里会是复杂的聚合查询
  // const stats = await db.stats.aggregate({...});
  
  return {
    totalUsers: users.length,
    totalPosts: users.reduce((sum, user) => sum + user.posts, 0),
    totalViews: Math.floor(Math.random() * 100000) + 50000,
    avgReadTime: Math.floor(Math.random() * 5) + 3
  };
}

// Server Component: 获取最新活动
export async function getRecentActivity(): Promise<string[]> {
  console.log("🖥️ Server Component: 获取最新活动...");
  
  await delay(600);
  
  // 模拟活动数据
  return [
    "张三发表了新文章《React 18 新特性详解》",
    "李四更新了个人资料",
    "王五回复了一条评论",
    "赵六上传了新的设计稿",
    "系统进行了性能优化"
  ];
}

// 格式化时间（服务器端工具函数）
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days}天前`;
  
  return date.toLocaleDateString('zh-CN');
} 