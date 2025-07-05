// 博客文章类型定义
export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  readTime: number;
  image?: string;
}

// 模拟博客数据
export const blogPosts: BlogPost[] = [
  {
    id: "nextjs-app-router-guide",
    title: "Next.js App Router 完整指南",
    summary: "深入了解Next.js 13+的App Router架构，掌握现代化的React应用开发方式。",
    content: `
# Next.js App Router 完整指南

App Router是Next.js 13引入的新架构，它为React应用提供了更强大和灵活的路由系统。

## 核心概念

### 1. 文件系统路由
App Router基于文件系统，每个文件夹代表一个路由段：
- \`app/page.tsx\` → \`/\`
- \`app/about/page.tsx\` → \`/about\`
- \`app/blog/[id]/page.tsx\` → \`/blog/123\`

### 2. 特殊文件
- **layout.tsx**: 定义布局
- **page.tsx**: 定义页面
- **loading.tsx**: 加载状态
- **error.tsx**: 错误处理
- **not-found.tsx**: 404页面

### 3. Server Components
默认情况下，所有组件都是Server Components，可以直接访问服务器资源。

## 实践建议

1. **渐进式迁移**: 从Pages Router迁移时，可以逐步转换
2. **组件设计**: 合理拆分Server和Client Components
3. **性能优化**: 利用内置的优化特性

开始使用App Router，体验现代化的Web开发！
    `,
    author: "Next.js 开发者",
    date: "2024-01-15",
    category: "技术教程",
    tags: ["Next.js", "React", "App Router", "前端"],
    readTime: 8,
    image: "/next.svg"
  },
  {
    id: "react-19-new-features",
    title: "React 19 新特性详解",
    summary: "探索React 19带来的激动人心的新功能，包括并发特性、Suspense改进等。",
    content: `
# React 19 新特性详解

React 19带来了许多令人兴奋的新功能，让我们的应用更加强大和高效。

## 主要新特性

### 1. 并发特性增强
- **Automatic Batching**: 自动批处理更新
- **Concurrent Features**: 并发渲染优化
- **Suspense Improvements**: Suspense机制改进

### 2. 新的Hooks
- **useId**: 生成唯一ID
- **useTransition**: 过渡状态管理
- **useDeferredValue**: 延迟值处理

### 3. 服务器组件支持
- **Zero-bundle-size Components**: 零打包组件
- **Server-side Rendering**: 服务端渲染优化
- **Streaming**: 流式渲染

## 升级建议

1. **渐进升级**: 逐步迁移现有应用
2. **性能测试**: 验证升级后的性能表现
3. **兼容性检查**: 确保第三方库兼容

React 19为前端开发带来了新的可能性！
    `,
    author: "React 团队",
    date: "2024-01-10",
    category: "技术更新",
    tags: ["React", "JavaScript", "前端", "新特性"],
    readTime: 6,
    image: "/react.svg"
  },
  {
    id: "tailwind-css-best-practices",
    title: "Tailwind CSS 最佳实践",
    summary: "学习如何高效使用Tailwind CSS构建现代化的用户界面，提升开发效率。",
    content: `
# Tailwind CSS 最佳实践

Tailwind CSS是一个实用程序优先的CSS框架，它改变了我们构建用户界面的方式。

## 核心原则

### 1. 实用程序优先
使用小而可复用的类名来构建复杂的组件：
\`\`\`html
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  按钮
</button>
\`\`\`

### 2. 响应式设计
使用前缀实现响应式布局：
\`\`\`html
<div class="w-full md:w-1/2 lg:w-1/3">
  响应式容器
</div>
\`\`\`

### 3. 组件抽象
对于复杂的UI，使用@apply提取组件：
\`\`\`css
.btn-primary {
  @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
}
\`\`\`

## 进阶技巧

1. **自定义配置**: 扩展默认主题
2. **插件系统**: 使用官方和社区插件
3. **优化打包**: 移除未使用的样式

掌握Tailwind CSS，让界面开发更加高效！
    `,
    author: "CSS 专家",
    date: "2024-01-05",
    category: "样式设计",
    tags: ["Tailwind CSS", "CSS", "前端", "设计"],
    readTime: 7,
    image: "/tailwind.svg"
  },
  {
    id: "typescript-advanced-types",
    title: "TypeScript 高级类型技巧",
    summary: "深入掌握TypeScript的高级类型系统，编写更安全、更可维护的代码。",
    content: `
# TypeScript 高级类型技巧

TypeScript的类型系统极其强大，掌握高级类型技巧可以显著提升代码质量。

## 高级类型

### 1. 联合类型和交叉类型
\`\`\`typescript
// 联合类型
type Status = 'pending' | 'success' | 'error';

// 交叉类型
type UserWithId = User & { id: number };
\`\`\`

### 2. 映射类型
\`\`\`typescript
// 使所有属性可选
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 使所有属性必需
type Required<T> = {
  [P in keyof T]-?: T[P];
};
\`\`\`

### 3. 条件类型
\`\`\`typescript
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };
\`\`\`

## 实用模式

1. **类型守卫**: 运行时类型检查
2. **泛型约束**: 限制泛型参数
3. **模板字面量类型**: 类型级别的字符串操作

TypeScript让JavaScript更加强大和可靠！
    `,
    author: "TypeScript 开发者",
    date: "2024-01-01",
    category: "编程语言",
    tags: ["TypeScript", "JavaScript", "类型系统", "编程"],
    readTime: 10,
    image: "/typescript.svg"
  }
];

// 获取所有博客文章
export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// 根据ID获取博客文章
export function getPostById(id: string): BlogPost | null {
  return blogPosts.find(post => post.id === id) || null;
}

// 获取相关文章
export function getRelatedPosts(currentId: string, limit: number = 3): BlogPost[] {
  return blogPosts
    .filter(post => post.id !== currentId)
    .slice(0, limit);
}

// 根据分类获取文章
export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(post => post.category === category);
}

// 获取所有分类
export function getAllCategories(): string[] {
  const categories = blogPosts.map(post => post.category);
  return [...new Set(categories)];
}

// 获取所有标签
export function getAllTags(): string[] {
  const tags = blogPosts.flatMap(post => post.tags);
  return [...new Set(tags)];
} 