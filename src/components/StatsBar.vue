<script setup lang="ts">
import type { LatLng } from '../lib/geohash'

const props = defineProps<{
  distKm: number
  bearingDeg: number
  mid: LatLng
}>()

function fmtDist(d: number) {
  return d < 1 ? (d * 1000).toFixed(0) + ' m' : d.toFixed(2) + ' km'
}
function fmtCoord(c: LatLng) {
  return c[0].toFixed(4) + ', ' + c[1].toFixed(4)
}
</script>

<template>
  <div
    class="absolute z-[1000] top-[42px] left-[14px] flex gap-[14px] flex-wrap text-[11px] text-dim"
  >
    <div>DIST <b class="text-ink font-semibold">{{ fmtDist(props.distKm) }}</b></div>
    <div>BEARING <b class="text-ink font-semibold">{{ props.bearingDeg.toFixed(1) }}°</b></div>
    <div>MID <b class="text-ink font-semibold">{{ fmtCoord(props.mid) }}</b></div>
  </div>
</template>
