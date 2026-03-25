import { api } from '@/services/api.service'

export const MitraTopupService = {
  fetchTopups(page = 1, perPage = 10) {
    return api.get('/topups', { params: { page, per_page: perPage } })
  },

  createTopup(form: FormData) {
    return api.post('/topups', form)
  },
}
