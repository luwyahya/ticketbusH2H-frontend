import { defineStore } from 'pinia'
import type { Role, Permission, RoleFormData } from '@/types/role.types'

// Mock data
const mockRoles: Role[] = [
  {
    id: 1,
    name: 'Super Admin',
    permissions: [
      { id: 1, name: 'users.view', description: 'Lihat daftar user' },
      { id: 2, name: 'users.create', description: 'Tambah user baru' },
      { id: 3, name: 'users.edit', description: 'Edit data user' },
      { id: 4, name: 'users.delete', description: 'Hapus user' },
      { id: 5, name: 'roles.view', description: 'Lihat daftar role' },
      { id: 6, name: 'roles.manage', description: 'Kelola role dan permission' },
    ],
  },
  {
    id: 2,
    name: 'Admin',
    permissions: [
      { id: 1, name: 'users.view', description: 'Lihat daftar user' },
      { id: 2, name: 'users.create', description: 'Tambah user baru' },
      { id: 7, name: 'transactions.view', description: 'Lihat transaksi' },
    ],
  },
  {
    id: 3,
    name: 'Operator',
    permissions: [
      { id: 7, name: 'transactions.view', description: 'Lihat transaksi' },
      { id: 8, name: 'transactions.approve', description: 'Approve transaksi' },
    ],
  },
]

export const useRoleStore = defineStore('role', {
  state: () => ({
    roles: [...mockRoles] as Role[],
    loading: false,
  }),

  actions: {
    async fetchRoles() {
      this.loading = true
      setTimeout(() => {
        this.roles = [...mockRoles]
        this.loading = false
      }, 300)
    },

    async createRole(data: RoleFormData) {
      const newRole: Role = {
        id: this.roles.length + 1,
        name: data.name,
        permissions: [],
      }
      this.roles.push(newRole)
    },

    async updateRolePermissions(roleId: number, permissionIds: number[]) {
      const role = this.roles.find(r => r.id === roleId)
      if (role) {
        const allPermissions: Permission[] = [
          { id: 1, name: 'users.view', description: 'Lihat daftar user' },
          { id: 2, name: 'users.create', description: 'Tambah user baru' },
          { id: 3, name: 'users.edit', description: 'Edit data user' },
          { id: 4, name: 'users.delete', description: 'Hapus user' },
          { id: 5, name: 'roles.view', description: 'Lihat daftar role' },
          { id: 6, name: 'roles.manage', description: 'Kelola role dan permission' },
          { id: 7, name: 'transactions.view', description: 'Lihat transaksi' },
          { id: 8, name: 'transactions.approve', description: 'Approve transaksi' },
          { id: 9, name: 'reports.view', description: 'Lihat laporan' },
          { id: 10, name: 'reports.export', description: 'Export laporan' },
        ]
        role.permissions = allPermissions.filter(p => permissionIds.includes(p.id))
      }
    },
  },
})
