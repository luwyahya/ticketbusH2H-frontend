import { defineStore } from 'pinia'
// import { mitraService } from '@/services/mitra.service'
import type { MitraListItem } from '@/types/admin.types'

// Mock data - expanded for pagination
const mockMitraList: MitraListItem[] = [
  {
    id: 1,
    nama: 'PT Shuttle Express',
    email: 'admin@shuttleexpress.com',
    saldo_deposit: 15000000,
    total_transaksi: 245,
    total_fee: 2450000,
    status: 'aktif',
    tanggal_bergabung: '2023-06-15'
  },
  {
    id: 2,
    nama: 'CV Trans Jaya',
    email: 'info@transjaya.com',
    saldo_deposit: 8500000,
    total_transaksi: 156,
    total_fee: 1560000,
    status: 'aktif',
    tanggal_bergabung: '2023-08-22'
  },
  {
    id: 3,
    nama: 'UD Berkah Transport',
    email: 'contact@berkahtransport.com',
    saldo_deposit: 3200000,
    total_transaksi: 89,
    total_fee: 890000,
    status: 'nonaktif',
    tanggal_bergabung: '2023-11-10'
  },
  {
    id: 4,
    nama: 'PT Nusantara Shuttle',
    email: 'hello@nusantarashuttle.com',
    saldo_deposit: 22000000,
    total_transaksi: 378,
    total_fee: 3780000,
    status: 'aktif',
    tanggal_bergabung: '2023-04-08'
  },
  {
    id: 5,
    nama: 'CV Smart Travel',
    email: 'admin@smarttravel.com',
    saldo_deposit: 12500000,
    total_transaksi: 203,
    total_fee: 2030000,
    status: 'aktif',
    tanggal_bergabung: '2023-09-14'
  },
  {
    id: 6,
    nama: 'PT Rapid Bus',
    email: 'info@rapidbus.com',
    saldo_deposit: 18000000,
    total_transaksi: 312,
    total_fee: 3120000,
    status: 'aktif',
    tanggal_bergabung: '2023-05-20'
  },
  {
    id: 7,
    nama: 'CV Metro Transport',
    email: 'admin@metrotransport.com',
    saldo_deposit: 6500000,
    total_transaksi: 134,
    total_fee: 1340000,
    status: 'nonaktif',
    tanggal_bergabung: '2023-10-05'
  },
  {
    id: 8,
    nama: 'PT Express Line',
    email: 'contact@expressline.com',
    saldo_deposit: 25000000,
    total_transaksi: 456,
    total_fee: 4560000,
    status: 'aktif',
    tanggal_bergabung: '2023-03-12'
  }
]

export const useMitraManagementStore = defineStore('mitraManagement', {
  state: () => ({
    mitraList: [] as MitraListItem[],
    filteredList: [] as MitraListItem[],
    loading: false,
    error: null as string | null,
    currentPage: 1,
    limit: parseInt(localStorage.getItem('mitraLimit') || '5'),
    searchQuery: '',
    statusFilter: 'all',
  }),

  getters: {
    paginatedList: (state) => {
      const start = (state.currentPage - 1) * state.limit
      const end = start + state.limit
      return state.filteredList.slice(start, end)
    },
    totalPages: (state) => Math.ceil(state.filteredList.length / state.limit),
  },

  actions: {
    async fetchMitraList() {
      this.loading = true
      this.error = null
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        this.mitraList = mockMitraList
        this.applyFilters()
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch mitra list'
        throw error
      } finally {
        this.loading = false
      }
    },

    setLimit(newLimit: number) {
      this.limit = newLimit
      this.currentPage = 1
      localStorage.setItem('mitraLimit', newLimit.toString())
    },

    setPage(page: number) {
      this.currentPage = page
    },

    setSearch(query: string) {
      this.searchQuery = query
      this.currentPage = 1
      this.applyFilters()
    },

    setStatusFilter(status: string) {
      this.statusFilter = status
      this.currentPage = 1
      this.applyFilters()
    },

    applyFilters() {
      let filtered = [...this.mitraList]
      
      if (this.searchQuery) {
        filtered = filtered.filter(mitra => 
          mitra.nama.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          mitra.email.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
      
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(mitra => mitra.status === this.statusFilter)
      }
      
      this.filteredList = filtered
    }
  },
})