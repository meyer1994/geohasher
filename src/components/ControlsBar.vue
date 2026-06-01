<script setup lang="ts">
import type { Mode } from '../lib/colors'

const props = defineProps<{ mode: Mode; autoFit: boolean }>()
const emit = defineEmits<{
  (e: 'update:mode', v: Mode): void
  (e: 'update:autoFit', v: boolean): void
  (e: 'fit'): void
  (e: 'clear'): void
}>()

const modes: { key: Mode; label: string }[] = [
  { key: 'pos', label: 'POSITION' },
  { key: 'dir', label: 'DIRECTION' },
  { key: 'point', label: 'POINT' },
]

const miniBtn =
  'bg-surface border border-line text-dim font-[inherit] text-[10px] tracking-[0.5px] px-[10px] py-[5px] rounded-[7px] cursor-pointer active:bg-surface-on active:text-ink'
const segBtn =
  'bg-surface text-dim border-0 font-[inherit] text-[10px] tracking-[0.5px] px-[9px] py-[5px] cursor-pointer'
</script>

<template>
  <div class="flex items-center gap-2 flex-wrap">
    <span class="text-[10px] tracking-[1px] text-dim">COLOR BY</span>
    <div class="flex border border-line rounded-[7px] overflow-hidden">
      <button
        v-for="(m, i) in modes"
        :key="m.key"
        :class="[segBtn, i > 0 && 'border-l border-line', props.mode === m.key && 'bg-surface-on text-ink']"
        @click="emit('update:mode', m.key)"
      >
        {{ m.label }}
      </button>
    </div>
    <button :class="miniBtn" @click="emit('fit')">FIT</button>
    <button
      :class="[miniBtn, props.autoFit && '!bg-surface-on !text-ink !border-line-strong']"
      @click="emit('update:autoFit', !props.autoFit)"
    >
      AUTO
    </button>
    <button
      class="ml-auto bg-surface border border-line text-dim font-[inherit] text-[10px] tracking-[0.5px] px-[10px] py-[5px] rounded-[7px] cursor-pointer active:bg-danger-bg active:text-danger"
      @click="emit('clear')"
    >
      CLEAR TRAILS
    </button>
  </div>
</template>
