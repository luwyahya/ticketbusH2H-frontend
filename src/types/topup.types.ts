export interface Topup {
  id: number
  amount: number
  payment_method: 'transfer' | 'va' | 'ewallet'
  status: 'pending' | 'success' | 'rejected'
  created_at: string
}
