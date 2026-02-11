import type { AdminDashboardData, MitraDashboardData, MitraListItem } from '@/types/admin.types'
import type { ApiResponse } from '@/types/api.types'

class MockAdminService {
  async getDashboardData(): Promise<ApiResponse<AdminDashboardData>> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      data: {
        total_transaksi_hari_ini: 15000000,
        total_transaksi_bulan_berjalan: 450000000,
        total_deposit_masuk: 125000000,
        total_fee_mitra: 8500000,
        grafik_transaksi: [
          { tanggal: '2024-01-01', jumlah: 12000000 },
          { tanggal: '2024-01-02', jumlah: 15000000 },
          { tanggal: '2024-01-03', jumlah: 18000000 },
          { tanggal: '2024-01-04', jumlah: 14000000 },
          { tanggal: '2024-01-05', jumlah: 20000000 },
          { tanggal: '2024-01-06', jumlah: 17000000 },
          { tanggal: '2024-01-07', jumlah: 22000000 },
        ],
        aktivitas_terbaru: [
          { id: 1, deskripsi: 'Booking tiket Jakarta-Bandung berhasil - Rp 150.000', waktu: '5 menit yang lalu', tipe: 'booking' },
          { id: 2, deskripsi: 'Deposit masuk dari Mitra Travel ABC - Rp 5.000.000', waktu: '15 menit yang lalu', tipe: 'deposit' },
          { id: 3, deskripsi: 'Pembatalan tiket Surabaya-Malang - Refund Rp 120.000', waktu: '30 menit yang lalu', tipe: 'refund' },
          { id: 4, deskripsi: 'Mitra baru terdaftar: PT Shuttle Express', waktu: '1 jam yang lalu', tipe: 'registrasi' },
          { id: 5, deskripsi: 'Booking tiket Yogyakarta-Solo berhasil - Rp 80.000', waktu: '2 jam yang lalu', tipe: 'booking' },
        ],
      },
    }
  }
}

class MockMitraService {
  async getMitraList(): Promise<ApiResponse<MitraListItem[]>> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      data: [
        { id: 1, nama: 'PT Travel Express', saldo_deposit: 25000000, total_transaksi: 85000000, total_fee: 2500000, status: 'active' },
        { id: 2, nama: 'CV Shuttle Jaya', saldo_deposit: 15000000, total_transaksi: 45000000, total_fee: 1200000, status: 'active' },
        { id: 3, nama: 'PT Bus Sejahtera', saldo_deposit: 30000000, total_transaksi: 120000000, total_fee: 3500000, status: 'active' },
        { id: 4, nama: 'UD Transport Mandiri', saldo_deposit: 10000000, total_transaksi: 28000000, total_fee: 800000, status: 'active' },
      ],
    }
  }

  async getMitraDetail(id: number): Promise<ApiResponse<MitraDashboardData>> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      data: {
        saldo_deposit: 25000000,
        total_transaksi_mitra: 85000000,
        total_fee_diperoleh: 2500000,
        grafik_transaksi_mitra: [
          { tanggal: '2024-01-01', jumlah: 8000000 },
          { tanggal: '2024-01-02', jumlah: 10000000 },
          { tanggal: '2024-01-03', jumlah: 12000000 },
          { tanggal: '2024-01-04', jumlah: 9000000 },
          { tanggal: '2024-01-05', jumlah: 15000000 },
          { tanggal: '2024-01-06', jumlah: 11000000 },
          { tanggal: '2024-01-07', jumlah: 13000000 },
        ],
      },
    }
  }
}

export const mockAdminService = new MockAdminService()
export const mockMitraService = new MockMitraService()
