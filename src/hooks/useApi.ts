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
 * 用于用户认证的自定义Hook
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 检查登录状态
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/login', {
        credentials: 'include'
      })
      const result = await response.json()

      if (result.success) {
        setIsAuthenticated(true)
        setUser(result.data?.user || null)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // 登录
  const login = useCallback(async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      })

      const result = await response.json()

      if (result.success) {
        setIsAuthenticated(true)
        setUser(result.data?.user || null)
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: '登录失败' }
    }
  }, [])

  // 注销
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('注销失败:', error)
    } finally {
      setIsAuthenticated(false)
      setUser(null)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

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