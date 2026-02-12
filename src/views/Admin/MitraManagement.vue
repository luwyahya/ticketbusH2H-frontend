<template>
  <SidebarProvider :style="{ '--sidebar-width': '16rem', '--header-height': '3rem' }">
    <AppSidebar />
    <SidebarInset>
      <SiteHeader />
      
      <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Manajemen Mitra</h1>
            <p class="text-muted-foreground mt-1">Kelola data mitra dan partner</p>
          </div>
          <Button @click="$router.push('/admin/mitra/add')">
            <Plus class="mr-2 h-4 w-4" />
            Tambah Mitra
          </Button>
        </div>

        <!-- Pending Approval Table -->
        <Card>
          <CardHeader>
            <CardTitle>Mitra Menunggu Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="loading" class="text-center py-8">Loading...</div>
            <div v-else-if="pendingMitras.length === 0" class="text-center py-8 text-muted-foreground">
              Tidak ada mitra yang menunggu approval
            </div>
            <Table v-else>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Mitra</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Tanggal Daftar</TableHead>
                  <TableHead class="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="mitra in pendingMitras" :key="mitra.id">
                  <TableCell class="font-medium">{{ mitra.nama }}</TableCell>
                  <TableCell>{{ mitra.email }}</TableCell>
                  <TableCell>{{ mitra.phone || '-' }}</TableCell>
                  <TableCell>{{ formatDate(mitra.tanggal_bergabung) }}</TableCell>
                  <TableCell class="text-right space-x-2">
                    <Button variant="ghost" size="sm" @click="viewDetail(mitra.id)">Detail</Button>
                    <Button variant="default" size="sm" @click="approveMitra(mitra.id)">Approve</Button>
                    <Button variant="destructive" size="sm" @click="rejectMitra(mitra.id)">Reject</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <!-- Active/Rejected Table -->
        <Card>
          <CardHeader>
            <CardTitle>Daftar Mitra</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center gap-4 mb-4">
              <div class="flex-1">
                <Input v-model="searchQuery" placeholder="Cari nama atau email..." @input="handleSearch" />
              </div>
              <Select v-model="statusFilter" @update:model-value="handleStatusFilter">
                <SelectTrigger class="w-[180px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div v-if="loading" class="text-center py-8">Loading...</div>
            <div v-else-if="activeMitras.length === 0" class="text-center py-8 text-muted-foreground">
              Tidak ada data mitra
            </div>
            <Table v-else>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Mitra</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Saldo Deposit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Bergabung</TableHead>
                  <TableHead class="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="mitra in activeMitras" :key="mitra.id">
                  <TableCell class="font-medium">{{ mitra.nama }}</TableCell>
                  <TableCell>{{ mitra.email }}</TableCell>
                  <TableCell>{{ formatCurrency(mitra.saldo_deposit) }}</TableCell>
                  <TableCell>
                    <Badge :variant="mitra.status === 'active' ? 'default' : 'destructive'">
                      {{ mitra.status }}
                    </Badge>
                  </TableCell>
                  <TableCell>{{ formatDate(mitra.tanggal_bergabung) }}</TableCell>
                  <TableCell class="text-right">
                    <Button variant="ghost" size="sm" @click="viewDetail(mitra.id)">Detail</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>

    <!-- Detail Dialog -->
    <Dialog v-model:open="detailDialogOpen">
      <DialogContent class="max-w-2xl">
        <div class="space-y-4">
          <div>
            <DialogTitle>Detail Mitra</DialogTitle>
            <DialogDescription>Informasi lengkap mitra</DialogDescription>
          </div>
          
          <div v-if="loadingDetail" class="text-center py-8">Loading...</div>
          
          <div v-else-if="selectedMitra" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-muted-foreground">Kode Mitra</p>
                <p class="font-medium">{{ selectedMitra.code }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Status</p>
                <Badge :variant="selectedMitra.status === 'active' ? 'default' : selectedMitra.status === 'pending' ? 'secondary' : 'destructive'">
                  {{ selectedMitra.status }}
                </Badge>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Nama</p>
                <p class="font-medium">{{ selectedMitra.name }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Email</p>
                <p class="font-medium">{{ selectedMitra.email }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Telepon</p>
                <p class="font-medium">{{ selectedMitra.phone }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Saldo Deposit</p>
                <p class="font-medium">{{ formatCurrency(selectedMitra.balance) }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Tanggal Bergabung</p>
                <p class="font-medium">{{ formatDate(selectedMitra.created_at) }}</p>
              </div>
            </div>
            
            <div class="flex justify-end pt-4">
              <Button variant="outline" @click="detailDialogOpen = false">Tutup</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { Plus } from 'lucide-vue-next'
import { api } from '@/services/api.service'
import { mitraService } from '@/services/mitra.service'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()
const router = useRouter()

const loading = ref(false)
const allMitras = ref<any[]>([])
const searchQuery = ref('')
const statusFilter = ref('all')
const detailDialogOpen = ref(false)
const loadingDetail = ref(false)
const selectedMitra = ref<any>(null)

onMounted(() => {
  fetchMitras()
})

const fetchMitras = async () => {
  loading.value = true
  try {
    const response = await api.get('/mitra')
    const data = response.data.data
    allMitras.value = Array.isArray(data) ? data : []
  } catch (error: any) {
    console.error('Failed to fetch mitras:', error)
    toast({ 
      title: 'Error', 
      description: 'Gagal memuat data mitra. Silakan coba lagi.', 
      variant: 'destructive' 
    })
    allMitras.value = []
  } finally {
    loading.value = false
  }
}

const pendingMitras = computed(() => {
  if (!Array.isArray(allMitras.value)) return []
  return allMitras.value
    .filter(m => m.status === 'pending')
    .map(m => ({
      id: m.id,
      nama: m.name,
      email: m.email,
      phone: m.phone,
      saldo_deposit: m.balance,
      status: m.status,
      tanggal_bergabung: m.created_at
    }))
})

const activeMitras = computed(() => {
  if (!Array.isArray(allMitras.value)) return []
  let filtered = allMitras.value.filter(m => m.status !== 'pending')
  
  if (searchQuery.value) {
    filtered = filtered.filter(m => 
      m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(m => m.status === statusFilter.value)
  }
  
  return filtered.map(m => ({
    id: m.id,
    nama: m.name,
    email: m.email,
    saldo_deposit: m.balance,
    status: m.status,
    tanggal_bergabung: m.created_at
  }))
})

const handleSearch = () => {
  // Trigger computed property recalculation
}

const handleStatusFilter = () => {
  // Trigger computed property recalculation
}

const viewDetail = async (id: number) => {
  detailDialogOpen.value = true
  loadingDetail.value = true
  try {
    const response = await mitraService.getMitraDetail(id)
    selectedMitra.value = response.data
  } catch (err) {
    console.error('Failed to fetch mitra detail:', err)
  } finally {
    loadingDetail.value = false
  }
}

const approveMitra = async (id: number) => {
  try {
    await api.post(`/mitra/${id}/approve`)
    toast({ title: 'Berhasil', description: 'Mitra berhasil diapprove' })
    fetchMitras()
  } catch (error) {
    toast({ title: 'Gagal', description: 'Gagal approve mitra', variant: 'destructive' })
  }
}

const rejectMitra = async (id: number) => {
  try {
    await api.post(`/mitra/${id}/reject`)
    toast({ title: 'Berhasil', description: 'Mitra berhasil direject' })
    fetchMitras()
  } catch (error) {
    toast({ title: 'Gagal', description: 'Gagal reject mitra', variant: 'destructive' })
  }
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
    month: 'long',
    year: 'numeric',
  })
}
</script>
