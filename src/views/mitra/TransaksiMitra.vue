<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import SiteHeader from '@/components/SiteHeader.vue'
import SidebarMitra from '@/components/SidebarMitra.vue'
import { useTransactionStore } from '@/stores/mitra/transaction.store'
import { useToast } from '@/components/ui/toast/use-toast'

const store = useTransactionStore()
const { toast } = useToast()

const origin = ref('')
const destination = ref('')
const today = new Date().toISOString().split('T')[0]
const travel_date = ref(today)
const selectedSchedule = ref<any>(null)
const selectedSeats = ref<string[]>([])

// Passenger form
const passengers = ref<Array<{name: string, identity_number: string}>>([])
const showPassengerForm = ref(false)

// Payment & Issue
const showPaymentDialog = ref(false)
const showIssueDialog = ref(false)
const currentTransaction = ref<any>(null)

const search = async () => {
  if (!origin.value || !destination.value || !travel_date.value) {
    toast({
      title: 'Error',
      description: 'Semua field pencarian wajib diisi',
      variant: 'destructive'
    })
    return
  }

  await store.search({
    origin: origin.value,
    destination: destination.value,
    travel_date: travel_date.value
  })
}

const selectSchedule = async (schedule: any) => {
  selectedSchedule.value = schedule
  selectedSeats.value = []
  await store.getSeatMap(schedule.provider_code)
}

const toggleSeat = (seat: any) => {
  if (seat.status === 'booked') return

  const index = selectedSeats.value.indexOf(seat.number)

  if (index > -1) {
    selectedSeats.value.splice(index, 1)
  } else {
    selectedSeats.value.push(seat.number)
  }
}

const isSelected = (seatNumber: string) => {
  return selectedSeats.value.includes(seatNumber)
}

// Step 3: Show passenger form
const proceedToPassengerForm = () => {
  if (selectedSeats.value.length === 0) {
    toast({
      title: 'Error',
      description: 'Pilih minimal 1 kursi',
      variant: 'destructive'
    })
    return
  }

  passengers.value = selectedSeats.value.map(() => ({
    name: '',
    identity_number: ''
  }))
  showPassengerForm.value = true
}

// Step 3: Book
const bookTicket = async () => {
  const isValid = passengers.value.every(p => p.name && p.identity_number)
  if (!isValid) {
    toast({
      title: 'Error',
      description: 'Lengkapi data semua penumpang',
      variant: 'destructive'
    })
    return
  }

  try {
    const result = await store.book({
      provider_code: selectedSchedule.value.provider_code,
      travel_date: travel_date.value,
      seats: selectedSeats.value,
      passengers: passengers.value
    })

    currentTransaction.value = result
    showPassengerForm.value = false
    showPaymentDialog.value = true

    toast({
      title: 'Booking Berhasil',
      description: `Kode: ${result.trx_code}`
    })
  } catch (error: any) {
    toast({
      title: 'Booking Gagal',
      description: error.message || 'Terjadi kesalahan',
      variant: 'destructive'
    })
  }
}

// Step 4: Pay
const payTransaction = async () => {
  try {
    const result = await store.pay(currentTransaction.value.trx_code)
    currentTransaction.value = result
    showPaymentDialog.value = false
    showIssueDialog.value = true

    toast({
      title: 'Pembayaran Berhasil',
      description: 'Silakan cetak tiket'
    })
  } catch (error: any) {
    toast({
      title: 'Pembayaran Gagal',
      description: error.message || 'Saldo tidak cukup',
      variant: 'destructive'
    })
  }
}

// Step 5: Issue
const issueTicket = async () => {
  try {
    const result = await store.issue(currentTransaction.value.trx_code)
    
    toast({
      title: 'Tiket Berhasil Dicetak',
      description: `Fee: Rp ${result.fee_earned?.toLocaleString('id-ID')}`
    })

    // Reset form
    showIssueDialog.value = false
    selectedSchedule.value = null
    selectedSeats.value = []
    currentTransaction.value = null
  } catch (error: any) {
    toast({
      title: 'Issue Gagal',
      description: error.message || 'Terjadi kesalahan',
      variant: 'destructive'
    })
  }
}

// Cancel transaction
const cancelTransaction = async () => {
  if (!confirm('Yakin ingin membatalkan transaksi?')) return

  try {
    await store.cancel(currentTransaction.value.trx_code, 'Dibatalkan oleh user')
    
    toast({
      title: 'Transaksi Dibatalkan',
      description: 'Refund akan diproses'
    })

    showPaymentDialog.value = false
    showIssueDialog.value = false
    currentTransaction.value = null
  } catch (error: any) {
    toast({
      title: 'Cancel Gagal',
      description: error.message || 'Terjadi kesalahan',
      variant: 'destructive'
    })
  }
}
</script>



<template>
  <SidebarProvider
    :style="{
      '--sidebar-width': '16rem',
      '--header-height': '3rem',
    }"
  >
    <SidebarMitra />
    <SidebarInset>
      <SiteHeader />

      <div class="flex flex-1 flex-col">
        <div class="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">

          <!-- PAGE HEADER -->
          <div>
            <h1 class="text-3xl font-bold tracking-tight">Transaksi Tiket</h1>
            <p class="text-muted-foreground mt-1">
              Cari dan lakukan pemesanan tiket bus.
            </p>
          </div>

          <!-- SEARCH CARD -->
          <Card>
            <CardHeader>
              <CardTitle>Pencarian Tiket</CardTitle>
              <CardDescription>
                Masukkan kota asal, tujuan, dan tanggal keberangkatan
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div class="grid md:grid-cols-4 gap-4">

                <input
                  v-model="origin"
                  placeholder="Kota Asal"
                  class="w-full rounded-md border px-3 py-2 text-sm"
                />

                <input
                  v-model="destination"
                  placeholder="Kota Tujuan"
                  class="w-full rounded-md border px-3 py-2 text-sm"
                />

                <input
                    v-model="travel_date"
                    type="date"
                    :min="today"
                    class="w-full rounded-md border px-3 py-2 text-sm"
                />


                <Button @click="search">
                  Cari
                </Button>

              </div>
            </CardContent>
          </Card>

          <!-- RESULT CARD -->
          <Card v-if="store.schedules.length">
            <CardHeader>
              <CardTitle>Hasil Pencarian</CardTitle>
              <CardDescription>
                Pilih jadwal yang tersedia
              </CardDescription>
            </CardHeader>

            <CardContent class="space-y-3">

              <div
                v-for="schedule in store.schedules"
                :key="schedule.provider_code"
                class="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <div class="font-medium">{{ schedule.route }}</div>
                  <div class="text-sm text-muted-foreground">
                    Berangkat: {{ schedule.departure_time }}
                  </div>
                  <div class="font-semibold mt-1">
                    Rp {{ Number(schedule.price).toLocaleString('id-ID') }}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  @click="selectSchedule(schedule)"
                >
                  Pilih
                </Button>
              </div>

            </CardContent>
          </Card>

          <!-- SEAT MAP CARD -->
          <Card v-if="store.seatMap.length">
            <CardHeader>
                <CardTitle>Seat Map</CardTitle>
                <CardDescription>
                Pilih kursi yang tersedia
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div class="flex flex-wrap gap-2">

                <div
                    v-for="seat in store.seatMap"
                    :key="seat.number"
                    @click="toggleSeat(seat)"
                    class="px-4 py-2 rounded-md border text-sm font-medium transition"
                    :class="[
                    seat.status === 'booked'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : isSelected(seat.number)
                        ? 'bg-blue-600 text-white'
                        : 'bg-green-100 text-green-700 cursor-pointer hover:bg-green-200'
                    ]"
                >
                    {{ seat.number }}
                </div>

                </div>

                <!-- SELECTED INFO -->
                <div v-if="selectedSeats.length" class="mt-4">
                  <div class="text-sm mb-2">
                    Kursi dipilih:
                    <span class="font-semibold">
                      {{ selectedSeats.join(', ') }}
                    </span>
                  </div>
                  <Button @click="proceedToPassengerForm">
                    Lanjut ke Data Penumpang
                  </Button>
                </div>
            </CardContent>
          </Card>

          <!-- PASSENGER FORM DIALOG -->
          <Dialog v-model:open="showPassengerForm">
            <DialogContent class="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogTitle>Data Penumpang</DialogTitle>
              <DialogDescription>Lengkapi data untuk {{ selectedSeats.length }} penumpang</DialogDescription>
              
              <div class="space-y-4 py-4">
                <div v-for="(passenger, index) in passengers" :key="index" class="border rounded-lg p-4">
                  <h3 class="font-medium mb-3">Penumpang {{ index + 1 }} - Kursi {{ selectedSeats[index] }}</h3>
                  <div class="space-y-3">
                    <div>
                      <Label>Nama Lengkap</Label>
                      <Input v-model="passenger.name" placeholder="Nama sesuai KTP" />
                    </div>
                    <div>
                      <Label>NIK</Label>
                      <Input v-model="passenger.identity_number" placeholder="16 digit NIK" maxlength="16" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex gap-2">
                <Button @click="bookTicket" :disabled="store.loading">
                  {{ store.loading ? 'Memproses...' : 'Book Sekarang' }}
                </Button>
                <Button variant="outline" @click="showPassengerForm = false">
                  Batal
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <!-- PAYMENT DIALOG -->
          <Dialog v-model:open="showPaymentDialog">
            <DialogContent>
              <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
              <DialogDescription>Periksa detail transaksi Anda</DialogDescription>
              
              <div v-if="currentTransaction" class="space-y-3 py-4">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Kode Transaksi</span>
                  <span class="font-medium">{{ currentTransaction.trx_code }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Total Bayar</span>
                  <span class="font-bold text-lg">Rp {{ currentTransaction.amount?.toLocaleString('id-ID') }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Status</span>
                  <span class="font-medium">{{ currentTransaction.status }}</span>
                </div>
              </div>

              <div class="flex gap-2">
                <Button @click="payTransaction" :disabled="store.loading">
                  {{ store.loading ? 'Memproses...' : 'Bayar Sekarang' }}
                </Button>
                <Button variant="destructive" @click="cancelTransaction">
                  Batalkan
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <!-- ISSUE DIALOG -->
          <Dialog v-model:open="showIssueDialog">
            <DialogContent>
              <DialogTitle>Cetak Tiket</DialogTitle>
              <DialogDescription>Pembayaran berhasil, cetak tiket Anda</DialogDescription>
              
              <div v-if="currentTransaction" class="space-y-3 py-4">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Kode Transaksi</span>
                  <span class="font-medium">{{ currentTransaction.trx_code }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Status</span>
                  <span class="font-medium text-green-600">{{ currentTransaction.status }}</span>
                </div>
                <div class="p-3 bg-green-50 rounded-lg text-sm text-green-700">
                  Pembayaran berhasil! Klik tombol di bawah untuk mencetak tiket dan mendapatkan fee.
                </div>
              </div>

              <div class="flex gap-2">
                <Button @click="issueTicket" :disabled="store.loading">
                  {{ store.loading ? 'Memproses...' : 'Cetak Tiket' }}
                </Button>
                <Button variant="outline" @click="showIssueDialog = false">
                  Nanti
                </Button>
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
