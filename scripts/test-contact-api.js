#!/usr/bin/env node

/**
 * 联系表单 API 测试脚本
 * 使用方法：node scripts/test-contact-api.js
 */

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// 测试数据
const testData = {
  valid: {
    name: '张三',
    email: 'test@example.com',
    phone: '13800138000',
    company: '测试公司',
    subject: '这是一个测试消息',
    message: '这是测试消息的详细内容，用于验证联系表单功能是否正常工作。'
  },
  invalid: {
    name: 'A', // 太短
    email: 'invalid-email', // 无效邮箱
    subject: '短', // 太短
    message: '短消息' // 太短
  }
};

// 发送测试请求
async function testContactAPI(data, expectSuccess = true) {
  try {
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': baseUrl,
        'Referer': baseUrl,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    console.log(`\n📊 测试结果 (期望${expectSuccess ? '成功' : '失败'}):`);
    console.log(`状态码: ${response.status}`);
    console.log(`响应:`, JSON.stringify(result, null, 2));
    
    if (expectSuccess && result.success) {
      console.log('✅ 测试通过');
    } else if (!expectSuccess && !result.success) {
      console.log('✅ 测试通过（预期失败）');
    } else {
      console.log('❌ 测试失败');
    }
    
    return result;
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
    return null;
  }
}

// 测试速率限制
async function testRateLimit() {
  console.log('\n🔄 测试速率限制...');
  
  for (let i = 1; i <= 5; i++) {
    console.log(`\n第 ${i} 次请求:`);
    const result = await testContactAPI({
      ...testData.valid,
      subject: `速率限制测试 ${i}`,
    }, i <= 3); // 前3次应该成功，后面的应该被限制
    
    if (i > 3 && result && !result.success && result.message.includes('频繁')) {
      console.log('✅ 速率限制正常工作');
      break;
    }
    
    // 稍微延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// 主测试函数
async function runTests() {
  console.log('🚀 开始测试联系表单 API...');
  console.log(`测试地址: ${baseUrl}/api/contact`);
  
  // 测试有效数据
  console.log('\n1️⃣ 测试有效数据提交:');
  await testContactAPI(testData.valid, true);
  
  // 测试无效数据
  console.log('\n2️⃣ 测试无效数据提交:');
  await testContactAPI(testData.invalid, false);
  
  // 测试空数据
  console.log('\n3️⃣ 测试空数据提交:');
  await testContactAPI({}, false);
  
  // 测试速率限制
  await testRateLimit();
  
  console.log('\n✨ 测试完成！');
  console.log('\n💡 提示:');
  console.log('- 如果邮件发送失败，请检查环境变量配置');
  console.log('- 速率限制会在15分钟后重置');
  console.log('- 查看服务器日志获取更多详细信息');
}

// 检查服务器是否运行
async function checkServer() {
  try {
    const response = await fetch(`${baseUrl}/api/hello`);
    if (response.ok) {
      return true;
    }
  } catch (error) {
    // 服务器未运行
  }
  return false;
}

// 启动测试
async function main() {
  console.log('🔍 检查服务器状态...');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.error('❌ 服务器未运行或无法访问');
    console.log('请先启动开发服务器：npm run dev');
    process.exit(1);
  }
  
  console.log('✅ 服务器运行正常');
  await runTests();
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testContactAPI, runTests };
