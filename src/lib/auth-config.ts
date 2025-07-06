import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { UserService } from '@/lib/db-operations'
import { Role } from '@prisma/client'
import bcrypt from 'bcrypt'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // 邮箱/密码登录
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('邮箱和密码不能为空')
        }

        try {
          // 查找用户
          const user = await UserService.findUserByEmail(credentials.email)
          
          if (!user) {
            throw new Error('用户不存在')
          }

          // 验证密码
          if (!user.password) {
            throw new Error('该账户未设置密码，请使用其他登录方式')
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          
          if (!isPasswordValid) {
            throw new Error('密码错误')
          }

          // 返回用户信息
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar,
            role: user.role,
          }
        } catch (error) {
          console.error('认证错误:', error)
          throw error
        }
      }
    }),

    // Google OAuth (可选)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),

    // GitHub OAuth (可选)
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    ] : []),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // 首次登录时，将用户信息添加到 token
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      
      return token
    },

    async session({ session, token }) {
      // 将 token 中的信息添加到 session
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }

      return session
    },

    async signIn({ user, account, profile }) {
      // OAuth 登录时的处理
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          // 检查用户是否已存在
          const existingUser = await UserService.findUserByEmail(user.email!)
          
          if (!existingUser) {
            // 创建新用户（OAuth 用户不需要密码）
            await UserService.createUser({
              email: user.email!,
              name: user.name || undefined,
              password: '', // OAuth 用户不需要密码
            })
          }
          
          return true
        } catch (error) {
          console.error('OAuth 登录错误:', error)
          return false
        }
      }
      
      return true
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('用户登录:', { user: user.email, provider: account?.provider })
    },
    async signOut({ session, token }) {
      console.log('用户登出:', { user: session?.user?.email })
    },
  },

  debug: process.env.NODE_ENV === 'development',
}
