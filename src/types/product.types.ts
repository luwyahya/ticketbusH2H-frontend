export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  created_at?: string
  updated_at?: string
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  stock: number
}

export interface ProductState {
  items: Product[]
  loading: boolean
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
