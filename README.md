# Geohash Observer

An interactive Vue 3 + Leaflet visualizer for two geohashes. Nudge any base-32
character ±1 (buttons or mouse wheel), carry/borrow propagates through
more-significant digits, and the map shows both points, their connecting line,
midpoint, and a fading-free trail of every move — colored by position,
direction, or point. Built with `vue-leaflet`, `ngeohash`, `@turf/*` for geo
math, and Tailwind v4.

## Scripts

```sh
pnpm dev         # start vite dev server
pnpm build       # typecheck + production build
pnpm preview     # preview the production build
pnpm lint        # eslint
pnpm typecheck   # vue-tsc --noEmit
```
