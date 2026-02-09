<template>
  <SidebarProvider :style="{ '--sidebar-width': '16rem', '--header-height': '3rem' }">
    <AppSidebar />
    <SidebarInset>
      <SiteHeader />
      
      <div class="flex flex-1 flex-col">
        <div class="flex flex-1 flex-col gap-6 p-6">
          <div>
            <h1 class="text-3xl font-bold">Profil Admin</h1>
            <p class="text-muted-foreground">Kelola informasi profil Anda</p>
          </div>

          <div class="grid gap-6 max-w-4xl">
            <!-- Profile Info Card -->
            <Card>
              <CardHeader>
                <CardTitle>Informasi Profil</CardTitle>
                <CardDescription>Update informasi pribadi Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <form @submit.prevent="handleUpdateProfile" class="space-y-4">
                  <div class="space-y-2">
                    <Label for="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      v-model="profileForm.name"
                      type="text"
                      placeholder="Nama lengkap"
                      required
                    />
                  </div>

                  <div class="space-y-2">
                    <Label for="email">Email</Label>
                    <Input
                      id="email"
                      v-model="profileForm.email"
                      type="email"
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div v-if="profileError" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    <p>{{ profileError }}</p>
                  </div>

                  <Button type="submit" :disabled="profileLoading">
                    <span v-if="profileLoading">Menyimpan...</span>
                    <span v-else>Simpan Perubahan</span>
                  </Button>
                </form>
              </CardContent>
            </Card>

            <!-- Change Password Card -->
            <Card>
              <CardHeader>
                <CardTitle>Ubah Password</CardTitle>
                <CardDescription>Update password akun Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <form @submit.prevent="handleChangePassword" class="space-y-4">
                  <div class="space-y-2">
                    <Label for="current_password">Password Saat Ini</Label>
                    <Input
                      id="current_password"
                      v-model="passwordForm.current_password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div class="space-y-2">
                    <Label for="new_password">Password Baru</Label>
                    <Input
                      id="new_password"
                      v-model="passwordForm.new_password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div class="space-y-2">
                    <Label for="confirm_password">Konfirmasi Password Baru</Label>
                    <Input
                      id="confirm_password"
                      v-model="passwordForm.confirm_password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div v-if="passwordError" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    <p>{{ passwordError }}</p>
                  </div>

                  <Button type="submit" :disabled="passwordLoading">
                    <span v-if="passwordLoading">Mengubah...</span>
                    <span v-else>Ubah Password</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/services/api.service'

const authStore = useAuthStore()
const { toast } = useToast()

const profileForm = ref({
  name: '',
  email: ''
})

const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const profileLoading = ref(false)
const profileError = ref('')
const passwordLoading = ref(false)
const passwordError = ref('')

onMounted(() => {
  if (authStore.user) {
    profileForm.value.name = authStore.user.name || ''
    profileForm.value.email = authStore.user.email || ''
  }
})

const handleUpdateProfile = async () => {
  profileLoading.value = true
  profileError.value = ''
  
  try {
    const response = await api.put('/v1/profile', profileForm.value)
    
    // Update user data in store
    authStore.user = response.data.data
    localStorage.setItem('user', JSON.stringify(response.data.data))
    
    toast({
      title: 'Berhasil!',
      description: 'Profil berhasil diperbarui',
    })
  } catch (err: any) {
    profileError.value = err.message || 'Gagal memperbarui profil'
  } finally {
    profileLoading.value = false
  }
}

const handleChangePassword = async () => {
  passwordLoading.value = true
  passwordError.value = ''
  
  if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
    passwordError.value = 'Password baru dan konfirmasi password tidak cocok'
    passwordLoading.value = false
    return
  }
  
  try {
    await api.put('/v1/profile/password', {
      current_password: passwordForm.value.current_password,
      new_password: passwordForm.value.new_password
    })
    
    toast({
      title: 'Berhasil!',
      description: 'Password berhasil diubah',
    })
    
    // Reset form
    passwordForm.value = {
      current_password: '',
      new_password: '',
      confirm_password: ''
    }
  } catch (err: any) {
    passwordError.value = err.message || 'Gagal mengubah password'
  } finally {
    passwordLoading.value = false
  }
}
</script>
