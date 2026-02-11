import { defineStore } from 'pinia'
// import { userService } from '@/services/user.service'
import type { User, UserFormData } from '@/types/user.types'

// Mock data
const mockUsers: User[] = [
  {
    id: 1,
    nama: 'Admin System',
    email: 'admin@system.com',
    role: 'admin',
    status: 'aktif',
    created_at: '2023-01-15'
  },
  {
    id: 2,
    nama: 'John Manager',
    email: 'john@shuttleexpress.com',
    role: 'mitra',
    instansi: 'PT Shuttle Express',
    status: 'aktif',
    created_at: '2023-03-20'
  },
  {
    id: 3,
    nama: 'Jane Operator',
    email: 'jane@transjaya.com',
    role: 'mitra',
    instansi: 'CV Trans Jaya',
    status: 'aktif',
    created_at: '2023-05-10'
  },
  {
    id: 4,
    nama: 'Bob Staff',
    email: 'bob@nusantarashuttle.com',
    role: 'mitra',
    instansi: 'PT Nusantara Shuttle',
    status: 'nonaktif',
    created_at: '2023-07-25'
  },
  {
    id: 5,
    nama: 'Alice Admin',
    email: 'alice@system.com',
    role: 'admin',
    status: 'aktif',
    created_at: '2023-09-12'
  }
]

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        // const response = await userService.getUsers()
        this.users = mockUsers
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch users'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createUser(userData: UserFormData) {
      this.loading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        // const response = await userService.createUser(userData)
        const newUser: User = {
          id: Date.now(),
          ...userData,
          status: 'aktif',
          created_at: new Date().toISOString().split('T')[0]
        }
        this.users.push(newUser)
      } catch (error: any) {
        this.error = error.message || 'Failed to create user'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUserStatus(userId: number, status: string) {
      this.loading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        const user = this.users.find(u => u.id === userId)
        if (user) {
          user.status = status
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to update user status'
        throw error
      } finally {
        this.loading = false
      }
    }
  },
})