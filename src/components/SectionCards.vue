<script setup lang="ts">
import { computed } from 'vue'
import { useProductStore } from '@/stores/product.store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-vue-next'

const productStore = useProductStore()

const totalProducts = computed(() => productStore.pagination.total || 0)

const totalRevenue = computed(() => {
  const total = productStore.items.reduce((sum, product) => {
    return sum + (product.price * product.stock)
  }, 0)
  return total.toFixed(2)
})

const lowStockItems = computed(() => {
  return productStore.items.filter(product => product.stock < 10).length
})

const averagePrice = computed(() => {
  if (productStore.items.length === 0) return '0.00'
  const total = productStore.items.reduce((sum, product) => sum + product.price, 0)
  return (total / productStore.items.length).toFixed(2)
})

const cards = computed(() => [
  {
    title: 'Total Products',
    value: totalProducts.value,
    icon: Package,
    description: 'Total items in inventory',
  },
  {
    title: 'Total Revenue',
    value: `$${totalRevenue.value}`,
    icon: DollarSign,
    description: 'Total inventory value',
  },
  {
    title: 'Low Stock Items',
    value: lowStockItems.value,
    icon: AlertTriangle,
    description: 'Items with stock < 10',
  },
  {
    title: 'Average Price',
    value: `$${averagePrice.value}`,
    icon: TrendingUp,
    description: 'Average product price',
  },
])
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 lg:px-6">
    <Card v-for="card in cards" :key="card.title">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">
          {{ card.title }}
        </CardTitle>
        <component :is="card.icon" class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ card.value }}</div>
        <p class="text-xs text-muted-foreground">
          {{ card.description }}
        </p>
      </CardContent>
    </Card>
  </div>
</template>
