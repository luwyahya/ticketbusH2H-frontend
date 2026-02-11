import { api } from './api.service'
import { mockAdminService, mockMitraService } from './mock-admin.service'
import type { AdminDashboardData, MitraDashboardData, MitraListItem } from '@/types/admin.types'
import type { ApiResponse } from '@/types/api.types'

const USE_MOCK = import.meta.env.DEV

class AdminService {
  async getDashboardData(): Promise<ApiResponse<AdminDashboardData>> {
    if (USE_MOCK) {
      return mockAdminService.getDashboardData()
    }
    const response = await api.get<ApiResponse<AdminDashboardData>>('/v1/dashboard/admin')
    return response.data
  }
}

class MitraService {
  async getMitraList(): Promise<ApiResponse<MitraListItem[]>> {
    if (USE_MOCK) {
      return mockMitraService.getMitraList()
    }
    const response = await api.get<ApiResponse<MitraListItem[]>>('/v1/dashboard/partner')
    return response.data
  }

  async getMitraDetail(id: number): Promise<ApiResponse<MitraDashboardData>> {
    if (USE_MOCK) {
      return mockMitraService.getMitraDetail(id)
    }
    const response = await api.get<ApiResponse<MitraDashboardData>>(`/v1/dashboard/partner/${id}`)
    return response.data
  }
}

export const adminService = new AdminService()
export const mitraService = new MitraService()
