<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  type DialogRootEmits,
  type DialogRootProps,
} from 'radix-vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<DialogRootProps>()
const emit = defineEmits<DialogRootEmits>()

const forwardedEmit = {
  'update:open': (value: boolean) => emit('update:open', value),
}
</script>

<template>
  <DialogRoot v-bind="props" v-on="forwardedEmit">
    <slot />
  </DialogRoot>
</template>
