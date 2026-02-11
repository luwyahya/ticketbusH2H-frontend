import { defineStore } from 'pinia'
import type { ReportTransaction, ReportFilter } from '@/types/report.types'

const mockTransactions: ReportTransaction[] = [
  { id: 1, tanggal: '2024-01-15', mitra: 'PT Mitra Sejahtera', jenis_transaksi: 'Pembelian Tiket', jumlah: 500000, fee: 5000, status: 'success' },
  { id: 2, tanggal: '2024-01-16', mitra: 'CV Transportasi Jaya', jenis_transaksi: 'Pembelian Tiket', jumlah: 750000, fee: 7500, status: 'success' },
  { id: 3, tanggal: '2024-01-17', mitra: 'PT Mitra Sejahtera', jenis_transaksi: 'Refund', jumlah: 200000, fee: 2000, status: 'success' },
  { id: 4, tanggal: '2024-01-18', mitra: 'UD Berkah Transport', jenis_transaksi: 'Pembelian Tiket', jumlah: 1000000, fee: 10000, status: 'success' },
  { id: 5, tanggal: '2024-01-19', mitra: 'CV Transportasi Jaya', jenis_transaksi: 'Pembelian Tiket', jumlah: 300000, fee: 3000, status: 'pending' },
]

export const useReportStore = defineStore('report', {
  state: () => ({
    transactions: [...mockTransactions] as ReportTransaction[],
    filteredTransactions: [...mockTransactions] as ReportTransaction[],
    loading: false,
  }),

  actions: {
    async fetchReports(filter: ReportFilter) {
      this.loading = true
      setTimeout(() => {
        this.filteredTransactions = this.transactions.filter(t => {
          const matchDate = t.tanggal >= filter.start_date && t.tanggal <= filter.end_date
          const matchMitra = !filter.mitra_id || t.mitra.includes('Mitra')
          return matchDate && matchMitra
        })
        this.loading = false
      }, 300)
    },

    exportPDF() {
      alert('Export PDF - Feature coming soon')
    },

    exportExcel() {
      alert('Export Excel - Feature coming soon')
    },
  },
})
