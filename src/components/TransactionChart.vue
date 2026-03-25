<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps<{
  chartData: Array<{ date: string; total: number }>
}>()

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        label: function(context: any) {
          return 'Total: Rp ' + context.parsed.y.toLocaleString('id-ID')
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value: any) {
          return 'Rp ' + value.toLocaleString('id-ID')
        }
      }
    }
  }
}

const data = computed(() => {
  const validData = props.chartData.filter(item => item.date && item.total)
  return {
    labels: validData.map(item => item.date),
    datasets: [
      {
        label: 'Total Transaksi (Rp)',
        data: validData.map(item => parseFloat(item.total) || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  }
})

const optionsWithDualAxis = computed(() => chartOptions)
</script>

<template>
  <div class="h-[300px]">
    <Bar v-if="chartData.length" :data="data" :options="optionsWithDualAxis" />
    <div v-else class="h-full flex items-center justify-center text-muted-foreground">
      Belum ada data transaksi
    </div>
  </div>
</template>
