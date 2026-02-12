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
    redirect: '/login',
  },

  // ===== ADMIN =====
  {
    path: '/admin/dashboard',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/mitra',
    component: () => import('@/views/admin/MitraManagement.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/mitra/add',
    component: () => import('@/views/admin/AddMitra.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/mitra/:id',
    component: () => import('@/views/admin/MitraDetail.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/topup-approval',
    component: () => import('@/views/admin/TopupApproval.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/users',
    component: () => import('@/views/admin/UserManagement.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/role-management',
    component: () => import('@/views/admin/RoleManagement.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/role-permissions',
    component: () => import('@/views/admin/RolePermissions.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/reports',
    component: () => import('@/views/admin/ReportView.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/profile',
    component: () => import('@/views/admin/AdminProfile.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },

  // ===== MITRA =====
  {
    path: '/mitra/dashboard',
    component: () => import('@/views/mitra/DashboardMitra.vue'),
    meta: { requiresAuth: true, role: 'mitra' },
  },
  {
    path: '/mitra/topup',
    component: () => import('@/views/mitra/TopupMitra.vue'),
    meta: { requiresAuth: true, role: 'mitra' },
  },
    {
    path: '/mitra/transaksi',
    name: 'TransaksiMitra',
    component: () => import('@/views/mitra/TransaksiMitra.vue'),
    meta: { requiresAuth: true, role: 'mitra' },
  },


  // ===== OTHER =====
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/ProductView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  if (to.path === '/login' && auth.isAuthenticated) {
    if (auth.user?.role === 'admin') return next('/admin/dashboard')
    if (auth.user?.role === 'mitra') return next('/mitra/dashboard')
  }

  if (to.meta.role && auth.user?.role !== to.meta.role) {
    if (auth.user?.role === 'admin') return next('/admin/dashboard')
    if (auth.user?.role === 'mitra') return next('/mitra/dashboard')
    return next('/login')
  }

  next()
})

export default router
