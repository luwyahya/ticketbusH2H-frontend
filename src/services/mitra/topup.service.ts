import { api } from '@/services/api.service'

export const MitraTopupService = {
  fetchTopups() {
    return api.get('/topups')
  },

  createTopup(form: FormData) {
    return api.post('/topups', form)
  },
}
