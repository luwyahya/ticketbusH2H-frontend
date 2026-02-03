# FE Netzme - Vue 3 + TypeScript + Shadcn-Vue Template

Template frontend modern dengan Vue 3, TypeScript, dan shadcn-vue dashboard-01 untuk aplikasi web enterprise dengan integrasi API Laravel.

## 📋 Daftar Isi

- [Tech Stack](#-tech-stack)
- [Struktur Proyek](#-struktur-proyek)
- [Setup & Instalasi](#-setup--instalasi)
- [Konfigurasi](#-konfigurasi)
- [Arsitektur API](#-arsitektur-api)
- [Komponen UI](#-komponen-ui)
- [Panduan Pengembangan](#-panduan-pengembangan)
- [Best Practices](#-best-practices)

## 🚀 Tech Stack

### Core Framework
- **Vue 3** (v3.4.21) - Progressive JavaScript Framework dengan Composition API
- **TypeScript** (v5.4.3) - Typed superset of JavaScript
- **Vite** (v5.2.0) - Next Generation Frontend Tooling

### State Management & Routing
- **Pinia** (v2.1.7) - Vue Store yang ringan dan intuitif
- **Vue Router** (v4.3.0) - Official router untuk Vue.js

### UI & Styling
- **shadcn-vue** - High-quality & accessible components
- **Tailwind CSS** (v3.4.1) - Utility-first CSS framework
- **Radix Vue** (v1.6.3) - Unstyled, accessible component primitives
- **Lucide Vue Next** (v0.365.0) - Beautiful & consistent icons

### HTTP Client
- **Axios** (v1.6.8) - Promise-based HTTP client

### Utilities
- **@vueuse/core** (v10.11.1) - Collection of essential Vue Composition Utilities
- **clsx** & **tailwind-merge** - Utility untuk menggabungkan class Tailwind

## 📁 Struktur Proyek

```
FE Netzme/
├── src/
│   ├── components/           # Komponen reusable
│   │   ├── ui/              # Shadcn-vue components
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── dialog/
│   │   │   ├── input/
│   │   │   ├── label/
│   │   │   ├── table/
│   │   │   ├── sidebar/
│   │   │   ├── breadcrumb/
│   │   │   ├── dropdown-menu/
│   │   │   ├── avatar/
│   │   │   └── ...
│   │   ├── AppSidebar.vue   # Sidebar navigasi utama
│   │   ├── SiteHeader.vue   # Header dengan breadcrumb & user menu
│   │   └── SectionCards.vue # Analytics cards untuk dashboard
│   │
│   ├── views/               # Halaman/Pages
│   │   ├── LoginView.vue    # Halaman login
│   │   ├── DashboardView.vue # Halaman dashboard
│   │   └── ProductView.vue  # Halaman CRUD products
│   │
│   ├── stores/              # Pinia stores (State Management)
│   │   ├── auth.store.ts    # Authentication state
│   │   ├── product.store.ts # Product CRUD state
│   │   └── index.ts         # Store exports
│   │
│   ├── services/            # API Services
│   │   ├── api.service.ts   # Axios instance & interceptors
│   │   ├── auth.service.ts  # Authentication API calls
│   │   └── product.service.ts # Product CRUD API calls
│   │
│   ├── types/               # TypeScript Types
│   │   ├── api.types.ts     # API response types
│   │   ├── auth.types.ts    # Auth-related types
│   │   └── product.types.ts # Product types
│   │
│   ├── router/              # Vue Router configuration
│   │   └── index.ts         # Route definitions & guards
│   │
│   ├── lib/                 # Utilities
│   │   └── utils.ts         # Helper functions (cn, etc.)
│   │
│   ├── App.vue              # Root component
│   ├── main.ts              # Application entry point
│   └── style.css            # Global styles & Tailwind directives
│
├── public/                  # Static assets
├── .env.example             # Environment variables template
├── components.json          # Shadcn-vue configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies & scripts
```

## 🛠️ Setup & Instalasi

### Prerequisites
- **Node.js**: >= 18.x
- **npm** atau **yarn** atau **pnpm**

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd "FE Netzme"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Aplikasi akan berjalan di `http://localhost:5173`

5. **Build untuk Production**
   ```bash
   npm run build
   ```

6. **Preview Production Build**
   ```bash
   npm run preview
   ```

## ⚙️ Konfigurasi

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL untuk API backend | `http://localhost:8000/api` |

### Tailwind Configuration

File: `tailwind.config.js`

Template ini menggunakan Tailwind CSS dengan custom configuration untuk shadcn-vue:
- Custom colors dari CSS variables
- `tailwindcss-animate` untuk animations
- Responsive breakpoints sesuai kebutuhan

### shadcn-vue Configuration

File: `components.json`

```json
{
  "style": "new-york",
  "baseColor": "neutral",
  "cssVariables": true
}
```

## 🔌 Arsitektur API

### API Service (`src/services/api.service.ts`)

Axios instance dengan interceptors untuk handle authentication dan error handling.

#### Features:
- ✅ Auto-attach Bearer token ke setiap request
- ✅ Auto-redirect ke login pada 401 Unauthorized
- ✅ Centralized error handling
- ✅ TypeScript support

#### Usage:

```typescript
import { api } from '@/services/api.service'

// GET request
const response = await api.get('/endpoint')

// POST request
const response = await api.post('/endpoint', data)

// PUT request
const response = await api.put('/endpoint/:id', data)

// DELETE request
const response = await api.delete('/endpoint/:id')
```

### Authentication Flow

#### 1. **Login** (`src/stores/auth.store.ts`)

```typescript
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

// Login
await authStore.login(email, password)
// Token disimpan otomatis di localStorage
// User data disimpan di store
```

#### 2. **Auto-Login** (Route Guard)

```typescript
// src/router/index.ts
router.beforeEach((to) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }
})
```

#### 3. **Logout**

```typescript
authStore.logout()
// Clear token & user data
// Redirect ke login
```

### CRUD Operations Pattern

Template ini menggunakan pattern **Service → Store → Component**

#### Example: Product CRUD

**1. Service Layer** (`src/services/product.service.ts`)
```typescript
class ProductService {
  async getProducts(page: number, perPage: number) {
    const response = await api.get('/products', {
      params: { page, per_page: perPage }
    })
    return response.data
  }

  async createProduct(data: ProductFormData) {
    const response = await api.post('/products', data)
    return response.data
  }

  async updateProduct(id: number, data: ProductFormData) {
    const response = await api.put(`/products/${id}`, data)
    return response.data
  }

  async deleteProduct(id: number) {
    const response = await api.delete(`/products/${id}`)
    return response.data
  }
}
```

**2. Store Layer** (`src/stores/product.store.ts`)
```typescript
export const useProductStore = defineStore('product', {
  state: () => ({
    items: [],
    loading: false,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    },
  }),

  actions: {
    async fetchProducts(page = 1, perPage = 10) {
      this.loading = true
      try {
        const response = await productService.getProducts(page, perPage)
        this.items = response.data
        this.pagination = response.meta
      } finally {
        this.loading = false
      }
    },
    
    async createProduct(data: ProductFormData) {
      await productService.createProduct(data)
      await this.fetchProducts() // Refresh data
    },
    
    // ... update, delete
  }
})
```

**3. Component Layer** (`src/views/ProductView.vue`)
```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/product.store'

const productStore = useProductStore()

onMounted(() => {
  productStore.fetchProducts()
})

const handleCreate = async (formData) => {
  await productStore.createProduct(formData)
}
</script>
```

### API Response Format (Laravel Standard)

Template ini kompatibel dengan Laravel API Resource format:

```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50
  }
}
```

## 🎨 Komponen UI

### Layout Components

#### 1. **SidebarProvider** (Dashboard Layout)

Layout wrapper untuk dashboard dengan sidebar

```vue
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
      <!-- Main Content -->
      <div class="flex flex-1 flex-col">
        <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          <!-- Your content here -->
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
```

#### 2. **AppSidebar** (Navigation)

Sidebar dengan navigasi & user profile

Features:
- Collapsible/expandable
- Active route highlighting
- User profile display
- Icon-only mode

#### 3. **SiteHeader** (Top Bar)

Header dengan breadcrumb, search, dan user menu

Features:
- Dynamic breadcrumb navigation
- Sidebar toggle button
- User dropdown menu
- Search button (placeholder)

### shadcn-vue Components

#### Button

```vue
<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

| Variant | Description |
|---------|-------------|
| `default` | Primary button |
| `destructive` | Untuk aksi berbahaya (delete) |
| `outline` | Button dengan border |
| `ghost` | Button transparan |
| `link` | Text link style |

#### Card

```vue
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

#### Dialog (Modal)

```vue
<Dialog v-model:open="dialogOpen">
  <DialogTrigger as-child>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Dialog Title</DialogTitle>
    <DialogDescription>Description</DialogDescription>
    <!-- Dialog content -->
  </DialogContent>
</Dialog>
```

#### Table

```vue
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow v-for="item in items" :key="item.id">
      <TableCell>{{ item.name }}</TableCell>
      <TableCell>{{ item.value }}</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### Input & Form

```vue
<div class="space-y-2">
  <Label for="email">Email</Label>
  <Input
    id="email"
    v-model="email"
    type="email"
    placeholder="Enter your email"
  />
</div>
```

#### Dropdown Menu

```vue
<DropdownMenu>
  <DropdownMenuTrigger as-child>
    <Button>Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuItem>Item 2</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Item 3</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Menambah Component Baru dari shadcn-vue

```bash
npx shadcn-vue@latest add [component-name]
```

Example:
```bash
npx shadcn-vue@latest add select
npx shadcn-vue@latest add checkbox
npx shadcn-vue@latest add tabs
```

Lihat komponen tersedia di: https://www.shadcn-vue.com/docs/components

## 👨‍💻 Panduan Pengembangan

### Menambah Halaman Baru

#### 1. Buat View File

`src/views/NewPageView.vue`

```vue
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
          <div>
            <h1 class="text-3xl font-bold tracking-tight">New Page</h1>
            <p class="text-muted-foreground mt-1">
              Page description
            </p>
          </div>

          <!-- Your content here -->
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
</script>
```

#### 2. Tambahkan Route

`src/router/index.ts`

```typescript
{
  path: '/new-page',
  name: 'NewPage',
  component: () => import('@/views/NewPageView.vue'),
  meta: { requiresAuth: true }
}
```

#### 3. Tambahkan ke Sidebar Navigation

`src/components/AppSidebar.vue`

```typescript
import { Home, Package, NewIcon } from 'lucide-vue-next'

const navigationItems = [
  {
    title: 'Dashboard',
    icon: Home,
    path: '/dashboard',
  },
  {
    title: 'Products',
    icon: Package,
    path: '/products',
  },
  {
    title: 'New Page',
    icon: NewIcon,
    path: '/new-page',
  },
]
```

#### 4. Update Breadcrumb (Optional)

`src/components/SiteHeader.vue`

```typescript
const currentPageName = computed(() => {
  const path = route.path
  if (path === '/dashboard') return 'Dashboard'
  if (path === '/products') return 'Products'
  if (path === '/new-page') return 'New Page'
  return 'Page'
})
```

### Menambah CRUD Module Baru

Ikuti pattern yang sama dengan Product CRUD:

1. **Buat Types** (`src/types/module.types.ts`)
2. **Buat Service** (`src/services/module.service.ts`)
3. **Buat Store** (`src/stores/module.store.ts`)
4. **Buat View** (duplikasi `ProductView.vue` dan sesuaikan)

## 📝 Best Practices

### 1. TypeScript

✅ **DO**: Gunakan type untuk semua API response
```typescript
interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
}
```

❌ **DON'T**: Menggunakan `any`

### 2. Composition API

✅ **DO**: Gunakan Composition API dengan `<script setup>`
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>
```

### 3. State Management

✅ **DO**: Gunakan Pinia store untuk shared state  
✅ **DO**: Gunakan local `ref/reactive` untuk component-specific state

### 4. API Calls

✅ **DO**: Semua API calls melalui service layer  
✅ **DO**: Handle loading & error states

### 5. CSS & Styling

✅ **DO**: Gunakan Tailwind utility classes  
✅ **DO**: Gunakan shadcn-vue components  
❌ **DON'T**: Custom CSS jika bisa pakai Tailwind

## 🔧 Troubleshooting

### CORS Issues

Jika mengalami CORS error, pastikan backend Laravel sudah setup CORS:

```php
// config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:5173'],
```

### 401 Unauthorized Loop

Pastikan Route Guard tidak redirect halaman login:

```typescript
// src/router/index.ts
if (to.path === '/login' && authStore.isAuthenticated) {
  return '/dashboard'
}
```

### Component Not Found

Jika shadcn component tidak ditemukan, install ulang:

```bash
npx shadcn-vue@latest add [component-name]
```

## 📚 Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [shadcn-vue Components](https://www.shadcn-vue.com/docs/components)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

## 📄 License

Private project - All rights reserved

---

**Dibuat dengan ❤️ menggunakan Vue 3 + shadcn-vue**
