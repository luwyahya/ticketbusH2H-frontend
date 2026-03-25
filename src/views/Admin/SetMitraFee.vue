<template>
  <SidebarProvider :style="{ '--sidebar-width': '16rem', '--header-height': '3rem' }">
    <AppSidebar />
    <SidebarInset>
      <SiteHeader />
      
      <div class="flex flex-1 flex-col items-center">
        <div class="flex flex-col gap-6 p-6 w-full max-w-2xl">
          <div>
            <h1 class="text-3xl font-bold">Set Fee Mitra</h1>
            <p class="text-muted-foreground">Atur fee untuk mitra {{ mitraName }}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Konfigurasi Fee</CardTitle>
              <CardDescription>
                {{ existingFee ? 'Update fee untuk mitra ini' : 'Tentukan tipe dan nilai fee untuk mitra ini' }}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div v-if="loadingFee" class="text-center py-8 text-muted-foreground">
                Loading...
              </div>
              <form v-else @submit.prevent="handleSubmit" class="space-y-4">
                <div class="space-y-2">
                  <Label for="feeType">Tipe Fee</Label>
                  <select
                    id="feeType"
                    v-model="form.type"
                    class="w-full rounded-md border px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Pilih Tipe Fee</option>
                    <option value="flat">Flat (Nominal Tetap)</option>
                    <option value="percent">Persen (%)</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <Label for="feeValue">Nilai Fee</Label>
                  <Input
                    id="feeValue"
                    v-model="form.value"
                    type="number"
                    :placeholder="form.type === 'percent' ? 'Contoh: 5 (untuk 5%)' : 'Contoh: 5000 (Rp 5.000)'"
                    min="0"
                    :max="form.type === 'percent' ? 100 : undefined"
                    step="any"
                    required
                  />
                  <p class="text-xs text-muted-foreground">
                    {{ form.type === 'percent' ? 'Masukkan nilai persen (0-100)' : 'Masukkan nominal flat dalam Rupiah (contoh: 3000, 5000)' }}
                  </p>
                </div>

                <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  <p>{{ error }}</p>
                </div>

                <div class="flex gap-3 pt-4">
                  <Button type="submit" :disabled="loading">
                    <span v-if="loading">Menyimpan...</span>
                    <span v-else>{{ existingFee ? 'Update Fee' : 'Simpan Fee' }}</span>
                  </Button>
                  <Button type="button" variant="outline" @click="skipFee">
                    {{ existingFee ? 'Batal' : 'Lewati' }}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { api } from '@/services/api.service'

const router = useRouter()
const route = useRoute()
const { toast } = useToast()

const mitraId = ref(route.params.id as string)
const mitraName = ref('')
const existingFee = ref<any>(null)

const form = ref({
  type: '',
  value: ''
})

const loading = ref(false)
const loadingFee = ref(false)
const error = ref('')

const fetchMitraAndFee = async () => {
  loadingFee.value = true
  try {
    const response = await api.get(`/v1/mitra/${mitraId.value}`)
    const mitra = response.data.data
    mitraName.value = mitra.name
    
    // Get fee config dari endpoint yang benar
    const feeResponse = await api.get('/v1/fee/config')
    const feeConfigs = feeResponse.data.message
    const mitraFee = feeConfigs.find((fee: any) => fee.mitra_id === parseInt(mitraId.value) && fee.active)
    
    if (mitraFee) {
      existingFee.value = mitraFee
      form.value.type = mitraFee.type || ''
      form.value.value = mitraFee.value ? mitraFee.value.toString() : ''
    }
  } catch (err) {
    console.error('Failed to fetch mitra/fee:', err)
  } finally {
    loadingFee.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await api.put(`/v1/mitra/${mitraId.value}/fee`, {
      type: form.value.type,
      value: parseFloat(form.value.value)
    })
    
    toast({
      title: 'Berhasil!',
      description: 'Fee mitra berhasil diatur',
    })
    
    router.push('/admin/mitra')
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Gagal mengatur fee'
  } finally {
    loading.value = false
  }
}

const skipFee = () => {
  router.push('/admin/mitra')
}

onMounted(() => {
  if (!mitraId.value) {
    router.push('/admin/mitra')
  } else {
    fetchMitraAndFee()
  }
})
</script>
