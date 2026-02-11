<template>
  <SidebarProvider
    :style="{
      '--sidebar-width': '16rem',
      '--header-height': '3rem',
    }"
  >
    <AppSidebar />
    <SidebarInset>
      <SiteHeader />
      
      <div class="flex flex-1 flex-col">
        <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold tracking-tight">Role & Permission</h1>
              <p class="text-muted-foreground mt-1">
                Kelola role dan permission sistem
              </p>
            </div>
            <Button @click="openCreateDialog">
              <Plus class="mr-2 h-4 w-4" />
              Tambah Role
            </Button>
          </div>

          <!-- Roles Table -->
          <Card>
            <CardHeader>
              <CardTitle>Daftar Role</CardTitle>
              <CardDescription>Kelola permission untuk setiap role</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Role</TableHead>
                    <TableHead>Jumlah Permission</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="role in roleStore.roles" :key="role.id">
                    <TableCell class="font-medium">{{ role.name }}</TableCell>
                    <TableCell>
                      <Badge>{{ role.permissions.length }} permissions</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" @click="openPermissionDialog(role)">
                        Kelola Permission
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>

    <!-- Create Role Dialog -->
    <Dialog v-model:open="showCreateDialog">
      <DialogContent>
        <DialogTitle>Tambah Role Baru</DialogTitle>
        <DialogDescription>Buat role baru untuk sistem</DialogDescription>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="roleName">Nama Role</Label>
            <Input
              id="roleName"
              v-model="formData.name"
              placeholder="Masukkan nama role"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <Button variant="outline" @click="showCreateDialog = false">Batal</Button>
          <Button @click="handleCreateRole" :disabled="!formData.name">Simpan</Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Permission Management Dialog -->
    <Dialog v-model:open="showPermissionDialog">
      <DialogContent class="max-w-2xl">
        <DialogTitle>Kelola Permission - {{ selectedRole?.name }}</DialogTitle>
        <DialogDescription>Toggle permission untuk role ini</DialogDescription>
        <div class="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <div 
            v-for="permission in availablePermissions" 
            :key="permission.id"
            class="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
          >
            <div class="flex-1">
              <div class="font-medium">{{ permission.name }}</div>
              <div v-if="permission.description" class="text-sm text-muted-foreground">
                {{ permission.description }}
              </div>
            </div>
            <Switch
              :checked="isPermissionActive(permission.id)"
              @update:checked="(checked) => togglePermission(checked, permission.id)"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <Button variant="outline" @click="showPermissionDialog = false">Batal</Button>
          <Button @click="handleSavePermissions">Simpan Perubahan</Button>
        </div>
      </DialogContent>
    </Dialog>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { Plus } from 'lucide-vue-next'
import { useRoleStore } from '@/stores/role.store'
import type { Role, Permission } from '@/types/role.types'

const roleStore = useRoleStore()

const showCreateDialog = ref(false)
const showPermissionDialog = ref(false)
const selectedRole = ref<Role | null>(null)
const selectedPermissions = ref<number[]>([])

const formData = ref({
  name: '',
})

const availablePermissions = ref<Permission[]>([
  { id: 1, name: 'users.view', description: 'Lihat daftar user' },
  { id: 2, name: 'users.create', description: 'Tambah user baru' },
  { id: 3, name: 'users.edit', description: 'Edit data user' },
  { id: 4, name: 'users.delete', description: 'Hapus user' },
  { id: 5, name: 'roles.view', description: 'Lihat daftar role' },
  { id: 6, name: 'roles.manage', description: 'Kelola role dan permission' },
  { id: 7, name: 'transactions.view', description: 'Lihat transaksi' },
  { id: 8, name: 'transactions.approve', description: 'Approve transaksi' },
  { id: 9, name: 'reports.view', description: 'Lihat laporan' },
  { id: 10, name: 'reports.export', description: 'Export laporan' },
])

onMounted(() => {
  roleStore.fetchRoles()
})

const openCreateDialog = () => {
  formData.value.name = ''
  showCreateDialog.value = true
}

const openPermissionDialog = (role: Role) => {
  selectedRole.value = { ...role }
  selectedPermissions.value = [...role.permissions.map(p => p.id)]
  showPermissionDialog.value = true
}

const isPermissionActive = (permissionId: number) => {
  return selectedPermissions.value.includes(permissionId)
}

const togglePermission = (checked: boolean, permissionId: number) => {
  if (checked) {
    if (!selectedPermissions.value.includes(permissionId)) {
      selectedPermissions.value.push(permissionId)
    }
  } else {
    const index = selectedPermissions.value.indexOf(permissionId)
    if (index > -1) {
      selectedPermissions.value.splice(index, 1)
    }
  }
}

const handleCreateRole = async () => {
  await roleStore.createRole({
    name: formData.value.name,
    permissions: [],
  })
  showCreateDialog.value = false
}

const handleSavePermissions = async () => {
  if (selectedRole.value) {
    await roleStore.updateRolePermissions(selectedRole.value.id, selectedPermissions.value)
    showPermissionDialog.value = false
  }
}
</script>
