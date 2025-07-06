# 联系功能使用指南

本指南介绍了 Next.js Gemini 项目中联系功能的配置和使用方法。

## 功能特性

### ✨ 主要功能
- 📝 响应式联系表单（支持桌面端和移动端）
- 📧 自动邮件发送（给管理员和用户）
- 🛡️ 完整的安全保护（CSRF、速率限制、输入清理）
- 💾 数据库存储联系记录
- 🎨 美观的用户界面和交互效果
- ⚡ 实时表单验证和状态反馈

### 🔒 安全特性
- **CSRF 保护**：防止跨站请求伪造攻击
- **速率限制**：15分钟内最多3次提交，防止垃圾邮件
- **输入清理**：自动清理和过滤恶意输入
- **数据验证**：前端和后端双重验证
- **来源检查**：验证请求来源的合法性

## 快速开始

### 1. 数据库配置

首先需要更新数据库 schema：

```bash
# 生成 Prisma 客户端
npx prisma generate

# 推送数据库变更（开发环境）
npx prisma db push

# 或者创建迁移（生产环境推荐）
npx prisma migrate dev --name add-contact-model
```

### 2. 环境变量配置

复制 `.env.example` 到 `.env` 并配置以下变量：

```env
# 邮件服务配置
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# 联系邮箱
CONTACT_EMAIL="contact@yoursite.com"

# 站点配置
SITE_NAME="Your Site Name"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Gmail 配置示例

如果使用 Gmail 作为 SMTP 服务：

1. 启用两步验证
2. 生成应用专用密码
3. 使用应用专用密码作为 `SMTP_PASS`

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="your-16-digit-app-password"
```

## 使用方法

### 页面访问

1. **首页联系表单**：访问 `/` 并滚动到页面底部
2. **独立联系页面**：访问 `/contact`

### API 端点

- `POST /api/contact` - 提交联系表单
- `GET /api/contact` - 获取联系记录（仅管理员）

### 组件使用

```tsx
import ContactForm from '@/components/ContactForm';

function MyPage() {
  return (
    <ContactForm 
      onSuccess={(data) => {
        console.log('提交成功:', data);
      }}
      onError={(error) => {
        console.error('提交失败:', error);
      }}
    />
  );
}
```

## 表单字段

| 字段 | 类型 | 必填 | 验证规则 |
|------|------|------|----------|
| name | string | ✅ | 2-50字符，仅中英文和空格 |
| email | string | ✅ | 有效邮箱格式，最多100字符 |
| phone | string | ❌ | 有效手机号格式 |
| company | string | ❌ | 最多100字符 |
| subject | string | ✅ | 5-100字符 |
| message | string | ✅ | 10-2000字符 |

## 管理功能

### 查看联系记录

管理员可以通过 API 查看所有联系记录：

```bash
# 获取所有记录
GET /api/contact

# 分页查询
GET /api/contact?page=1&limit=10

# 按状态筛选
GET /api/contact?status=PENDING
```

### 联系状态

- `PENDING` - 待处理
- `PROCESSING` - 处理中
- `RESOLVED` - 已解决
- `CLOSED` - 已关闭

## 自定义配置

### 修改速率限制

编辑 `src/lib/rate-limit.ts`：

```typescript
export const contactFormLimiter = new MemoryRateLimiter(
  15 * 60 * 1000, // 时间窗口（毫秒）
  3               // 最大请求次数
);
```

### 自定义邮件模板

编辑 `src/lib/email.ts` 中的 HTML 模板。

### 修改表单验证

编辑 `src/lib/validations/contact.ts` 中的验证规则。

## 故障排除

### 常见问题

1. **邮件发送失败**
   - 检查 SMTP 配置是否正确
   - 确认邮箱密码或应用专用密码
   - 查看服务器日志获取详细错误信息

2. **表单提交失败**
   - 检查网络连接
   - 确认 API 路由是否正常工作
   - 查看浏览器控制台错误信息

3. **速率限制触发**
   - 等待15分钟后重试
   - 或者调整速率限制配置

### 调试模式

在开发环境中，即使没有配置邮件服务，表单提交也会成功，只是不会发送邮件。

## 性能优化

1. **数据库索引**：为常用查询字段添加索引
2. **缓存策略**：对联系记录列表实施缓存
3. **异步处理**：将邮件发送改为后台任务处理

## 安全建议

1. 定期清理过期的速率限制数据
2. 监控异常提交行为
3. 定期备份联系记录数据
4. 使用 HTTPS 保护数据传输

## 扩展功能

可以考虑添加的功能：

- 📊 联系统计仪表板
- 🔔 实时通知系统
- 📱 短信通知功能
- 🤖 自动回复机器人
- 📋 联系记录导出功能
- 🏷️ 标签和分类系统

## 技术栈

- **前端**：React, TypeScript, Tailwind CSS
- **表单处理**：React Hook Form, Zod
- **后端**：Next.js API Routes
- **数据库**：Prisma ORM
- **邮件服务**：Nodemailer
- **安全**：自定义 CSRF 保护和速率限制

## 贡献

欢迎提交 Issue 和 Pull Request 来改进联系功能！
