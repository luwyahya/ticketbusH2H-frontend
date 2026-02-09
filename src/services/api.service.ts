import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiError } from '@/types/api.types'

class ApiService {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://127.0.0.1:8000/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor: Add Bearer token
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor: Handle errors
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error: AxiosError<ApiError>) => {
        // Handle 401 Unauthorized - hanya redirect jika BUKAN dari halaman login
        if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }

        // Handle other errors
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An error occurred',
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
