import { api } from './api.service'
import type { Role, RoleFormData, ApiResponse, Permission } from '@/types/role.types'

class RoleService {
  async getRoles(): Promise<ApiResponse<Role[]>> {
    const response = await api.get('/roles')
    return response.data
  }

  async getPermissions(): Promise<ApiResponse<Permission[]>> {
    const response = await api.get('/permissions')
    return response.data
  }

  async createRole(data: RoleFormData): Promise<ApiResponse<Role>> {
    const response = await api.post('/roles', data)
    return response.data
  }

  async updateRolePermissions(roleId: number, permissions: number[]): Promise<ApiResponse<Role>> {
    const payload = { permissions }
    const response = await api.post(`/roles/${roleId}/permissions`, payload)
    return response.data
  }
}

export const roleService = new RoleService()
