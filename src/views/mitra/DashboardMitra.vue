<template>
  <SidebarProvider
    :style="{
      '--sidebar-width': '16rem',
      '--header-height': '3rem',
    }"
  >
    <SidebarMitra />
    <SidebarInset>
      <SiteHeader />
      
      <div class="flex flex-1 flex-col">
        <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          <!-- Page Header -->
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Dashboard Mitra</h1>
            <p class="text-muted-foreground mt-1">
              Ringkasan aktivitas dan saldo mitra Anda.
            </p>

          </div>

          <!-- Stats Cards -->
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">Saldo Deposit</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  Rp {{ dashboardStore.dashboard.balance.toLocaleString('id-ID') }}
                </div>

                <p class="text-xs text-muted-foreground">
                  Note : Saldo Aktif Saat ini 
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">Total Transaksi</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  {{ dashboardStore.dashboard.totalTransactions }}
                </div>

                <p class="text-xs text-muted-foreground">
                  Transaksi Bulan Ini 
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">Total Fee Diperoleh</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                      Rp {{ dashboardStore.dashboard.totalFee.toLocaleString('id-ID') }}
                </div>

                <p class="text-xs text-muted-foreground">
                  Note : Akumulasi Fee
                </p>
              </CardContent>
            </Card>
          </div>

                        <!-- Grafik Transaksi Mitra -->
              <Card>
                <CardHeader>
                  <CardTitle>Grafik Transaksi Mitra</CardTitle>
                  <CardDescription>
                    Ringkasan transaksi mitra berdasarkan waktu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    class="h-[300px] flex items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground"
                  >
                    Grafik transaksi mitra (placeholder)
                  </div>
                </CardContent>
              </Card>

        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import SiteHeader from '@/components/SiteHeader.vue'
import SidebarMitra from '@/components/SidebarMitra.vue'

import { useDashboardMitraStore } from '@/stores/mitra/dashboard'
import { onMounted } from 'vue'

const dashboardStore = useDashboardMitraStore()

onMounted(() => {
  dashboardStore.fetchDashboard()
})


const router = useRouter()

</script>

