import { api } from '@/services/api.service'

interface SearchPayload {
  origin: string
  destination: string
  travel_date: string
}

interface Passenger {
  name: string
  identity_number: string
}

interface BookPayload {
  provider_code: string
  travel_date: string
  seats: string[]
  passengers: Passenger[]
}

export default {

  // 🔎 Search schedule
  search(payload: SearchPayload) {
    return api.post('/transactions/search', payload)
  },

  // 🪑 Seat Map
  seatMap(provider_code: string) {
    return api.post('/transactions/seat-map', { provider_code })
  },

  // 📦 Book transaction (status: pending)
  book(payload: BookPayload) {
    return api.post('/transactions/book', payload)
  },

  // 💳 Pay transaction (potong saldo)
  pay(trx_code: string) {
    return api.post('/transactions/pay', { trx_code })
  },

  // 🎟 Issue ticket (fee masuk balance)
  issue(trx_code: string) {
    return api.post(`/transactions/${trx_code}/issue`)
  },

  // ❌ Cancel transaction (refund jika paid)
  cancel(trx_code: string, reason?: string) {
    return api.post(`/transactions/${trx_code}/cancel`, { reason })
  },

  // 📄 Detail transaction
  detail(trx_code: string) {
    return api.get(`/transactions/${trx_code}`)
  }

}
