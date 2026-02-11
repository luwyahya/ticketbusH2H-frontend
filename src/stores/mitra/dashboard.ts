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
  }),

  actions: {
    async fetchDashboard() {
      this.loading = true
      try {
        const response = await api.get('/dashboard/mitra')

        const data = response.data.data

        // 🔁 mapping backend → frontend
        this.dashboard = {
          balance: data.balance,
          totalTransactions: data.total_transactions,
          totalFee: data.total_fee_earned,
          chart: data.chart_transactions,
        }
      } catch (error) {
        console.error('Failed to fetch dashboard mitra:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
