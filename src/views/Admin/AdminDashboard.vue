<template>
  <SidebarProvider :style="{ '--sidebar-width': '16rem', '--header-height': '3rem' }">
    <AppSidebar />
    <SidebarInset>
      <SiteHeader />
      
      <div class="flex flex-1 flex-col">
        <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
            <p class="text-muted-foreground mt-1">Overview statistik dan aktivitas sistem</p>
          </div>

          <div v-if="adminStore.loading" class="flex items-center justify-center py-8">
            <p class="text-muted-foreground">Loading...</p>
          </div>

          <div v-else-if="adminStore.dashboardData" class="space-y-6">
            <!-- Stats Cards -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium">Transaksi Hari Ini</CardTitle>
                  <TrendingUp class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-bold">{{ formatCurrency(adminStore.dashboardData.total_transaksi_hari_ini) }}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium">Transaksi Bulan Ini</CardTitle>
                  <Calendar class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-bold">{{ formatCurrency(adminStore.dashboardData.total_transaksi_bulan_berjalan) }}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium">Total Deposit Masuk</CardTitle>
                  <Wallet class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-bold">{{ formatCurrency(adminStore.dashboardData.total_deposit_masuk) }}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium">Total Fee Mitra</CardTitle>
                  <DollarSign class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-bold">{{ formatCurrency(adminStore.dashboardData.total_fee_mitra) }}</div>
                </CardContent>
              </Card>
            </div>

            <!-- Grafik & Aktivitas -->
            <div class="grid gap-4 md:grid-cols-2">
              <!-- Grafik Transaksi -->
              <!-- <ChartTransaksi :data="adminStore.dashboardData.grafik_transaksi" /> -->

              <!-- Aktivitas Terbaru -->
              <Card>
                <CardHeader>
                  <CardTitle>Aktivitas Terbaru</CardTitle>
                  <CardDescription>Log aktivitas sistem terkini</CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="space-y-4">
                    <div v-for="aktivitas in adminStore.dashboardData.aktivitas_terbaru" :key="aktivitas.id" class="flex items-start gap-3">
                      <div class="flex h-8 w-8 items-center justify-center rounded-full" :class="getActivityBgColor(aktivitas.tipe)">
                        <component :is="getActivityIcon(aktivitas.tipe)" class="h-4 w-4" :class="getActivityIconColor(aktivitas.tipe)" />
                      </div>
                      <div class="flex-1 space-y-1">
                        <p class="text-sm font-medium">{{ aktivitas.deskripsi }}</p>
                        <p class="text-xs text-muted-foreground">{{ formatDateTime(aktivitas.waktu) }}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
//import ChartTransaksi from '@/components/ChartTransaksi.vue'
import { TrendingUp, Calendar, Wallet, DollarSign, Activity, CreditCard, UserPlus, Banknote } from 'lucide-vue-next'
import { useAdminStore } from '@/stores/admin.store'

const adminStore = useAdminStore()

onMounted(() => {
  adminStore.fetchDashboardData()
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const formatDateTime = (datetime: string) => {
  return new Date(datetime).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getActivityIcon = (tipe: string) => {
  switch (tipe) {
    case 'transaksi': return CreditCard
    case 'deposit': return Wallet
    case 'registrasi': return UserPlus
    case 'fee': return Banknote
    default: return Activity
  }
}

const getActivityBgColor = (tipe: string) => {
  switch (tipe) {
    case 'transaksi': return 'bg-blue-100'
    case 'deposit': return 'bg-green-100'
    case 'registrasi': return 'bg-purple-100'
    case 'fee': return 'bg-orange-100'
    default: return 'bg-gray-100'
  }
}

const getActivityIconColor = (tipe: string) => {
  switch (tipe) {
    case 'transaksi': return 'text-blue-600'
    case 'deposit': return 'text-green-600'
    case 'registrasi': return 'text-purple-600'
    case 'fee': return 'text-orange-600'
    default: return 'text-gray-600'
  }
}
</script>