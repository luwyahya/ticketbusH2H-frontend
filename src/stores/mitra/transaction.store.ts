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
        this.schedules = res.data.data
      } finally {
        this.loading = false
      }
    },

    // 🪑 SEAT MAP
    async getSeatMap(provider_code: string) {
      const res = await transactionService.seatMap(provider_code)
      this.seatMap = res.data.data.seats
    },

    // 📦 BOOK
    async book(payload: any) {
      const res = await transactionService.book(payload)
      this.lastBooking = res.data.data
      return res.data.data
    },

    // 💳 PAY
    async pay(trx_code: string) {
      const res = await transactionService.pay(trx_code)
      return res.data.data   // { trx_code, status, balance_before, balance_after }
    },

    // 🎟 ISSUE
    async issue(trx_code: string) {
      const res = await transactionService.issue(trx_code)
      return res.data.data   // { trx_code, status, fee_earned, balance_after }
    },

    // ❌ CANCEL
    async cancel(trx_code: string, reason?: string) {
      const res = await transactionService.cancel(trx_code, reason)
      return res.data.data   // { trx_code, status, refund_amount }
    },

    // 📄 DETAIL
    async detail(trx_code: string) {
      const res = await transactionService.detail(trx_code)
      this.transactionDetail = res.data.data
      return res.data.data
    }

  }
})
