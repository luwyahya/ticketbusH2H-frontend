export interface User {
  id: number
  nama: string
  email: string
  role: string
  instansi?: string
  status: string
  created_at: string
}

export interface UserFormData {
  nama: string
  email: string
  role: string
  instansi?: string
  password?: string
}