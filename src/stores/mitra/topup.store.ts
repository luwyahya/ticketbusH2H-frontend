import { defineStore } from 'pinia'
import type { Topup } from '@/types/topup.types'
import { MitraTopupService } from '@/services/mitra/topup.service'

export const useMitraTopupStore = defineStore('mitra-topup', {
  state: (): {
    topups: Topup[]
    loading: boolean
  } => ({
    topups: [],
    loading: false,
  }),

  actions: {
    async fetchTopups() {
      this.loading = true
      try {
        const res = await MitraTopupService.fetchTopups()
        console.log('Topup response:', res)
        console.log('Topup data:', res.data)
        console.log('Message:', res.data.message)
        console.log('Message.data:', res.data.message?.data)
        
        // Backend returns paginated data in message.data
        if (res.data?.message?.data && Array.isArray(res.data.message.data)) {
          this.topups = res.data.message.data
        } else if (Array.isArray(res.data?.message)) {
          this.topups = res.data.message
        } else if (Array.isArray(res.data?.data)) {
          this.topups = res.data.data
        } else {
          this.topups = []
        }
        
        console.log('Parsed topups:', this.topups)
        console.log('Topups length:', this.topups.length)
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
