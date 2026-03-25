import { defineStore } from 'pinia'
import type { Topup } from '@/types/topup.types'
import { MitraTopupService } from '@/services/mitra/topup.service'

export const useMitraTopupStore = defineStore('mitra-topup', {
  state: (): {
    topups: Topup[]
    loading: boolean
    pagination: {
      current_page: number
      last_page: number
      per_page: number
      total: number
    }
  } => ({
    topups: [],
    loading: false,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    },
  }),

  actions: {
    async fetchTopups(page = 1, perPage = 10) {
      this.loading = true
      try {
        const res = await MitraTopupService.fetchTopups(page, perPage)
        console.log('Topup API Response:', res.data)
        
        // Backend returns paginated data in data field
        if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
          this.topups = res.data.data.data
          this.pagination = {
            current_page: res.data.data.current_page || 1,
            last_page: res.data.data.last_page || 1,
            per_page: res.data.data.per_page || 10,
            total: res.data.data.total || 0,
          }
          console.log('Pagination state:', this.pagination)
        } else if (res.data?.message?.data && Array.isArray(res.data.message.data)) {
          this.topups = res.data.message.data
          this.pagination = {
            current_page: res.data.message.current_page || 1,
            last_page: res.data.message.last_page || 1,
            per_page: res.data.message.per_page || 10,
            total: res.data.message.total || 0,
          }
        } else if (Array.isArray(res.data?.data)) {
          this.topups = res.data.data
        } else {
          this.topups = []
        }
      } catch (error) {
        console.error('Failed to fetch topups:', error)
        this.topups = []
      } finally {
        this.loading = false
      }
    },

    async createTopup(form: FormData) {
      this.loading = true
      try {
        const res = await MitraTopupService.createTopup(form)
        console.log('Create topup response:', res)
        return res
      } catch (error) {
        console.error('Failed to create topup:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
