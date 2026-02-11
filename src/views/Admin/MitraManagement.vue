<template>
  <SidebarProvider :style="{ '--sidebar-width': '16rem', '--header-height': '3rem' }">
    <AppSidebar />
    <SidebarInset>
      <SiteHeader />
      
      <div class="flex flex-1 flex-col">
        <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Manajemen Mitra</h1>
            <p class="text-muted-foreground mt-1">Kelola dan pantau semua mitra</p>
          </div>

          <div v-if="mitraStore.loading" class="flex items-center justify-center py-8">
            <p class="text-muted-foreground">Loading...</p>
          </div>

          <div v-else class="space-y-6">
            <!-- Stats Summary -->
            <div class="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium">Total Mitra</CardTitle>
                  <Users class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-bold">{{ mitraStore.mitraList.length }}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium">Mitra Aktif</CardTitle>
                  <CheckCircle class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-bold">{{ activeMitraCount }}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium">Total Deposit</CardTitle>
                  <Wallet class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-bold">{{ formatCurrency(totalDeposit) }}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium">Total Fee</CardTitle>
                  <DollarSign class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-bold">{{ formatCurrency(totalFee) }}</div>
                </CardContent>
              </Card>
            </div>

            <!-- Filters and Controls -->
            <Card>
              <CardContent class="p-4">
                <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div class="flex flex-col sm:flex-row gap-4 flex-1">
                    <div class="flex-1">
                      <Input 
                        placeholder="Cari nama atau email mitra..." 
                        v-model="searchQuery"
                        @input="handleSearch"
                        class="max-w-sm"
                      />
                    </div>
                    <div>
                      <Select v-model="statusFilter" @update:model-value="handleStatusFilter">
                        <SelectTrigger class="w-[180px]">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Status</SelectItem>
                          <SelectItem value="aktif">Aktif</SelectItem>
                          <SelectItem value="nonaktif">Nonaktif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <Label class="text-sm">Show:</Label>
                    <Select v-model="limitValue" @update:model-value="handleLimitChange">
                      <SelectTrigger class="w-[80px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Mitra Table -->
            <Card>
              <CardHeader>
                <CardTitle>Daftar Mitra</CardTitle>
                <CardDescription>Informasi lengkap semua mitra terdaftar</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Mitra</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Saldo Deposit</TableHead>
                      <TableHead>Total Transaksi</TableHead>
                      <TableHead>Total Fee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Bergabung</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="mitra in mitraStore.paginatedList" :key="mitra.id" class="cursor-pointer hover:bg-muted/50" @click="showMitraDetail(mitra)">
                      <TableCell class="font-medium">{{ mitra.nama }}</TableCell>
                      <TableCell>{{ mitra.email }}</TableCell>
                      <TableCell>{{ formatCurrency(mitra.saldo_deposit) }}</TableCell>
                      <TableCell>{{ mitra.total_transaksi.toLocaleString() }}</TableCell>
                      <TableCell>{{ formatCurrency(mitra.total_fee) }}</TableCell>
                      <TableCell>
                        <Badge :variant="mitra.status === 'aktif' ? 'default' : 'destructive'">
                          {{ mitra.status }}
                        </Badge>
                      </TableCell>
                      <TableCell>{{ formatDate(mitra.tanggal_bergabung) }}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              
              <!-- Pagination -->
              <div class="flex items-center justify-between px-6 py-4 border-t">
                <div class="text-sm text-muted-foreground">
                  Showing {{ (mitraStore.currentPage - 1) * mitraStore.limit + 1 }} to 
                  {{ Math.min(mitraStore.currentPage * mitraStore.limit, mitraStore.filteredList.length) }} 
                  of {{ mitraStore.filteredList.length }} entries
                </div>
                <div class="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    :disabled="mitraStore.currentPage === 1"
                    @click="mitraStore.setPage(mitraStore.currentPage - 1)"
                  >
                    Previous
                  </Button>
                  <div class="flex gap-1">
                    <Button 
                      v-for="page in visiblePages" 
                      :key="page"
                      :variant="page === mitraStore.currentPage ? 'default' : 'outline'"
                      size="sm"
                      @click="mitraStore.setPage(page)"
                      class="w-8"
                    >
                      {{ page }}
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    :disabled="mitraStore.currentPage === mitraStore.totalPages"
                    @click="mitraStore.setPage(mitraStore.currentPage + 1)"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>

    <!-- Mitra Detail Dialog -->
    <Dialog v-model:open="showDetailDialog">
      <DialogContent class="max-w-2xl">
        <DialogTitle>Detail Mitra</DialogTitle>
        <div v-if="selectedMitra" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label class="text-sm font-medium">Nama Mitra</Label>
              <p class="text-lg font-semibold">{{ selectedMitra.nama }}</p>
            </div>
            <div>
              <Label class="text-sm font-medium">Email</Label>
              <p>{{ selectedMitra.email }}</p>
            </div>
            <div>
              <Label class="text-sm font-medium">Status</Label>
              <Badge :variant="selectedMitra.status === 'aktif' ? 'default' : 'secondary'">
                {{ selectedMitra.status }}
              </Badge>
            </div>
            <div>
              <Label class="text-sm font-medium">Tanggal Bergabung</Label>
              <p>{{ formatDate(selectedMitra.tanggal_bergabung) }}</p>
            </div>
          </div>
          
          <Separator />
          
          <div class="grid grid-cols-3 gap-4">
            <Card>
              <CardContent class="p-4">
                <div class="text-sm font-medium text-muted-foreground">Saldo Deposit</div>
                <div class="text-2xl font-bold">{{ formatCurrency(selectedMitra.saldo_deposit) }}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="p-4">
                <div class="text-sm font-medium text-muted-foreground">Total Transaksi</div>
                <div class="text-2xl font-bold">{{ selectedMitra.total_transaksi.toLocaleString() }}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="p-4">
                <div class="text-sm font-medium text-muted-foreground">Total Fee</div>
                <div class="text-2xl font-bold">{{ formatCurrency(selectedMitra.total_fee) }}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { Users, CheckCircle, Wallet, DollarSign } from 'lucide-vue-next'
import { useMitraManagementStore } from '@/stores/mitraManagement.store'
import type { MitraListItem } from '@/types/admin.types'

const mitraStore = useMitraManagementStore()
const showDetailDialog = ref(false)
const selectedMitra = ref<MitraListItem | null>(null)
const searchQuery = ref('')
const statusFilter = ref('all')
const limitValue = ref('10')

onMounted(() => {
  mitraStore.fetchMitraList()
})

const activeMitraCount = computed(() => 
  mitraStore.filteredList.filter(mitra => mitra.status === 'aktif').length
)

const totalDeposit = computed(() => 
  mitraStore.filteredList.reduce((sum, mitra) => sum + mitra.saldo_deposit, 0)
)

const totalFee = computed(() => 
  mitraStore.filteredList.reduce((sum, mitra) => sum + mitra.total_fee, 0)
)

const visiblePages = computed(() => {
  const total = mitraStore.totalPages
  const current = mitraStore.currentPage
  const pages = []
  
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }
  
  return pages
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const showMitraDetail = (mitra: MitraListItem) => {
  selectedMitra.value = mitra
  showDetailDialog.value = true
}

const handleSearch = () => {
  mitraStore.setSearch(searchQuery.value)
}

const handleStatusFilter = () => {
  mitraStore.setStatusFilter(statusFilter.value)
}

const handleLimitChange = () => {
  mitraStore.setLimit(parseInt(limitValue.value.toString()))
}
</script>