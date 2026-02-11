import { defineStore } from 'pinia'
// import { adminService } from '@/services/admin.service'
import type { AdminDashboardData } from '@/types/admin.types'

// Mock data
const mockDashboardData: AdminDashboardData = {
  total_transaksi_hari_ini: 2500000,
  total_transaksi_bulan_berjalan: 75000000,
  total_deposit_masuk: 150000000,
  total_fee_mitra: 5250000,
  grafik_transaksi: [
    { tanggal: '2024-01-01', jumlah: 1200000 },
    { tanggal: '2024-01-02', jumlah: 1800000 },
    { tanggal: '2024-01-03', jumlah: 2100000 },
    { tanggal: '2024-01-04', jumlah: 1500000 },
    { tanggal: '2024-01-05', jumlah: 2800000 },
    { tanggal: '2024-01-06', jumlah: 2200000 },
    { tanggal: '2024-01-07', jumlah: 3100000 },
  ],
  aktivitas_terbaru: [
    {
      id: 1,
      deskripsi: 'Pemesanan tiket shuttle Jakarta-Bandung berhasil',
      waktu: '2024-01-07 14:30:00',
      tipe: 'transaksi'
    },
    {
      id: 2,
      deskripsi: 'Deposit masuk dari Bank BCA',
      waktu: '2024-01-07 13:45:00',
      tipe: 'deposit'
    },
    {
      id: 3,
      deskripsi: 'Registrasi agen shuttle bus baru',
      waktu: '2024-01-07 12:20:00',
      tipe: 'registrasi'
    },
    {
      id: 4,
      deskripsi: 'Pembayaran komisi agen shuttle',
      waktu: '2024-01-07 11:15:00',
      tipe: 'fee'
    },
    {
      id: 5,
      deskripsi: 'Booking shuttle Surabaya-Malang berhasil',
      waktu: '2024-01-07 10:30:00',
      tipe: 'transaksi'
    }
  ]
}

export const useAdminStore = defineStore('admin', {
  state: () => ({
    dashboardData: null as AdminDashboardData | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchDashboardData() {
      this.loading = true
      this.error = null
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Use mock data instead of API call
        // const response = await adminService.getDashboardData()
        this.dashboardData = mockDashboardData
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch dashboard data'
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
