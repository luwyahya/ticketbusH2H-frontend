import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import type { ApiError } from '@/types/api.types'

class ApiService {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://127.0.0.1:8000/api/v1',
      headers: {
        Accept: 'application/json',
        // ❌ JANGAN set Content-Type di sini
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token')

        if (token) {
          config.headers = config.headers || {}
          config.headers.Authorization = `Bearer ${token}`
        }

        /**
         * 🔥 PENTING
         * Kalau FormData → biarkan axios set multipart
         * Kalau bukan → set JSON
         */
        if (!(config.data instanceof FormData)) {
          config.headers['Content-Type'] = 'application/json'
        }

        return config
      },
      (error: AxiosError) => Promise.reject(error)
    )

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<ApiError>) => {
        if (
          error.response?.status === 401 &&
          !window.location.pathname.includes('/login')
        ) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }

        const apiError: ApiError = {
          message:
            error.response?.data?.message ||
            error.message ||
            'An error occurred',
          errors: error.response?.data?.errors,
        }

        return Promise.reject(apiError)
      }
    )
  }

  public getInstance(): AxiosInstance {
    return this.axiosInstance
  }
}

export const apiService = new ApiService()
export const api = apiService.getInstance()
