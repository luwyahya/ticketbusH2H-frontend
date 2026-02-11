import { api } from './api.service'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

interface Mitra {
  id: number
  code: string
  name: string
  email: string
  phone: string
  status: string
  balance: number
  created_at: string | null
}

class MitraService {
  async getMitraList() {
    const response = await api.get('/v1/mitra')
    // Response structure: { data: { success, message, data: [...] } }
    return response.data
  }

  async getMitraDetail(id: number) {
    const response = await api.get(`/v1/mitra/${id}`)
    return response.data
  }
}

export const mitraService = new MitraService()
