export interface AdminDashboardData {
  total_transaksi_hari_ini: number
  total_transaksi_bulan_berjalan: number
  total_deposit_masuk: number
  total_fee_mitra: number
  grafik_transaksi: GrafikTransaksi[]
  aktivitas_terbaru: AktivitasTerbaru[]
}

export interface GrafikTransaksi {
  tanggal: string
  jumlah: number
}

export interface AktivitasTerbaru {
  id: number
  deskripsi: string
  waktu: string
  tipe: string
}

export interface MitraDashboardData {
  saldo_deposit: number
  total_transaksi_mitra: number
  total_fee_diperoleh: number
  grafik_transaksi_mitra: GrafikTransaksi[]
}

export interface MitraListItem {
  id: number
  nama: string
  email: string
  saldo_deposit: number
  total_transaksi: number
  total_fee: number
  status: string
  tanggal_bergabung: string
}
