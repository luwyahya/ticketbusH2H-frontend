import { api } from './api.service'
import type { AxiosResponse } from 'axios'

class HttpService {
  async get<T>(url: string, params?: any): Promise<T> {
    const response: AxiosResponse<T> = await api.get(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await api.post(url, data)
    return response.data
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await api.put(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await api.delete(url)
    return response.data
  }
}

export const httpService = new HttpService()
