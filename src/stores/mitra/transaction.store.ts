import { defineStore } from 'pinia'
import transactionService from '@/services/mitra/transaction.service'

export const useTransactionStore = defineStore('transactionMitra', {
  state: () => ({
    schedules: [] as any[],
    seatMap: [] as any[],
    transactionDetail: null as any,
    lastBooking: null as any,
    loading: false,
  }),

  actions: {

    // 🔎 SEARCH
    async search(payload: any) {
      try {
        this.loading = true
        const res = await transactionService.search(payload)
        console.log('API Response:', res.data)
        // Backend returns data in message field
        this.schedules = res.data.message || res.data.data || []
        console.log('Schedules:', this.schedules)
      } finally {
        this.loading = false
      }
    },

    // 🪑 SEAT MAP
    async getSeatMap(provider_code: string) {
      const res = await transactionService.seatMap(provider_code)
      console.log('Seat map response:', res.data)
      // Backend returns seats in message.data.seats
      const data = res.data.message || res.data.data
      this.seatMap = data?.seats || []
      console.log('Seat map:', this.seatMap)
    },

    // 📦 BOOK
    async book(payload: any) {
      const res = await transactionService.book(payload)
      const data = res.data.message || res.data.data
      this.lastBooking = data
      return data
    },

    // 💳 PAY
    async pay(trx_code: string) {
      const res = await transactionService.pay(trx_code)
      return res.data.message || res.data.data
    },

    // 🎟 ISSUE
    async issue(trx_code: string) {
      const res = await transactionService.issue(trx_code)
      return res.data.message || res.data.data
    },

    // ❌ CANCEL
    async cancel(trx_code: string, reason?: string) {
      const res = await transactionService.cancel(trx_code, reason)
      return res.data.message || res.data.data
    },

    // 📄 DETAIL
    async detail(trx_code: string) {
      const res = await transactionService.detail(trx_code)
      this.transactionDetail = res.data.message || res.data.data
      return this.transactionDetail
    }

  }
})
