export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'mitra'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface AuthState {
  isLoggedIn: boolean
  token: string | null
  user: User | null
}
