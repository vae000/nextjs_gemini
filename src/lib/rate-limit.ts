import { NextRequest } from 'next/server';

// 内存存储的速率限制器
class MemoryRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 5) {
    this.windowMs = windowMs; // 默认15分钟
    this.maxRequests = maxRequests; // 默认最多5次请求
  }

  // 检查是否超过速率限制
  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // 获取该标识符的请求记录
    let requests = this.requests.get(identifier) || [];

    // 清理过期的请求记录
    requests = requests.filter(timestamp => timestamp > windowStart);

    // 检查是否超过限制
    if (requests.length >= this.maxRequests) {
      return true;
    }

    // 记录新的请求
    requests.push(now);
    this.requests.set(identifier, requests);

    return false;
  }

  // 获取剩余请求次数
  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let requests = this.requests.get(identifier) || [];
    requests = requests.filter(timestamp => timestamp > windowStart);

    return Math.max(0, this.maxRequests - requests.length);
  }

  // 获取重置时间
  getResetTime(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    if (requests.length === 0) return 0;

    const oldestRequest = Math.min(...requests);
    return oldestRequest + this.windowMs;
  }

  // 清理过期数据（定期调用以释放内存）
  cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(timestamp => timestamp > windowStart);
      
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}

// 创建不同类型的速率限制器
export const contactFormLimiter = new MemoryRateLimiter(15 * 60 * 1000, 3); // 15分钟内最多3次
export const generalApiLimiter = new MemoryRateLimiter(60 * 1000, 10); // 1分钟内最多10次

// 获取客户端标识符
export function getClientIdentifier(request: NextRequest): string {
  // 优先使用真实IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  let ip = '';

  if (forwarded) {
    ip = forwarded.split(',')[0].trim();
  } else if (realIp) {
    ip = realIp;
  } else {
    // NextRequest 没有 ip 属性，设为 unknown
    ip = 'unknown';
  }

  // 如果无法获取IP，使用User-Agent作为备选标识符
  if (!ip || ip === 'unknown') {
    const userAgent = request.headers.get('user-agent') || 'unknown';
    return `ua:${userAgent}`;
  }

  return `ip:${ip}`;
}

// 速率限制中间件
export function rateLimit(limiter: MemoryRateLimiter) {
  return (request: NextRequest) => {
    const identifier = getClientIdentifier(request);
    const isLimited = limiter.isRateLimited(identifier);
    
    if (isLimited) {
      const resetTime = limiter.getResetTime(identifier);
      const resetDate = new Date(resetTime);
      
      return {
        success: false,
        error: '请求过于频繁，请稍后再试',
        resetTime: resetDate.toISOString(),
        remaining: 0,
      };
    }

    return {
      success: true,
      remaining: limiter.getRemainingRequests(identifier),
    };
  };
}

// 定期清理过期数据
if (typeof window === 'undefined') {
  // 只在服务端运行
  setInterval(() => {
    contactFormLimiter.cleanup();
    generalApiLimiter.cleanup();
  }, 5 * 60 * 1000); // 每5分钟清理一次
}
