import ngeohash from 'ngeohash'
import distance from '@turf/distance'
import bearing from '@turf/bearing'
import { point } from '@turf/helpers'

export const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz'

export type LatLng = [number, number]
export type Bbox = { latMin: number; latMax: number; lonMin: number; lonMax: number }

export function decodeBbox(g: string): Bbox {
  const [latMin, lonMin, latMax, lonMax] = ngeohash.decode_bbox(g)
  return { latMin, latMax, lonMin, lonMax }
}

export function center(g: string): LatLng {
  const { latitude, longitude } = ngeohash.decode(g)
  return [latitude, longitude]
}

export function encode(lat: number, lon: number, prec: number): string {
  return ngeohash.encode(lat, lon, prec)
}

export type NudgeResult = { hash: string; idx: number }

export function nudge(g: string, i: number, dir: number): NudgeResult {
  const a = g.split('')
  let p = i
  let v = BASE32.indexOf(a[p]) + dir
  while (p >= 0) {
    if (v >= 0 && v <= 31) {
      a[p] = BASE32[v]
      return { hash: a.join(''), idx: p }
    }
    if (v < 0) {
      a[p] = BASE32[31]
      p--
      if (p < 0) break
      v = BASE32.indexOf(a[p]) - 1
    } else {
      a[p] = BASE32[0]
      p--
      if (p < 0) break
      v = BASE32.indexOf(a[p]) + 1
    }
  }
  return { hash: g, idx: i }
}

function toGeoJson(p: LatLng) {
  return point([p[1], p[0]])
}

export function haversine(a: LatLng, b: LatLng): number {
  return distance(toGeoJson(a), toGeoJson(b), { units: 'kilometers' })
}

export function bearingDeg(a: LatLng, b: LatLng): number {
  return (bearing(toGeoJson(a), toGeoJson(b)) + 360) % 360
}
