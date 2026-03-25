<template>
  <SidebarProvider :style="{ '--sidebar-width': '16rem', '--header-height': '3rem' }">
    <AppSidebar />
    <SidebarInset>
      <SiteHeader />
      
      <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Fee Mitra</h1>
          <p class="text-muted-foreground mt-1">Riwayat fee yang diperoleh mitra</p>
        </div>

        <Card>
          <CardHeader>
            <div class="flex justify-between items-center">
              <div>
                <CardTitle>Riwayat Fee Ledger</CardTitle>
                <CardDescription>Daftar fee yang diperoleh dari transaksi</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                @click="fetchFeeLedgers(pagination.current_page)"
                :disabled="loading"
              >
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div v-if="loading" class="text-center py-8 text-muted-foreground">
              Loading...
            </div>
            <div v-else-if="feeLedgers.length === 0" class="text-center py-8 text-muted-foreground">
              Belum ada riwayat fee
            </div>
            <div v-else>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Mitra</TableHead>
                    <TableHead>Transaksi</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Keterangan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="ledger in feeLedgers" :key="ledger.id">
                    <TableCell>{{ formatDate(ledger.created_at) }}</TableCell>
                    <TableCell>{{ ledger.mitra?.name || '-' }}</TableCell>
                    <TableCell>{{ ledger.transaction?.code || '-' }}</TableCell>
                    <TableCell>{{ formatCurrency(ledger.fee_amount) }}</TableCell>
                    <TableCell>{{ ledger.description || '-' }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div class="flex items-center justify-between mt-4">
                <p class="text-sm text-muted-foreground">
                  Menampilkan {{ pagination.from || 0 }} - {{ pagination.to || 0 }} dari {{ pagination.total }} data
                </p>
                <div class="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    @click="changePage(pagination.current_page - 1)"
                    :disabled="!pagination.prev_page_url"
                  >
                    Sebelumnya
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    @click="changePage(pagination.current_page + 1)"
                    :disabled="!pagination.next_page_url"
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { api } from '@/services/api.service'

const loading = ref(false)
const feeLedgers = ref<any[]>([])
const pagination = ref({
  current_page: 1,
  from: null,
  to: null,
  total: 0,
  per_page: 15,
  prev_page_url: null,
  next_page_url: null
})

let refreshInterval: NodeJS.Timeout | null = null

onMounted(() => {
  fetchFeeLedgers()
  // Auto refresh setiap 30 detik
  refreshInterval = setInterval(() => {
    fetchFeeLedgers(pagination.value.current_page)
  }, 30000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

const fetchFeeLedgers = async (page = 1) => {
  loading.value = true
  try {
    const response = await api.get(`/fee/ledgers?page=${page}`)
    const data = response.data.message
    feeLedgers.value = data.data || []
    pagination.value = {
      current_page: data.current_page,
      from: data.from,
      to: data.to,
      total: data.total,
      per_page: data.per_page,
      prev_page_url: data.prev_page_url,
      next_page_url: data.next_page_url
    }
  } catch (error) {
    console.error('Failed to fetch fee ledgers:', error)
    feeLedgers.value = []
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  fetchFeeLedgers(page)
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
