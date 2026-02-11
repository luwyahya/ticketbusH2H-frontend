import { api } from './api.service'
import type { Role, RoleFormData, ApiResponse } from '@/types/role.types'

class RoleService {
  async getRoles(): Promise<ApiResponse<Role[]>> {
    const response = await api.get('/v1/roles')
    return response.data
  }

  async createRole(data: RoleFormData): Promise<ApiResponse<Role>> {
    const response = await api.post('/v1/roles', data)
    return response.data
  }

  async updateRolePermissions(roleId: number, permissions: number[]): Promise<ApiResponse<Role>> {
    const response = await api.put(`/v1/roles/${roleId}/permissions`, { permissions })
    return response.data
  }
}

export const roleService = new RoleService()
