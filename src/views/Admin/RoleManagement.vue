<template>
  <SidebarProvider :style="{ '--sidebar-width': '16rem', '--header-height': '3rem' }">
    <AppSidebar />
    <SidebarInset>
      <SiteHeader />
      
      <div class="flex flex-1 flex-col">
        <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Role & Permission</h1>
            <p class="text-muted-foreground mt-1">Kelola role dan permission sistem</p>
          </div>

          <div v-if="roleStore.loading" class="flex items-center justify-center py-8">
            <p class="text-muted-foreground">Loading...</p>
          </div>

          <div v-else class="space-y-6">
            <!-- Roles List -->
            <div class="grid gap-4">
              <Card v-for="role in roleStore.roles" :key="role.id">
                <CardHeader>
                  <div class="flex items-center justify-between">
                    <div>
                      <CardTitle>{{ role.nama }}</CardTitle>
                      <CardDescription>
                        {{ role.permissions.length }} permissions assigned
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      @click="editRole(role)"
                    >
                      <Settings class="h-4 w-4 mr-2" />
                      Edit Permissions
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div class="flex flex-wrap gap-2">
                    <Badge 
                      v-for="permission in role.permissions.slice(0, 5)" 
                      :key="permission.id"
                      variant="secondary"
                      class="text-xs"
                    >
                      {{ permission.description }}
                    </Badge>
                    <Badge 
                      v-if="role.permissions.length > 5"
                      variant="outline"
                      class="text-xs"
                    >
                      +{{ role.permissions.length - 5 }} more
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>

    <!-- Edit Role Permissions Dialog -->
    <Dialog v-model:open="showEditDialog">
      <DialogContent class="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogTitle>Edit Permissions - {{ selectedRole?.nama }}</DialogTitle>
        <div v-if="selectedRole" class="space-y-6">
          <!-- Permissions by Module -->
          <div v-for="module in groupedPermissions" :key="module.name" class="space-y-3">
            <h3 class="text-lg font-semibold">{{ module.name }}</h3>
            <div class="grid gap-3">
              <div 
                v-for="permission in module.permissions" 
                :key="permission.id"
                class="flex items-center justify-between p-3 border rounded-lg"
              >
                <div class="flex-1">
                  <div class="font-medium">{{ permission.description }}</div>
                  <div class="text-sm text-muted-foreground">{{ permission.nama }}</div>
                </div>
                <Switch
                  :checked="isPermissionAssigned(permission.id)"
                  @update:checked="togglePermission(permission.id, $event)"
                />
              </div>
            </div>
          </div>

          <div class="flex gap-2 pt-4 border-t">
            <Button @click="savePermissions" :disabled="roleStore.loading">
              {{ roleStore.loading ? 'Saving...' : 'Save Changes' }}
            </Button>
            <Button variant="outline" @click="showEditDialog = false">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import { Settings } from 'lucide-vue-next'
import { useRoleStore } from '@/stores/role.store'
import type { Role } from '@/types/role.types'

const roleStore = useRoleStore()
const showEditDialog = ref(false)
const selectedRole = ref<Role | null>(null)
const selectedPermissions = ref<number[]>([])

onMounted(() => {
  roleStore.fetchRoles()
  roleStore.fetchPermissions()
})

const groupedPermissions = computed(() => {
  const groups = new Map()
  
  roleStore.permissions.forEach(permission => {
    if (!groups.has(permission.module)) {
      groups.set(permission.module, {
        name: permission.module,
        permissions: []
      })
    }
    groups.get(permission.module).permissions.push(permission)
  })
  
  return Array.from(groups.values())
})

const editRole = (role: Role) => {
  selectedRole.value = role
  selectedPermissions.value = role.permissions.map(p => p.id)
  showEditDialog.value = true
}

const isPermissionAssigned = (permissionId: number) => {
  return selectedPermissions.value.includes(permissionId)
}

const togglePermission = (permissionId: number, checked: boolean) => {
  if (checked) {
    selectedPermissions.value.push(permissionId)
  } else {
    selectedPermissions.value = selectedPermissions.value.filter(id => id !== permissionId)
  }
}

const savePermissions = async () => {
  if (!selectedRole.value) return
  
  try {
    await roleStore.updateRolePermissions(selectedRole.value.id, selectedPermissions.value)
    showEditDialog.value = false
  } catch (error) {
    console.error('Failed to save permissions:', error)
  }
}
</script>