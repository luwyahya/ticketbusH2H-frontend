<template>
  <SidebarProvider :style="{ '--sidebar-width': '16rem', '--header-height': '3rem' }">
    <AppSidebar />
    <SidebarInset>
      <SiteHeader />
      
      <div class="flex flex-1 flex-col items-center">
        <div class="flex flex-col gap-6 p-6 w-full max-w-2xl">
          <div>
            <h1 class="text-3xl font-bold">Tambah Mitra</h1>
            <p class="text-muted-foreground">Tambahkan mitra baru ke sistem</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Mitra</CardTitle>
              <CardDescription>Masukkan data mitra yang akan didaftarkan</CardDescription>
            </CardHeader>
            <CardContent>
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="space-y-2">
                  <Label for="name">Nama Mitra</Label>
                  <Input
                    id="name"
                    v-model="form.name"
                    type="text"
                    placeholder="PT. Contoh Mitra"
                    required
                  />
                </div>

                <div class="space-y-2">
                  <Label for="email">Email</Label>
                  <Input
                    id="email"
                    v-model="form.email"
                    type="email"
                    placeholder="mitra@example.com"
                    required
                  />
                </div>

                <div class="space-y-2">
                  <Label for="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    placeholder="08123456789"
                    required
                  />
                </div>

                <div class="space-y-2">
                  <Label for="password">Password</Label>
                  <Input
                    id="password"
                    v-model="form.password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  <p>{{ error }}</p>
                </div>

                <div class="flex gap-3 pt-4">
                  <Button type="submit" :disabled="loading">
                    <span v-if="loading">Menyimpan...</span>
                    <span v-else>Simpan Mitra</span>
                  </Button>
                  <Button type="button" variant="outline" @click="router.push('/admin/mitra')">
                    Batal
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
const { toast } = useToast()

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await api.post('/v1/mitra/register', form.value)
    
    toast({
      title: 'Berhasil!',
      description: 'Mitra berhasil ditambahkan',
    })
    
    router.push('/admin/mitra')
  } catch (err: any) {
    error.value = err.message || 'Gagal menambahkan mitra'
  } finally {
    loading.value = false
  }
}
</script>
