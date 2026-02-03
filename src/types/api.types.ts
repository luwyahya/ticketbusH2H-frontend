// Generic Laravel API Resource response format
export interface LaravelApiResponse<T> {
  data: T
  meta?: PaginationMeta
  links?: PaginationLinks
}

// Pagination metadata from Laravel
export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  path: string
  per_page: number
  to: number | null
  total: number
}

// Pagination links
export interface PaginationLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

// Generic API error response
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
