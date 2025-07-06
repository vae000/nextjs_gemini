import { useState, useEffect, useCallback } from 'react'

// 通用API响应类型
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Hook的返回类型
interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Hook的配置选项
interface UseApiOptions {
  immediate?: boolean // 是否立即执行
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

/**
 * 用于GET请求的自定义Hook
 * @param url API路径
 * @param options 配置选项
 * @returns API调用结果
 */
export function useApi<T>(
  url: string,
  options: UseApiOptions = {}
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { immediate = true, onSuccess, onError } = options

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        credentials: 'include' // 包含cookies
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<T> = await response.json()

      if (result.success) {
        setData(result.data || null)
        onSuccess?.(result.data)
      } else {
        const errorMessage = result.error || '请求失败'
        setError(errorMessage)
        onError?.(errorMessage)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '网络错误'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [url, onSuccess, onError])

  useEffect(() => {
    if (immediate) {
      fetchData()
    }
  }, [fetchData, immediate])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}

/**
 * 用于POST/PUT/DELETE等带请求体的请求的自定义Hook
 * @param url API路径
 * @param method HTTP方法
 * @returns API调用函数和状态
 */
export function useApiMutation<T, P = any>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST'
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(async (payload?: P): Promise<T | null> => {
    setLoading(true)
    setError(null)

    try {
      const requestOptions: RequestInit = {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      }

      if (payload && method !== 'DELETE') {
        requestOptions.body = JSON.stringify(payload)
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse<T> = await response.json()

      if (result.success) {
        setData(result.data || null)
        return result.data || null
      } else {
        const errorMessage = result.error || '请求失败'
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '网络错误'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, method])

  return {
    data,
    loading,
    error,
    mutate
  }
}

/**
 * 用于用户认证的自定义Hook (兼容 NextAuth.js)
 * 这个 hook 现在是 NextAuth.js useSession 的包装器，保持向后兼容
 */
export function useAuth() {
  // 注意：这个 hook 现在已被弃用，建议直接使用 NextAuth.js 的 useSession
  // 为了向后兼容，我们保留这个接口但建议迁移到 useSession
  console.warn('useAuth hook 已被弃用，请使用 NextAuth.js 的 useSession hook')

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 模拟原有的接口，但实际上应该使用 NextAuth.js
  useEffect(() => {
    // 这里可以添加迁移提示或者临时的兼容逻辑
    setLoading(false)
    setIsAuthenticated(false)
    setUser(null)
  }, [])

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    console.warn('请使用 NextAuth.js 的 signIn 方法替代 useAuth().login')
    return { success: false, error: '请使用新的认证系统' }
  }, [])

  const logout = useCallback(async () => {
    console.warn('请使用 NextAuth.js 的 signOut 方法替代 useAuth().logout')
  }, [])

  const checkAuth = useCallback(async () => {
    console.warn('请使用 NextAuth.js 的 useSession hook 替代 useAuth().checkAuth')
  }, [])

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth
  }
}

/**
 * 用于文件上传的自定义Hook
 */
export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(async (file: File, description?: string) => {
    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (description) {
        formData.append('description', description)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setProgress(100)
        return result.data
      } else {
        throw new Error(result.error || '上传失败')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '上传失败'
      setError(errorMessage)
      throw err
    } finally {
      setUploading(false)
    }
  }, [])

  return {
    uploading,
    progress,
    error,
    upload
  }
}

/**
 * 用于分页数据的自定义Hook
 */
export function usePagination<T>(
  url: string,
  initialPage: number = 1,
  initialLimit: number = 10
) {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [search, setSearch] = useState('')

  const queryUrl = `${url}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`

  const {
    data: response,
    loading,
    error,
    refetch
  } = useApi<{
    data: T[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }>(queryUrl)

  const nextPage = useCallback(() => {
    if (response?.pagination.hasNext) {
      setPage(prev => prev + 1)
    }
  }, [response?.pagination.hasNext])

  const prevPage = useCallback(() => {
    if (response?.pagination.hasPrev) {
      setPage(prev => prev - 1)
    }
  }, [response?.pagination.hasPrev])

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit)
    setPage(1) // 重置到第一页
  }, [])

  const updateSearch = useCallback((newSearch: string) => {
    setSearch(newSearch)
    setPage(1) // 重置到第一页
  }, [])

  return {
    data: response?.data || [],
    pagination: response?.pagination || null,
    loading,
    error,
    page,
    limit,
    search,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    updateSearch,
    refetch
  }
} 