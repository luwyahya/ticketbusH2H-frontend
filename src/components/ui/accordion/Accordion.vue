<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
  type AccordionRootEmits,
  type AccordionRootProps,
} from 'radix-vue'
import { ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<AccordionRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<AccordionRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwardedEmit = {
  'update:modelValue': (value: typeof props.modelValue) => emits('update:modelValue', value),
}
</script>

<template>
  <AccordionRoot
    v-bind="delegatedProps"
    :class="cn('', props.class)"
    v-on="forwardedEmit"
  >
    <slot />
  </AccordionRoot>
</template>
