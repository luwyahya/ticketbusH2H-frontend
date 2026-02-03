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
          <!-- Page Header -->
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold tracking-tight">Products</h1>
              <p class="text-muted-foreground mt-1">
                Manage your product inventory
              </p>
            </div>
            <Dialog v-model:open="dialogOpen">
              <DialogTrigger as-child>
                <Button @click="openCreateDialog">
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>{{ editingProduct ? 'Edit Product' : 'Create Product' }}</DialogTitle>
                <DialogDescription>
                  {{ editingProduct ? 'Update product information' : 'Add a new product to your inventory' }}
                </DialogDescription>
                <form @submit.prevent="handleSubmit" class="space-y-4 mt-4">
                  <div class="space-y-2">
                    <Label for="name">Name</Label>
                    <Input
                      id="name"
                      v-model="formData.name"
                      placeholder="Product name"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <Label for="description">Description</Label>
                    <Input
                      id="description"
                      v-model="formData.description"
                      placeholder="Product description"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <Label for="price">Price</Label>
                    <Input
                      id="price"
                      v-model.number="formData.price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <Label for="stock">Stock</Label>
                    <Input
                      id="stock"
                      v-model.number="formData.stock"
                      type="number"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div class="flex gap-2 justify-end">
                    <Button type="button" variant="outline" @click="dialogOpen = false">
                      Cancel
                    </Button>
                    <Button type="submit" :disabled="productStore.loading">
                      {{ productStore.loading ? 'Saving...' : 'Save' }}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <!-- Analytics Cards -->
          <SectionCards />

          <!-- Products Table -->
          <Card>
            <CardContent class="p-0">
              <div v-if="productStore.loading && productStore.items.length === 0" class="flex items-center justify-center p-12">
                <p class="text-muted-foreground">Loading products...</p>
              </div>

              <div v-else-if="productStore.items.length === 0" class="flex flex-col items-center justify-center p-12">
                <p class="text-muted-foreground mb-4">No products found</p>
                <Button @click="openCreateDialog">Add your first product</Button>
              </div>

              <div v-else>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead class="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="product in productStore.items" :key="product.id">
                      <TableCell class="font-medium">{{ product.id }}</TableCell>
                      <TableCell>{{ product.name }}</TableCell>
                      <TableCell>{{ product.description }}</TableCell>
                      <TableCell>${{ product.price.toFixed(2) }}</TableCell>
                      <TableCell>{{ product.stock }}</TableCell>
                      <TableCell class="text-right">
                        <div class="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            @click="openEditDialog(product)"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            @click="handleDelete(product.id)"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <!-- Pagination -->
                <div class="flex items-center justify-between border-t p-4">
                  <div class="text-sm text-muted-foreground">
                    Page {{ productStore.pagination.current_page }} of {{ productStore.pagination.last_page }}
                    ({{ productStore.pagination.total }} total items)
                  </div>
                  <div class="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      :disabled="productStore.pagination.current_page === 1"
                      @click="productStore.prevPage()"
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      :disabled="productStore.pagination.current_page === productStore.pagination.last_page"
                      @click="productStore.nextPage()"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useProductStore } from '@/stores/product.store'
import type { Product, ProductFormData } from '@/types/product.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SectionCards from '@/components/SectionCards.vue'

const productStore = useProductStore()

const dialogOpen = ref(false)
const editingProduct = ref<Product | null>(null)
const formData = reactive<ProductFormData>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
})

const resetForm = () => {
  formData.name = ''
  formData.description = ''
  formData.price = 0
  formData.stock = 0
  editingProduct.value = null
}

const openCreateDialog = () => {
  resetForm()
  dialogOpen.value = true
}

const openEditDialog = (product: Product) => {
  editingProduct.value = product
  formData.name = product.name
  formData.description = product.description
  formData.price = product.price
  formData.stock = product.stock
  dialogOpen.value = true
}

const handleSubmit = async () => {
  try {
    if (editingProduct.value) {
      await productStore.updateProduct(editingProduct.value.id, formData)
    } else {
      await productStore.createProduct(formData)
    }
    dialogOpen.value = false
    resetForm()
  } catch (error) {
    console.error('Failed to save product:', error)
    alert('Failed to save product. Please try again.')
  }
}

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await productStore.deleteProduct(id)
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product. Please try again.')
    }
  }
}

onMounted(() => {
  productStore.fetchProducts()
})
</script>

