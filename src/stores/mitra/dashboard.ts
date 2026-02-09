import { defineStore } from 'pinia'

export const useDashboardMitraStore = defineStore('dashboardMitra', {
  state: () => ({
    dashboard: {
      balance: 1200000,
      totalTransactions: 128,
      totalFee: 1250000,
    },
    loading: false,
  }),

  actions: {
    async fetchDashboard() {
      this.loading = true

      // simulasi API (mock)
      await new Promise(resolve => setTimeout(resolve, 800))

      this.dashboard = {
        balance: 1200000,
        totalTransactions: 128,
        totalFee: 1250000,
      }

      this.loading = false
    },
  },
})
