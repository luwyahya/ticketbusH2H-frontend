import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    redirect: '/admin/dashboard',
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/Admin/AdminDashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/mitra',
    name: 'MitraManagement',
    component: () => import('@/views/Admin/MitraManagement.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/mitra/add',
    name: 'AddMitra',
    component: () => import('@/views/Admin/AddMitra.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: () => import('@/views/Admin/UserManagement.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/roles',
    name: 'RoleManagement',
    component: () => import('@/views/Admin/RoleManagement.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/role-permission',
    name: 'RolePermission',
    component: () => import('@/views/Admin/RolePermissionView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/reports',
    name: 'Reports',
    component: () => import('@/views/Admin/ReportView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/profile',
    name: 'AdminProfile',
    component: () => import('@/views/Admin/AdminProfile.vue'),
    meta: { requiresAuth: true },
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if route requires auth and user is not authenticated
    next({ name: 'Login' })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    // Redirect to admin dashboard if user is already authenticated
    next({ name: 'AdminDashboard' })
  } else {
    next()
  }
})

export default router
