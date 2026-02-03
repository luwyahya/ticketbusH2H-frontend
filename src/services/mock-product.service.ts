import type { Product } from '@/types/product.types'
import type { LaravelApiResponse } from '@/types/api.types'

// Mock products data
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Laptop Pro 2024',
    description: 'High-performance laptop for professionals',
    price: 1299.99,
    stock: 15,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    price: 29.99,
    stock: 150,
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical gaming keyboard',
    price: 89.99,
    stock: 75,
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z',
  },
  {
    id: 4,
    name: '4K Monitor',
    description: '27-inch 4K UHD monitor',
    price: 399.99,
    stock: 25,
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z',
  },
  {
    id: 5,
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub adapter',
    price: 49.99,
    stock: 200,
    created_at: '2024-01-19T10:00:00Z',
    updated_at: '2024-01-19T10:00:00Z',
  },
  {
    id: 6,
    name: 'Webcam HD',
    description: '1080p HD webcam with microphone',
    price: 79.99,
    stock: 60,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 7,
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness',
    price: 34.99,
    stock: 100,
    created_at: '2024-01-21T10:00:00Z',
    updated_at: '2024-01-21T10:00:00Z',
  },
  {
    id: 8,
    name: 'Phone Stand',
    description: 'Adjustable aluminum phone stand',
    price: 19.99,
    stock: 250,
    created_at: '2024-01-22T10:00:00Z',
    updated_at: '2024-01-22T10:00:00Z',
  },
  {
    id: 9,
    name: 'Laptop Sleeve',
    description: 'Protective laptop sleeve 15-inch',
    price: 24.99,
    stock: 180,
    created_at: '2024-01-23T10:00:00Z',
    updated_at: '2024-01-23T10:00:00Z',
  },
  {
    id: 10,
    name: 'Cable Organizer',
    description: 'Desktop cable management organizer',
    price: 14.99,
    stock: 300,
    created_at: '2024-01-24T10:00:00Z',
    updated_at: '2024-01-24T10:00:00Z',
  },
  {
    id: 11,
    name: 'Wireless Charger',
    description: 'Fast wireless charging pad',
    price: 39.99,
    stock: 120,
    created_at: '2024-01-25T10:00:00Z',
    updated_at: '2024-01-25T10:00:00Z',
  },
  {
    id: 12,
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker',
    price: 59.99,
    stock: 90,
    created_at: '2024-01-26T10:00:00Z',
    updated_at: '2024-01-26T10:00:00Z',
  },
]

let products = [...mockProducts]
let nextId = 13

export const mockProductService = {
  async getProducts(page: number = 1, perPage: number = 10): Promise<LaravelApiResponse<Product[]>> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const start = (page - 1) * perPage
    const end = start + perPage
    const paginatedProducts = products.slice(start, end)

    return {
      data: paginatedProducts,
      meta: {
        current_page: page,
        from: start + 1,
        last_page: Math.ceil(products.length / perPage),
        path: '/api/products',
        per_page: perPage,
        to: end > products.length ? products.length : end,
        total: products.length,
      },
      links: {
        first: '/api/products?page=1',
        last: `/api/products?page=${Math.ceil(products.length / perPage)}`,
        prev: page > 1 ? `/api/products?page=${page - 1}` : null,
        next: page < Math.ceil(products.length / perPage) ? `/api/products?page=${page + 1}` : null,
      },
    }
  },

  async getProduct(id: number): Promise<LaravelApiResponse<Product>> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const product = products.find((p) => p.id === id)
    if (!product) {
      throw new Error('Product not found')
    }

    return {
      data: product,
    }
  },

  async createProduct(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<LaravelApiResponse<Product>> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newProduct: Product = {
      id: nextId++,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    products.unshift(newProduct)

    return {
      data: newProduct,
    }
  },

  async updateProduct(id: number, data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<LaravelApiResponse<Product>> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = products.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }

    products[index] = {
      ...products[index],
      ...data,
      updated_at: new Date().toISOString(),
    }

    return {
      data: products[index],
    }
  },

  async deleteProduct(id: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = products.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }

    products.splice(index, 1)
  },
}
