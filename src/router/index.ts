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
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/mitra/DashboardMitra.vue'),
    meta: { requiresAuth: true },
  },
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
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if route requires auth and user is not authenticated
    next({ name: 'Login' })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    // Redirect to dashboard if user is already authenticated
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
