export interface ReportTransaction {
  id: number
  tanggal: string
  mitra: string
  jenis_transaksi: string
  jumlah: number
  fee: number
  status: string
}

export interface ReportFilter {
  start_date: string
  end_date: string
  mitra_id?: number
  report_type: string
}
