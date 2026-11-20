import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Kleurrijk: diep indigo-paars als basis (geen grijs), met cyaan, roze, goud en groen.
const { theme, problems } = makeColors({
  label: 'Star Wars kleur',
  roles: { accent: '#4dc4ff', danger: '#ff7a85', success: '#4ee3a1', warning: '#ffd23f', pro: '#c77dff' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0b0720',
        'surface-1': '#130c33',
        'surface-2': '#1b1245',
        'surface-3': '#241857',
        'text-primary': '#f9f6ff',
        'text-secondary': '#ddd4ff',
        'text-muted': '#b9acf0',
      },
    },
  },
  only: 'dark',
})

// Eigen tekening, pure vector. Een deterministisch "willekeurig" getal voor sterren en strepen.
let seed = 11
const rnd = () => {
  seed = (seed * 16807) % 2147483647
  return seed / 2147483647
}

const SPARK = ['#ffffff', '#7fdcff', '#ff9be8', '#ffe27a', '#b79cff', '#7dffc8']
const pick = (list: string[]) => list[Math.floor(rnd() * list.length)] as string

const stars = Array.from({ length: 150 }, () => {
  const x = Math.round(rnd() * 1200)
  const y = Math.round(rnd() * 800)
  const r = (0.6 + rnd() * 1.8).toFixed(1)
  return `<circle class="s d${Math.floor(rnd() * 4)}" cx="${x}" cy="${y}" r="${r}" fill="${pick(SPARK)}"/>`
}).join('')

// Hyperspace in alle kleuren, twee lagen.
const streakLayer = (count: number, cls: string, minR: number, spread: number, minLen: number, lenSpread: number, width: number) =>
  Array.from({ length: count }, (_, i) => {
    const angle = rnd() * Math.PI * 2
    const r1 = minR + rnd() * spread
    const len = minLen + rnd() * lenSpread
    const x1 = Math.round(600 + Math.cos(angle) * r1)
    const y1 = Math.round(400 + Math.sin(angle) * r1)
    const x2 = Math.round(600 + Math.cos(angle) * (r1 + len))
    const y2 = Math.round(400 + Math.sin(angle) * (r1 + len))
    const w = (width * (0.6 + rnd() * 0.9)).toFixed(1)

    return `<line class="${cls} w${i % 4}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${pick(SPARK)}" stroke-width="${w}" stroke-linecap="round" pathLength="100" stroke-dasharray="14 100" opacity="0.4"/>`
  }).join('')

const streaksFar = streakLayer(60, 'w wf', 40, 120, 260, 220, 1)
const streaksNear = streakLayer(40, 'w wn', 90, 160, 380, 300, 2.2)

// Kleine ruimtejagers in felle kleuren (eigen vorm), plek en beweging in aparte lagen.
const fighter = (x: number, y: number, s: number, cls: string, color: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><g class="${cls}" fill="#1b1245" stroke="${color}" stroke-width="1.6">
<rect x="-17" y="-16" width="5" height="32" rx="1"/><rect x="12" y="-16" width="5" height="32" rx="1"/>
<rect x="-12" y="-1.5" width="24" height="3"/><circle r="6.5" fill="#241857"/><circle r="2.8" fill="${color}" stroke="none"/></g></g>`

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
<style>
.s{opacity:0.8;animation:tw 6s ease-in-out infinite}
.d1{animation-delay:-1.5s}
.d2{animation-delay:-3s}
.d3{animation-delay:-4.5s}
.w{animation:warp 2.4s linear infinite}
.wf{animation-duration:3.6s}
.w1{animation-delay:-0.6s}
.w2{animation-delay:-1.2s}
.w3{animation-delay:-1.8s}
.neb{animation:breathe 14s ease-in-out infinite}
.neb2{animation:breathe 19s ease-in-out infinite reverse}
.glow{animation:pulse 6s ease-in-out infinite}
.ring{animation:pulse 8s ease-in-out infinite}
.f1{animation:drift1 14s ease-in-out infinite}
.f2{animation:drift2 18s ease-in-out infinite}
.f3{animation:drift1 22s ease-in-out infinite reverse}
.shoot{animation:shoot 9s linear infinite}
.shoot2{animation:shoot 13s linear infinite;animation-delay:-5s}
@keyframes tw{0%,100%{opacity:0.35}50%{opacity:1}}
@keyframes pulse{0%,100%{opacity:0.7}50%{opacity:1}}
@keyframes breathe{0%,100%{opacity:0.55}50%{opacity:0.95}}
@keyframes warp{0%{stroke-dashoffset:14;opacity:0}15%{opacity:0.85}100%{stroke-dashoffset:-100;opacity:0}}
@keyframes drift1{0%,100%{transform:translate(0px,0px)}50%{transform:translate(90px,-40px)}}
@keyframes drift2{0%,100%{transform:translate(0px,0px)}50%{transform:translate(-70px,45px)}}
@keyframes shoot{0%{stroke-dashoffset:30;opacity:0}6%{opacity:1}30%{stroke-dashoffset:-100;opacity:0}100%{stroke-dashoffset:-100;opacity:0}}
</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0%" stop-color="#0b0720"/><stop offset="45%" stop-color="#1d0f4d"/><stop offset="100%" stop-color="#0c3a7a"/></linearGradient>
<radialGradient id="nPink" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ff4fd8" stop-opacity="0.55"/><stop offset="100%" stop-color="#ff4fd8" stop-opacity="0"/></radialGradient>
<radialGradient id="nCyan" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#27d3ff" stop-opacity="0.5"/><stop offset="100%" stop-color="#27d3ff" stop-opacity="0"/></radialGradient>
<radialGradient id="nGold" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffc93c" stop-opacity="0.45"/><stop offset="100%" stop-color="#ffc93c" stop-opacity="0"/></radialGradient>
<radialGradient id="nViolet" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#8d5bff" stop-opacity="0.6"/><stop offset="100%" stop-color="#8d5bff" stop-opacity="0"/></radialGradient>
<radialGradient id="tunnel" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="30%" stop-color="#7fdcff" stop-opacity="0.25"/><stop offset="100%" stop-color="#7fdcff" stop-opacity="0"/></radialGradient>
<radialGradient id="planetA" cx="32%" cy="30%" r="80%"><stop offset="0%" stop-color="#fff2a8"/><stop offset="45%" stop-color="#ffb62e"/><stop offset="100%" stop-color="#e0861f"/></radialGradient>
<radialGradient id="planetB" cx="32%" cy="30%" r="80%"><stop offset="0%" stop-color="#b9ffe9"/><stop offset="50%" stop-color="#1fcfa0"/><stop offset="100%" stop-color="#0a5a8f"/></radialGradient>
<radialGradient id="planetC" cx="32%" cy="30%" r="80%"><stop offset="0%" stop-color="#ffd1f4"/><stop offset="50%" stop-color="#d058ff"/><stop offset="100%" stop-color="#4a1d9e"/></radialGradient>
<radialGradient id="haloA" cx="50%" cy="50%" r="50%"><stop offset="40%" stop-color="#ffb62e" stop-opacity="0.45"/><stop offset="100%" stop-color="#ffb62e" stop-opacity="0"/></radialGradient>
<radialGradient id="haloB" cx="50%" cy="50%" r="50%"><stop offset="40%" stop-color="#1fe0b0" stop-opacity="0.45"/><stop offset="100%" stop-color="#1fe0b0" stop-opacity="0"/></radialGradient>
<clipPath id="pa"><circle cx="950" cy="230" r="125"/></clipPath>
<clipPath id="pb"><circle cx="190" cy="610" r="85"/></clipPath>
</defs>
<rect width="1200" height="800" fill="url(#sky)"/>
<g class="neb"><ellipse cx="230" cy="170" rx="380" ry="230" fill="url(#nPink)"/><ellipse cx="1000" cy="640" rx="400" ry="240" fill="url(#nCyan)"/></g>
<g class="neb2"><ellipse cx="640" cy="90" rx="330" ry="170" fill="url(#nViolet)"/><ellipse cx="600" cy="740" rx="420" ry="160" fill="url(#nGold)"/></g>
${stars}
<circle class="glow" cx="600" cy="400" r="280" fill="url(#tunnel)"/>
${streaksFar}
${streaksNear}
<line class="shoot" x1="140" y1="60" x2="420" y2="200" stroke="#ffffff" stroke-width="3" stroke-linecap="round" pathLength="100" stroke-dasharray="22 100"/>
<line class="shoot2" x1="760" y1="520" x2="1040" y2="700" stroke="#ffe27a" stroke-width="3" stroke-linecap="round" pathLength="100" stroke-dasharray="22 100"/>
${fighter(380, 330, 1.7, 'f1', '#7fdcff')}
${fighter(470, 640, 1.2, 'f2', '#ff9be8')}
${fighter(700, 120, 1, 'f3', '#ffe27a')}
<circle class="glow" cx="950" cy="230" r="260" fill="url(#haloA)"/>
<ellipse class="ring" cx="950" cy="230" rx="215" ry="52" transform="rotate(-18 950 230)" fill="none" stroke="#ff9be8" stroke-width="9" opacity="0.85"/>
<ellipse class="ring" cx="950" cy="230" rx="245" ry="62" transform="rotate(-18 950 230)" fill="none" stroke="#7fdcff" stroke-width="4" opacity="0.7"/>
<circle cx="950" cy="230" r="125" fill="url(#planetA)"/>
<g clip-path="url(#pa)" fill="none" stroke-linecap="round">
<path d="M820 190 Q950 215 1080 190" stroke="#ffa733" stroke-width="12" opacity="0.55"/>
<path d="M815 240 Q950 268 1085 240" stroke="#fff0a0" stroke-width="9" opacity="0.5"/>
<path d="M830 290 Q950 316 1070 290" stroke="#e8932a" stroke-width="10" opacity="0.5"/>
</g>
<g transform="rotate(-18 950 230)" fill="none">
<path class="ring" d="M735 230 A215 52 0 0 0 1165 230" stroke="#ff9be8" stroke-width="9" opacity="0.95"/>
<path class="ring" d="M705 230 A245 62 0 0 0 1195 230" stroke="#7fdcff" stroke-width="4" opacity="0.85"/>
</g>
<circle class="glow" cx="190" cy="610" r="170" fill="url(#haloB)"/>
<circle cx="190" cy="610" r="85" fill="url(#planetB)"/>
<g clip-path="url(#pb)" fill="none" stroke-linecap="round">
<path d="M100 590 Q190 612 280 590" stroke="#e8fff6" stroke-width="8" opacity="0.5"/>
<path d="M105 640 Q190 662 275 640" stroke="#0a7d9f" stroke-width="9" opacity="0.5"/>
</g>
<circle cx="1090" cy="640" r="46" fill="url(#planetC)"/>
<circle cx="1072" cy="624" r="9" fill="#ffd1f4" opacity="0.5"/>
</svg>`

const LOOK: ThemeSetArgs = {
  colors: theme,
  overrideColorScheme: 'dark',
  backdrop: { scene: 'kleur', glass: { blur: 6, tint: '#0b0720', opacity: 0.4 } },
  style: {
    Heading: { color: '#ffd23f', fontWeight: 'bold', letterSpacing: 1 },
    UserMessage: {
      backgroundColor: '#2a1b6e',
      borderColor: '#4dc4ff',
      borderWidth: 2,
      radius: 16,
      padding: 14,
      shadow: { x: 0, y: 0, blur: 14, color: '#4dc4ff66' },
    },
    AssistantMessage: {
      backgroundColor: '#150d3a',
      borderColor: '#ff7de0',
      borderWidth: 2,
      radius: 16,
      padding: 14,
      shadow: { x: 0, y: 0, blur: 14, color: '#ff7de066' },
    },
    ToolUse: { backgroundColor: '#1b1245', borderColor: '#7dffc8', borderWidth: 1, radius: 8, paddingX: 8 },
  },
}

export const register: Register = (on, options) => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    try {
      const set = await $.theme.set(LOOK)

      if (!set.isDrawn) {
        $.ui.status(set.reason)
      }
    } catch (error) {
      // Oudere versie zonder 'style' of 'glass': zet de look zonder die onderdelen.
      $.ui.log(String(error))
      await $.theme.set({ colors: theme, overrideColorScheme: 'dark', backdrop: { scene: 'kleur' } })
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Kleurrijke ruimte met gloeiende nevels, drie planeten, hyperspace-strepen en ruimtejagers" isInteractive />
  })
}
