export interface Permission {
  id: number
  name: string
  description?: string
}

export interface Role {
  id: number
  name: string
  permissions: Permission[]
  created_at?: string
}

export interface RoleFormData {
  name: string
  permissions: number[]
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
