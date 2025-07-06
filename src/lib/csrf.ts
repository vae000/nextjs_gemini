import { NextRequest } from 'next/server';
import crypto from 'crypto';

// CSRF Token 管理
class CSRFTokenManager {
  private static instance: CSRFTokenManager;
  private tokens: Map<string, { token: string; expires: number }> = new Map();
  private readonly tokenExpiry = 60 * 60 * 1000; // 1小时

  static getInstance(): CSRFTokenManager {
    if (!CSRFTokenManager.instance) {
      CSRFTokenManager.instance = new CSRFTokenManager();
    }
    return CSRFTokenManager.instance;
  }

  // 生成CSRF token
  generateToken(sessionId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + this.tokenExpiry;
    
    this.tokens.set(sessionId, { token, expires });
    
    // 清理过期token
    this.cleanup();
    
    return token;
  }

  // 验证CSRF token
  validateToken(sessionId: string, token: string): boolean {
    const stored = this.tokens.get(sessionId);
    
    if (!stored) {
      return false;
    }

    if (Date.now() > stored.expires) {
      this.tokens.delete(sessionId);
      return false;
    }

    return stored.token === token;
  }

  // 清理过期token
  private cleanup(): void {
    const now = Date.now();
    for (const [sessionId, data] of this.tokens.entries()) {
      if (now > data.expires) {
        this.tokens.delete(sessionId);
      }
    }
  }
}

// 获取会话ID（基于IP和User-Agent）
function getSessionId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const userAgent = request.headers.get('user-agent') || '';

  let ip = '';
  if (forwarded) {
    ip = forwarded.split(',')[0].trim();
  } else if (realIp) {
    ip = realIp;
  } else {
    // NextRequest 没有 ip 属性，使用 headers 作为备选
    ip = 'unknown';
  }

  // 创建会话ID的哈希
  const sessionData = `${ip}:${userAgent}`;
  return crypto.createHash('sha256').update(sessionData).digest('hex');
}

// CSRF保护中间件
export function csrfProtection() {
  const tokenManager = CSRFTokenManager.getInstance();

  return {
    // 生成token
    generateToken: (request: NextRequest): string => {
      const sessionId = getSessionId(request);
      return tokenManager.generateToken(sessionId);
    },

    // 验证token
    validateToken: (request: NextRequest, token: string): boolean => {
      const sessionId = getSessionId(request);
      return tokenManager.validateToken(sessionId, token);
    },

    // 检查请求来源
    checkOrigin: (request: NextRequest): boolean => {
      const origin = request.headers.get('origin');
      const referer = request.headers.get('referer');
      const host = request.headers.get('host');

      // 允许的来源
      const allowedOrigins = [
        `https://${host}`,
        `http://${host}`,
        process.env.NEXTAUTH_URL,
        process.env.NEXT_PUBLIC_APP_URL,
      ].filter(Boolean);

      // 检查Origin头
      if (origin) {
        return allowedOrigins.includes(origin);
      }

      // 检查Referer头
      if (referer) {
        try {
          const refererUrl = new URL(referer);
          return allowedOrigins.some(allowed => {
            if (!allowed) return false;
            const allowedUrl = new URL(allowed);
            return refererUrl.origin === allowedUrl.origin;
          });
        } catch {
          return false;
        }
      }

      // 如果都没有，在开发环境允许，生产环境拒绝
      return process.env.NODE_ENV === 'development';
    },
  };
}

// 简化的CSRF检查（用于表单提交）
export function simpleCSRFCheck(request: NextRequest): boolean {
  const csrf = csrfProtection();
  
  // 检查请求来源
  if (!csrf.checkOrigin(request)) {
    return false;
  }

  // 对于POST请求，检查Content-Type
  if (request.method === 'POST') {
    const contentType = request.headers.get('content-type') || '';
    
    // 只允许JSON和表单数据
    const allowedTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data',
    ];

    const isAllowedType = allowedTypes.some(type => 
      contentType.toLowerCase().includes(type)
    );

    if (!isAllowedType) {
      return false;
    }
  }

  return true;
}

// 定期清理过期数据
if (typeof window === 'undefined') {
  setInterval(() => {
    const tokenManager = CSRFTokenManager.getInstance();
    // 触发清理（通过生成一个临时token）
    tokenManager.generateToken('cleanup');
  }, 10 * 60 * 1000); // 每10分钟清理一次
}
