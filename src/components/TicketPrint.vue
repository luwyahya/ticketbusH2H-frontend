<template>
  <div style="max-width:680px;margin:0 auto;padding:12px;font-family:Arial,sans-serif;">

    <div id="ticket-content" style="background:white;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 2px 12px rgba(0,0,0,0.1);">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 24px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;">
        <div>
          <div style="font-size:22px;font-weight:700;letter-spacing:1px;">NETZME BUS</div>
          <div style="font-size:11px;opacity:0.85;margin-top:2px;">Your Trusted Travel Partner</div>
        </div>
        <div style="
  border:2px solid white;
  color:white;
  height:24px;
  min-width:90px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:20px;
  font-size:11px;
  font-weight:700;
  letter-spacing:1px;
  line-height:24px;
">
  <span style="position:relative; top:-1px;">
    E-TICKET
  </span>
</div>
      </div>

      <!-- Booking + Route -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 24px;background:#fafafa;border-bottom:1px dashed #d1d5db;">
        <div>
          <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Kode Booking</div>
          <div style="font-size:15px;font-weight:700;color:#111827;font-family:'Courier New',monospace;">{{ ticket.trx_code }}</div>
        </div>
        <div style="display:flex;align-items:center;gap:16px;">
          <div style="text-align:center;">
            <div style="font-size:18px;font-weight:700;color:#111827;">{{ ticket.origin }}</div>
            <div style="font-size:10px;color:#9ca3af;margin-top:2px;">{{ ticket.origin_terminal }}</div>
          </div>
          <div style="font-size:22px;color:#9ca3af;">→</div>
          <div style="text-align:center;">
            <div style="font-size:18px;font-weight:700;color:#111827;">{{ ticket.destination }}</div>
            <div style="font-size:10px;color:#9ca3af;margin-top:2px;">{{ ticket.destination_terminal }}</div>
          </div>
        </div>
      </div>

      <!-- Info Grid -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px dashed #d1d5db;">
        <div style="padding:10px 16px;border-right:1px solid #f3f4f6;">
          <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Tanggal</div>
          <div style="font-size:12px;font-weight:600;color:#111827;">{{ formatDate(ticket.travel_date) }}</div>
        </div>
        <div style="padding:10px 16px;border-right:1px solid #f3f4f6;">
          <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Jam</div>
          <div style="font-size:12px;font-weight:600;color:#111827;">{{ ticket.departure_time }}</div>
        </div>
        <div style="padding:10px 16px;border-right:1px solid #f3f4f6;">
          <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Kelas</div>
          <div style="font-size:12px;font-weight:600;color:#111827;">{{ ticket.class }}</div>
        </div>
        <div style="padding:10px 16px;">
          <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">No. Kursi</div>
          <div style="font-size:12px;font-weight:700;color:#667eea;">{{ ticket.seat_numbers }}</div>
        </div>
        <div style="padding:10px 16px;border-right:1px solid #f3f4f6;border-top:1px solid #f3f4f6;background:#fafafa;">
          <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Pemesan</div>
          <div style="font-size:12px;font-weight:600;color:#111827;">{{ ticket.customer_name }}</div>
        </div>
        <div style="padding:10px 16px;border-right:1px solid #f3f4f6;border-top:1px solid #f3f4f6;background:#fafafa;">
          <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Telepon</div>
          <div style="font-size:12px;font-weight:600;color:#111827;">{{ ticket.customer_phone }}</div>
        </div>
        <div style="padding:10px 16px;border-right:1px solid #f3f4f6;border-top:1px solid #f3f4f6;background:#fafafa;" :style="ticket.customer_email ? '' : 'grid-column:span 2'">
          <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">Email</div>
          <div style="font-size:12px;font-weight:600;color:#111827;">{{ ticket.customer_email || '-' }}</div>
        </div>
        <div v-if="ticket.customer_email" style="padding:10px 16px;border-top:1px solid #f3f4f6;background:#fafafa;"></div>
      </div>

      <!-- Passengers -->
      <div style="padding:12px 24px;border-bottom:1px dashed #d1d5db;">
        <div style="font-size:10px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Penumpang</div>
        <!-- Table Header -->
        <div style="display:grid;grid-template-columns:28px 1fr 160px 60px;gap:8px;padding:4px 8px;font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.3px;border-bottom:1px solid #e5e7eb;margin-bottom:4px;">
          <span>No</span>
          <span>Nama</span>
          <span>NIK</span>
          <span>Kursi</span>
        </div>
        <!-- Table Rows -->
        <div
          v-for="(p, i) in ticket.passengers"
          :key="i"
          style="display:grid;grid-template-columns:28px 1fr 160px 60px;gap:8px;padding:5px 8px;font-size:12px;color:#374151;border-radius:4px;"
          :style="i % 2 === 1 ? 'background:#f9fafb;' : ''"
        >
          <span style="color:#9ca3af;">{{ i + 1 }}</span>
          <span style="font-weight:600;">{{ p.name }}</span>
          <span style="color:#6b7280;">{{ p.identity_number }}</span>
          <span style="color:#667eea;font-weight:600;">{{ ticket.seat_numbers.split(', ')[i] }}</span>
        </div>
      </div>

      <!-- Payment + Notes -->
      <div style="display:flex;border-bottom:1px solid #e5e7eb;">
        <div style="flex:1;padding:12px 24px;border-right:1px dashed #d1d5db;">
          <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Total Pembayaran</div>
          <div style="font-size:20px;font-weight:700;color:#111827;margin-bottom:8px;">Rp {{ ticket.amount.toLocaleString('id-ID') }}</div>
          <span style="border:2px solid #10b981;color:#10b981;padding:3px 12px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;display:inline-block;">{{ ticket.status }}</span>
        </div>
        <div style="flex:1.2;padding:12px 24px;">
          <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Ketentuan</div>
          <div style="font-size:11px;color:#6b7280;line-height:1.9;">
            • Tiba 30 menit sebelum keberangkatan<br>
            • Tunjukkan e-ticket saat boarding<br>
            • Tiket tidak dapat direfund
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="display:flex;justify-content:space-between;padding:8px 24px;background:#f3f4f6;font-size:10px;color:#9ca3af;">
        <span>Dicetak: {{ formatDateTime(new Date()) }} · Oleh: {{ ticket.agent_name }}</span>
        <span>www.netzmebus.com · CS: 0800-123-4567</span>
      </div>

    </div>

    <!-- Button -->
    <div style="text-align:center;margin-top:16px;">
      <button @click="doPrint" style="background:#667eea;color:white;border:none;padding:10px 32px;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer;">
        Unduh PDF
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import html2pdf from 'html2pdf.js'

interface Passenger {
  name: string
  identity_number: string
}

interface Ticket {
  trx_code: string
  origin: string
  origin_terminal: string
  destination: string
  destination_terminal: string
  travel_date: string
  departure_time: string
  class: string
  seat_numbers: string
  passengers: Passenger[]
  customer_name: string
  customer_phone: string
  customer_email?: string
  amount: number
  status: string
  agent_name: string
}

const props = defineProps<{ ticket: Ticket }>()

const formatDate = (date: string) => {
  const d = new Date(date)
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

const formatDateTime = (date: Date) => {
  return date.toLocaleString('id-ID', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const doPrint = () => {
  const content = document.getElementById('ticket-content')
  if (!content) return

  html2pdf()
    .set({
      margin: [0.8, 1, 0.8, 1],
      filename: `eticket-${props.ticket.trx_code}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 3, useCORS: true, logging: false },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' }
    })
    .from(content)
    .save()
}
</script>
