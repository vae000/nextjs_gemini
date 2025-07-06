import nodemailer from 'nodemailer';
import type { ContactFormData } from './validations/contact';

// 邮件配置接口
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// 创建邮件传输器
function createTransporter() {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  };

  return nodemailer.createTransport(config);
}

// 发送联系表单邮件
export async function sendContactEmail(data: ContactFormData): Promise<boolean> {
  try {
    const transporter = createTransporter();

    // 验证邮件配置
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('邮件配置不完整，跳过邮件发送');
      return true; // 在开发环境中，即使没有配置邮件也返回成功
    }

    // 发送给管理员的邮件
    const adminEmailOptions = {
      from: `"${data.name}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `新的联系表单消息: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            新的联系表单消息
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">联系信息</h3>
            <p><strong>姓名:</strong> ${data.name}</p>
            <p><strong>邮箱:</strong> ${data.email}</p>
            ${data.phone ? `<p><strong>手机:</strong> ${data.phone}</p>` : ''}
            ${data.company ? `<p><strong>公司:</strong> ${data.company}</p>` : ''}
            <p><strong>主题:</strong> ${data.subject}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
            <h3 style="color: #007bff; margin-top: 0;">消息内容</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 5px; font-size: 12px; color: #6c757d;">
            <p>此邮件由网站联系表单自动发送</p>
            <p>发送时间: ${new Date().toLocaleString('zh-CN')}</p>
          </div>
        </div>
      `,
    };

    // 发送确认邮件给用户
    const userEmailOptions = {
      from: `"${process.env.SITE_NAME || 'Next.js Gemini'}" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: '感谢您的联系 - 我们已收到您的消息',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            感谢您的联系
          </h2>
          
          <p>亲爱的 ${data.name}，</p>
          
          <p>感谢您通过我们的网站联系我们。我们已经收到您的消息，并会在24小时内回复您。</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">您提交的信息</h3>
            <p><strong>主题:</strong> ${data.subject}</p>
            <p><strong>消息内容:</strong></p>
            <p style="background-color: #fff; padding: 15px; border: 1px solid #dee2e6; border-radius: 3px; white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <p>如果您有任何紧急问题，请直接回复此邮件或通过以下方式联系我们：</p>
          <ul>
            <li>邮箱: ${process.env.CONTACT_EMAIL || process.env.SMTP_USER}</li>
            ${data.phone ? `<li>我们也会通过您提供的手机号 ${data.phone} 联系您</li>` : ''}
          </ul>
          
          <p>再次感谢您的联系！</p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 5px; font-size: 12px; color: #6c757d;">
            <p>此邮件由系统自动发送，请勿直接回复。</p>
            <p>发送时间: ${new Date().toLocaleString('zh-CN')}</p>
          </div>
        </div>
      `,
    };

    // 发送邮件
    await Promise.all([
      transporter.sendMail(adminEmailOptions),
      transporter.sendMail(userEmailOptions),
    ]);

    return true;
  } catch (error) {
    console.error('邮件发送失败:', error);
    return false;
  }
}

// 验证邮件配置
export function validateEmailConfig(): boolean {
  const requiredEnvVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`缺少环境变量: ${envVar}`);
      return false;
    }
  }
  
  return true;
}
