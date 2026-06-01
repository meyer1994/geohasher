<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import L from 'leaflet'
import {
  LCircleMarker,
  LControlZoom,
  LMap,
  LMarker,
  LPolyline,
  LTileLayer,
} from '@vue-leaflet/vue-leaflet'

import {
  center,
  decodeBbox,
  encode,
  haversine,
  bearingDeg as bearingOf,
  nudge,
  type LatLng,
} from '../lib/geohash'
import { COLOR, MID_COLOR, colorOf, type ColorMeta, type Mode } from '../lib/colors'

import StatsBar from './StatsBar.vue'
import ControlsBar from './ControlsBar.vue'
import GeohashCard from './GeohashCard.vue'

const PREC = 9

const state = reactive({
  A: encode(37.7749, -122.4194, PREC),
  B: encode(37.8044, -122.2712, PREC),
})

const mode = ref<Mode>('pos')
const autoFit = ref(false)

type Trail = {
  id: number
  latLngs: [LatLng, LatLng]
  meta: ColorMeta
}
const trails = reactive<Trail[]>([])
let trailId = 0

const centerA = computed<LatLng>(() => center(state.A))
const centerB = computed<LatLng>(() => center(state.B))
const mid = computed<LatLng>(() => {
  const [la1, lo1] = centerA.value
  const [la2, lo2] = centerB.value
  let dLon = lo2 - lo1
  if (dLon > 180) dLon -= 360
  else if (dLon < -180) dLon += 360
  let lo = lo1 + dLon / 2
  if (lo > 180) lo -= 360
  else if (lo < -180) lo += 360
  return [(la1 + la2) / 2, lo]
})
const distKm = computed(() => haversine(centerA.value, centerB.value))
const bearingDeg = computed(() => bearingOf(centerA.value, centerB.value))

function makeDot(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};
      border:2px solid #0a1218;box-shadow:0 0 0 2px ${color}66"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  }) as unknown as L.Icon
}
const iconA = makeDot(COLOR.A)
const iconB = makeDot(COLOR.B)

const linkLatLngs = computed<LatLng[]>(() => [centerA.value, centerB.value])

function onNudge(point: 'A' | 'B', idx: number, dir: 1 | -1) {
  const cur = state[point]
  const { hash, idx: changedIdx } = nudge(cur, idx, dir)
  if (hash === cur) return
  const from = center(cur)
  state[point] = hash
  const to = center(hash)
  trails.push({
    id: ++trailId,
    latLngs: [from, to],
    meta: { point, idx: changedIdx, dir },
  })
  if (autoFit.value) fitView()
}

const mapRef = ref<InstanceType<typeof LMap> | null>(null)

function fitView() {
  const m = mapRef.value as unknown as { leafletObject?: L.Map } | null
  const lmap = m?.leafletObject
  if (!lmap) return
  const a = decodeBbox(state.A),
    b = decodeBbox(state.B)
  const corners: [number, number][] = [
    [a.latMin, a.lonMin],
    [a.latMax, a.lonMax],
    [b.latMin, b.lonMin],
    [b.latMax, b.lonMax],
  ]
  lmap.fitBounds(corners as unknown as L.LatLngBoundsExpression, {
    padding: [50, 90],
    maxZoom: 16,
    animate: true,
    duration: 0.15,
  })
}

function clearTrails() {
  trails.length = 0
}

const mapOptions = {
  zoomControl: false,
  attributionControl: false,
  fadeAnimation: false,
  inertia: false,
}

watch(autoFit, (v) => {
  if (v) fitView()
})
</script>

<template>
  <div class="absolute inset-0 bg-bg">
    <LMap
      ref="mapRef"
      :center="[37.79, -122.34]"
      :zoom="11"
      :options="mapOptions"
      :use-global-leaflet="false"
    >
      <LTileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        :max-zoom="19"
      />
      <LControlZoom position="topright" />
      <LPolyline
        :lat-lngs="linkLatLngs"
        :color="MID_COLOR"
        :weight="1.5"
        dash-array="5 5"
        :opacity="0.8"
      />
      <LMarker
        :lat-lng="centerA"
        :icon="iconA"
      />
      <LMarker
        :lat-lng="centerB"
        :icon="iconB"
      />
      <LCircleMarker
        :lat-lng="mid"
        :radius="4"
        :color="MID_COLOR"
        :weight="2"
        :fill-color="MID_COLOR"
        :fill-opacity="1"
      />
      <LPolyline
        v-for="t in trails"
        :key="t.id"
        :lat-lngs="t.latLngs"
        :color="colorOf(mode, t.meta)"
        :weight="3"
        :opacity="0.7"
      />
    </LMap>
  </div>

  <header
    class="absolute top-0 left-0 right-0 z-[1000] px-[14px] py-[10px] flex items-baseline gap-[10px] pointer-events-none"
    style="background: linear-gradient(180deg, rgba(10,18,24,.92), rgba(10,18,24,0))"
  >
    <h1 class="font-syne font-extrabold text-[18px] tracking-[-0.5px] m-0">
      Geohash Observer
    </h1>
    <span class="text-dim text-[11px] tracking-[0.5px]">nudge any character ±1</span>
  </header>

  <StatsBar
    :dist-km="distKm"
    :bearing-deg="bearingDeg"
    :mid="mid"
  />

  <div
    class="absolute z-[1000] left-0 right-0 bottom-0 bg-panel border-t border-line flex flex-col gap-[10px]"
    style="padding: 10px 12px calc(12px + env(safe-area-inset-bottom))"
  >
    <ControlsBar
      :mode="mode"
      :auto-fit="autoFit"
      @update:mode="mode = $event"
      @update:auto-fit="autoFit = $event"
      @fit="fitView"
      @clear="clearTrails"
    />
    <div class="flex gap-[10px]">
      <GeohashCard
        point="A"
        :hash="state.A"
        :coord="centerA"
        :mode="mode"
        @nudge="(i, d) => onNudge('A', i, d)"
      />
      <GeohashCard
        point="B"
        :hash="state.B"
        :coord="centerB"
        :mode="mode"
        @nudge="(i, d) => onNudge('B', i, d)"
      />
    </div>
  </div>
</template>

<style>
img.leaflet-tile {
  filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
}</style>