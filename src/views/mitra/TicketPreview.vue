<script setup lang="ts">
import { ref } from 'vue'
import TicketPrint from '@/components/TicketPrint.vue'

// Sample ticket data
const sampleTicket = ref({
  trx_code: 'NTZ2024011500123',
  origin: 'Jakarta',
  origin_terminal: 'Terminal Kampung Rambutan',
  destination: 'Bandung',
  destination_terminal: 'Terminal Leuwi Panjang',
  travel_date: '2024-01-20',
  departure_time: '08:00 WIB',
  class: 'Executive',
  seat_numbers: 'A1, A2',
  passengers: [
    {
      name: 'John Doe',
      identity_number: '3201234567890123'
    },
    {
      name: 'Jane Smith',
      identity_number: '3201234567890124'
    }
  ],
  customer_name: 'John Doe',
  customer_phone: '081234567890',
  customer_email: 'john.doe@example.com',
  amount: 400000,
  status: 'ISSUED',
  agent_name: 'Mitra Travel ABC'
})
</script>

<template>
  <div class="preview-container">
    <TicketPrint :ticket="sampleTicket" />
  </div>
</template>

<style scoped>
.preview-container {
  min-height: 100vh;
  background: #e5e7eb;
  padding: 20px;
}
</style>
