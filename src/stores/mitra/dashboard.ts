import { defineStore } from 'pinia'
import { api } from '@/services/api.service'

export const useDashboardMitraStore = defineStore('dashboardMitra', {
  state: () => ({
    dashboard: {
      balance: 0,
      totalTransactions: 0,
      totalFee: 0,
      chart: [],
    },
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchDashboard() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/dashboard/mitra')
        const data = response.data.data

        this.dashboard = {
          balance: data.balance || 0,
          totalTransactions: data.total_transactions || 0,
          totalFee: data.total_fee_earned || 0,
          chart: data.chart_transactions || [],
        }
      } catch (error: any) {
        console.error('Failed to fetch dashboard mitra:', error)
        this.error = error.message || 'Gagal memuat dashboard'
        this.dashboard = {
          balance: 0,
          totalTransactions: 0,
          totalFee: 0,
          chart: [],
        }
      } finally {
        this.loading = false
      }
    },
  },
})
