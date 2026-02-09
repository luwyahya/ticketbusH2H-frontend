<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  Home,
  Wallet,
  Ticket,
  BarChart3,
  Store,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const navigationItems = [
  {
    title: 'Dashboard',
    icon: Home,
    path: '/mitra/dashboard',
  },
  {
    title: 'Top Up Saldo',
    icon: Wallet,
    path: '/mitra/topup',
  },
  {
    title: 'Transaksi',
    icon: Ticket,
    path: '/mitra/transaksi',
  },
  {
    title: 'Laporan',
    icon: BarChart3,
    path: '/mitra/laporan',
  },
]
</script>

<template>
  <Sidebar collapsible="icon">
    <!-- HEADER -->
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <div class="flex items-center gap-2">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg
                       bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <Store class="size-4" />
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-semibold">Mitra Ticket</span>
                <span class="text-xs">Partner Panel</span>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <!-- CONTENT -->
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="item in navigationItems"
              :key="item.path"
            >
              <SidebarMenuButton
                :is-active="route.path.startsWith(item.path)"
                as-child
              >
                <a
                  :href="item.path"
                  @click.prevent="router.push(item.path)"
                >
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <!-- FOOTER -->
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div class="flex items-center gap-2">
              <div
                class="flex aspect-square size-8 items-center justify-center
                       rounded-lg bg-muted text-muted-foreground"
              >
                <span class="text-sm font-semibold">M</span>
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="text-sm font-medium">Nama Mitra</span>
                <span class="text-xs text-muted-foreground">
                  saldo: Rp 0
                </span>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
