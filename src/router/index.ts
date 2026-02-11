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
    component: () => import('@/views/admin/DashboardAdmin.vue'),
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
