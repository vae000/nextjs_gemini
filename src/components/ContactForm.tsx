'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormData, type ContactFormResponse } from '@/lib/validations/contact';

interface ContactFormProps {
  className?: string;
  onSuccess?: (data: ContactFormResponse) => void;
  onError?: (error: string) => void;
}

export default function ContactForm({ className = '', onSuccess, onError }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: ContactFormResponse = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || '消息发送成功！我们会尽快回复您。');
        reset();
        onSuccess?.(result);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || '发送失败，请稍后重试。');
        onError?.(result.message || '发送失败');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage('网络错误，请检查网络连接后重试。');
      onError?.('网络错误');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 姓名和邮箱 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              姓名 <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              placeholder="请输入您的姓名"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              邮箱 <span className="text-red-500">*</span>
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              placeholder="请输入您的邮箱"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* 手机号和公司 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              手机号
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              placeholder="请输入您的手机号（可选）"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              公司
            </label>
            <input
              {...register('company')}
              type="text"
              id="company"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              placeholder="请输入您的公司名称（可选）"
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.company.message}</p>
            )}
          </div>
        </div>

        {/* 主题 */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            主题 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('subject')}
            type="text"
            id="subject"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
            placeholder="请输入消息主题"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject.message}</p>
          )}
        </div>

        {/* 消息内容 */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            消息内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors resize-vertical"
            placeholder="请详细描述您的问题或需求..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
          )}
        </div>

        {/* 提交状态消息 */}
        {submitStatus !== 'idle' && (
          <div
            className={`p-4 rounded-lg ${
              submitStatus === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {submitStatus === 'success' ? (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{submitMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* 提交按钮 */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                发送中...
              </div>
            ) : (
              '发送消息'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
