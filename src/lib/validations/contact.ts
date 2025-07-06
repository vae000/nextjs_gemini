import { z } from 'zod';

// 联系表单验证 schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, '姓名至少需要2个字符')
    .max(50, '姓名不能超过50个字符')
    .regex(/^[\u4e00-\u9fa5a-zA-Z\s]+$/, '姓名只能包含中文、英文和空格'),
  
  email: z
    .string()
    .email('请输入有效的邮箱地址')
    .max(100, '邮箱地址不能超过100个字符'),
  
  phone: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // 可选字段
      return /^1[3-9]\d{9}$/.test(val) || /^\+\d{1,3}\d{10,14}$/.test(val);
    }, '请输入有效的手机号码'),
  
  company: z
    .string()
    .max(100, '公司名称不能超过100个字符')
    .optional(),
  
  subject: z
    .string()
    .min(5, '主题至少需要5个字符')
    .max(100, '主题不能超过100个字符'),
  
  message: z
    .string()
    .min(10, '消息内容至少需要10个字符')
    .max(2000, '消息内容不能超过2000个字符'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// 联系表单提交响应类型
export interface ContactFormResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    createdAt: string;
  };
  errors?: Record<string, string[]>;
}
