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
  
  console.log('Search result:', store.schedules)
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
  if (!selectedSchedule.value) {
    toast({
      title: 'Error',
      description: 'Jadwal tidak ditemukan, silakan pilih ulang',
      variant: 'destructive'
    })
    showPassengerForm.value = false
    return
  }

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
    console.log('Selected schedule:', selectedSchedule.value)
    console.log('Booking with data:', {
      provider_code: selectedSchedule.value.provider_code,
      travel_date: travel_date.value,
      seats: selectedSeats.value,
      passengers: passengers.value
    })

    const result = await store.book({
      provider_code: selectedSchedule.value.provider_code,
      travel_date: travel_date.value,
      seats: selectedSeats.value,
      passengers: passengers.value
    })

    console.log('Booking result:', result)
    currentTransaction.value = result
    
    // Close passenger form first
    showPassengerForm.value = false
    
    // Show success toast
    toast({
      title: 'Booking Berhasil',
      description: `Kode: ${result.trx_code}`
    })

    // Wait a bit then open payment dialog
    setTimeout(() => {
      console.log('Opening payment dialog, currentTransaction:', currentTransaction.value)
      showPaymentDialog.value = true
      console.log('showPaymentDialog:', showPaymentDialog.value)
    }, 300)
  } catch (error: any) {
    console.error('Booking error:', error)
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
    console.log('Paying transaction:', currentTransaction.value.trx_code)
    const result = await store.pay(currentTransaction.value.trx_code)
    console.log('Payment result:', result)
    
    currentTransaction.value = result
    
    toast({
      title: 'Pembayaran Berhasil',
      description: 'Silakan cetak tiket'
    })

    // Close payment dialog first
    showPaymentDialog.value = false
    
    // Wait then open issue dialog
    setTimeout(() => {
      console.log('Opening issue dialog, currentTransaction:', currentTransaction.value)
      showIssueDialog.value = true
      console.log('showIssueDialog:', showIssueDialog.value)
    }, 300)
  } catch (error: any) {
    console.error('Payment error:', error)
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
          <Card v-if="store.schedules.length" class="animate-in fade-in duration-300">
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
                class="border rounded-lg p-4 flex justify-between items-center transition-all duration-200 hover:shadow-md hover:border-primary/50 cursor-pointer"
                :class="selectedSchedule?.provider_code === schedule.provider_code ? 'border-primary bg-primary/5' : ''"
              >
                <div>
                  <div class="font-medium">{{ schedule.route }}</div>
                  <div class="text-sm text-muted-foreground">
                    Berangkat: {{ schedule.departure_time }}
                  </div>
                  <div class="font-semibold mt-1 text-primary">
                    Rp {{ (schedule.price || 0).toLocaleString('id-ID') }}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  @click="selectSchedule(schedule)"
                  class="transition-all hover:scale-105"
                >
                  Pilih
                </Button>
              </div>

            </CardContent>
          </Card>

          <!-- SEAT MAP CARD -->
          <Card v-if="store.seatMap.length" class="animate-in fade-in duration-300">
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
                    class="px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200"
                    :class="[
                    seat.status === 'booked'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'
                        : isSelected(seat.number)
                        ? 'bg-blue-600 text-white scale-110 shadow-lg'
                        : 'bg-green-100 text-green-700 cursor-pointer hover:bg-green-200 hover:scale-105 hover:shadow-md'
                    ]"
                >
                    {{ seat.number }}
                </div>

                </div>

                <!-- SELECTED INFO -->
                <div v-if="selectedSeats.length" class="mt-4 animate-in slide-in-from-bottom duration-300">
                  <div class="text-sm mb-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    Kursi dipilih:
                    <span class="font-semibold text-blue-700">
                      {{ selectedSeats.join(', ') }}
                    </span>
                  </div>
                  <Button @click="proceedToPassengerForm" class="w-full transition-all hover:scale-105">
                    Lanjut ke Data Penumpang →
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
            <DialogContent class="animate-in fade-in zoom-in duration-300">
              <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
              <DialogDescription>Periksa detail transaksi Anda</DialogDescription>
              
              <div v-if="currentTransaction" class="space-y-3 py-4">
                <div class="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span class="text-muted-foreground">Kode Transaksi</span>
                  <span class="font-medium">{{ currentTransaction.trx_code }}</span>
                </div>
                <div class="flex justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                  <span class="text-muted-foreground font-medium">Total Bayar</span>
                  <span class="font-bold text-2xl text-primary">Rp {{ currentTransaction.amount?.toLocaleString('id-ID') }}</span>
                </div>
                <div class="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span class="text-muted-foreground">Status</span>
                  <span class="font-medium px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">{{ currentTransaction.status }}</span>
                </div>
              </div>

              <div class="flex gap-2">
                <Button @click="payTransaction" :disabled="store.loading" class="flex-1 transition-all hover:scale-105">
                  {{ store.loading ? 'Memproses...' : 'Bayar Sekarang' }}
                </Button>
                <Button variant="destructive" @click="cancelTransaction" class="transition-all hover:scale-105">
                  Batalkan
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <!-- ISSUE DIALOG -->
          <Dialog v-model:open="showIssueDialog">
            <DialogContent class="max-w-2xl animate-in fade-in zoom-in duration-300">
              <DialogTitle>Informasi Tiket</DialogTitle>
              <DialogDescription>Detail tiket bus Anda</DialogDescription>
              
              <div v-if="currentTransaction" class="space-y-4 py-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <span class="text-sm text-muted-foreground block mb-1">Kode Transaksi</span>
                    <p class="font-medium">{{ currentTransaction.trx_code }}</p>
                  </div>
                  <div class="p-3 bg-green-50 rounded-lg border border-green-200">
                    <span class="text-sm text-muted-foreground block mb-1">Status</span>
                    <p class="font-medium text-green-600">{{ currentTransaction.status }}</p>
                  </div>
                  <div class="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <span class="text-sm text-muted-foreground block mb-1">Rute</span>
                    <p class="font-medium">{{ selectedSchedule?.route }}</p>
                  </div>
                  <div class="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <span class="text-sm text-muted-foreground block mb-1">Tanggal Keberangkatan</span>
                    <p class="font-medium">{{ travel_date }}</p>
                  </div>
                  <div class="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <span class="text-sm text-muted-foreground block mb-1">Jam Keberangkatan</span>
                    <p class="font-medium">{{ selectedSchedule?.departure_time }}</p>
                  </div>
                  <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span class="text-sm text-muted-foreground block mb-1">Kursi</span>
                    <p class="font-medium text-blue-700">{{ selectedSeats.join(', ') }}</p>
                  </div>
                </div>

                <div class="border-t pt-4">
                  <h3 class="font-medium mb-3 flex items-center gap-2">Penumpang</h3>
                  <div class="space-y-2">
                    <div v-for="(passenger, index) in passengers" :key="index" class="text-sm p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <span class="font-medium">{{ index + 1 }}. {{ passenger.name }}</span>
                      <span class="text-muted-foreground ml-2">({{ passenger.identity_number }})</span>
                    </div>
                  </div>
                </div>

                <div class="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 animate-pulse">
                  <p class="text-sm text-green-700 font-medium">Pembayaran berhasil! Klik tombol di bawah untuk mencetak tiket dan mendapatkan fee.</p>
                </div>
              </div>

              <div class="flex gap-2">
                <Button @click="issueTicket" :disabled="store.loading" class="flex-1 transition-all hover:scale-105">
                  {{ store.loading ? 'Memproses...' : 'Cetak Tiket' }}
                </Button>
                <Button variant="outline" @click="showIssueDialog = false" class="transition-all hover:scale-105">
                  ← Kembali
                </Button>
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
