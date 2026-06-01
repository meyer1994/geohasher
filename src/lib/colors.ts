export type Point = 'A' | 'B'
export type Mode = 'pos' | 'dir' | 'point'
export type ColorMeta = { point: Point; idx: number; dir: 1 | -1 }

export const COLOR: Record<Point, string> = { A: '#ffb22e', B: '#36d3e0' }
export const MID_COLOR = '#c06bff'

export const POS = [
  '#ff6b6b',
  '#ffb22e',
  '#ffe66d',
  '#4ade80',
  '#36d3e0',
  '#c06bff',
  '#ff8fd0',
  '#7da0ff',
]

export const DIRC: Record<'1' | '-1', string> = { '1': '#4ade80', '-1': '#f87171' }

export function colorOf(mode: Mode, m: ColorMeta): string {
  if (mode === 'point') return COLOR[m.point]
  if (mode === 'dir') return DIRC[String(m.dir) as '1' | '-1']
  return POS[m.idx % POS.length]
}
