'use client';

import { useState } from 'react';
import ContactForm from '@/components/ContactForm';
import type { ContactFormResponse } from '@/lib/validations/contact';

export default function ContactPage() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSuccess = (data: ContactFormResponse) => {
    setShowSuccessMessage(true);
    // 3秒后隐藏成功消息
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  const handleError = (error: string) => {
    console.error('联系表单错误:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            联系我们
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            我们很乐意听到您的声音。无论您有任何问题、建议或合作意向，请随时与我们联系。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 联系信息 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                联系信息
              </h2>
              
              <div className="space-y-6">
                {/* 邮箱 */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">邮箱</h3>
                    <p className="text-gray-600 dark:text-gray-300">contact@example.com</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      我们会在24小时内回复您的邮件
                    </p>
                  </div>
                </div>

                {/* 电话 */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">电话</h3>
                    <p className="text-gray-600 dark:text-gray-300">+86 138-0000-0000</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      工作时间：周一至周五 9:00-18:00
                    </p>
                  </div>
                </div>

                {/* 地址 */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">地址</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      北京市朝阳区<br />
                      科技园区创新大厦 1001室
                    </p>
                  </div>
                </div>

                {/* 社交媒体 */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">关注我们</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-800 text-white rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599-.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 联系表单 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                发送消息
              </h2>
              
              {showSuccessMessage && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                        消息发送成功！
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        感谢您的联系，我们会在24小时内回复您。
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <ContactForm 
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>
          </div>
        </div>

        {/* 常见问题 */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              常见问题
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              以下是一些常见问题的解答，或许能帮助您快速找到答案。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                如何快速获得技术支持？
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                您可以通过联系表单详细描述您遇到的问题，我们的技术团队会在24小时内回复您。对于紧急问题，请直接拨打我们的技术支持热线。
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                是否提供定制开发服务？
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                是的，我们提供专业的定制开发服务。请通过联系表单告诉我们您的具体需求，我们会安排专业的项目经理与您沟通详细方案。
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                如何获取产品演示？
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                我们很乐意为您演示我们的产品功能。请在联系表单中选择"产品演示"作为主题，我们会安排专门的时间为您进行在线演示。
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                合作伙伴申请流程？
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                如果您有意成为我们的合作伙伴，请通过联系表单提交您的公司信息和合作意向，我们的商务团队会与您联系讨论合作细节。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
