<script setup lang="ts">
import { computed } from 'vue'
import type { LatLng } from '../lib/geohash'
import { colorOf, type Mode, type Point } from '../lib/colors'

const props = defineProps<{
  point: Point
  hash: string
  coord: LatLng
  mode: Mode
}>()

const emit = defineEmits<{ (e: 'nudge', idx: number, dir: 1 | -1): void }>()

const chars = computed(() => props.hash.split(''))
const coordText = computed(
  () => props.coord[0].toFixed(4) + ', ' + props.coord[1].toFixed(4),
)

function btnStyle(idx: number, dir: 1 | -1) {
  const c = colorOf(props.mode, { point: props.point, idx, dir })
  return { color: c, borderColor: c + '66' }
}

function onWheel(e: WheelEvent, idx: number) {
  e.preventDefault()
  if (e.deltaY === 0) return
  emit('nudge', idx, e.deltaY < 0 ? 1 : -1)
}

const accent = computed(() => (props.point === 'A' ? 'var(--color-a)' : 'var(--color-b)'))
const chColor = computed(() => (props.point === 'A' ? 'text-a' : 'text-b'))
</script>

<template>
  <div
    class="flex-1 min-w-0 bg-surface border border-line rounded-[10px] pt-[9px] px-[9px] pb-[11px]"
    :style="{ boxShadow: `inset 3px 0 0 ${accent}` }"
  >
    <div class="flex justify-between items-center text-[10px] tracking-[1px] text-dim mb-[7px]">
      <span>
        <span :class="chColor">●</span> POINT {{ props.point }}
      </span>
      <span class="text-[10px] text-dim">{{ coordText }}</span>
    </div>
    <div class="flex gap-[3px] justify-start">
      <div
        v-for="(ch, i) in chars"
        :key="i"
        class="flex flex-col items-center gap-[3px] flex-1"
        @wheel.prevent="onWheel($event, i)"
      >
        <button
          class="w-full h-5 border border-line bg-surface-2 text-dim rounded-[5px] text-[11px] cursor-pointer leading-none p-0 active:bg-surface-on active:text-ink"
          :style="btnStyle(i, 1)"
          @click="emit('nudge', i, 1)"
        >
          ▲
        </button>
        <div
          :class="['text-[19px] font-semibold leading-none py-[2px] w-full text-center rounded-[5px]', chColor]"
        >
          {{ ch }}
        </div>
        <button
          class="w-full h-5 border border-line bg-surface-2 text-dim rounded-[5px] text-[11px] cursor-pointer leading-none p-0 active:bg-surface-on active:text-ink"
          :style="btnStyle(i, -1)"
          @click="emit('nudge', i, -1)"
        >
          ▼
        </button>
      </div>
    </div>
  </div>
</template>
