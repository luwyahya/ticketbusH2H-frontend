<template>
  <SidebarProvider :style="{ '--sidebar-width': '16rem', '--header-height': '3rem' }">
    <AppSidebar />
    <SidebarInset>
      <SiteHeader />
      
      <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Detail Mitra</h1>
            <p class="text-muted-foreground mt-1">Informasi lengkap mitra</p>
          </div>
          <Button variant="outline" @click="$router.back()">
            <ArrowLeft class="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-8">
          <p class="text-muted-foreground">Loading...</p>
        </div>

        <div v-else-if="error" class="text-center py-8 text-destructive">
          {{ error }}
        </div>

        <div v-else-if="mitra" class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Mitra</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-muted-foreground">Kode Mitra</p>
                  <p class="font-medium">{{ mitra.code }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Status</p>
                  <Badge :variant="mitra.status === 'active' ? 'default' : 'secondary'">
                    {{ mitra.status }}
                  </Badge>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Nama</p>
                  <p class="font-medium">{{ mitra.name }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Email</p>
                  <p class="font-medium">{{ mitra.email }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Telepon</p>
                  <p class="font-medium">{{ mitra.phone }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Saldo Deposit</p>
                  <p class="font-medium">{{ formatCurrency(mitra.balance) }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Tanggal Bergabung</p>
                  <p class="font-medium">{{ formatDate(mitra.created_at) }}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { ArrowLeft } from 'lucide-vue-next'
import { mitraService } from '@/services/mitra.service'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref<string | null>(null)
const mitra = ref<any>(null)

onMounted(() => {
  fetchMitraDetail()
})

const fetchMitraDetail = async () => {
  loading.value = true
  error.value = null
  try {
    const id = parseInt(route.params.id as string)
    const response = await mitraService.getMitraDetail(id)
    mitra.value = response.data
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch mitra detail'
  } finally {
    loading.value = false
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
