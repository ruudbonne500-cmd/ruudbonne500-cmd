import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Dark side in zwart, wit en grijs.
const { theme, problems } = makeColors({
  label: 'Darth Vader',
  roles: { accent: '#e6e8ec', danger: '#ff6b5e', success: '#6fcf97', warning: '#e8b23a', pro: '#b8b8c8' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#050505',
        'surface-1': '#0d0d0e',
        'surface-2': '#161617',
        'surface-3': '#1e1e20',
        'text-primary': '#f5f5f6',
        'text-secondary': '#cfcfd3',
        'text-muted': '#a2a2a8',
      },
    },
  },
  only: 'dark',
})

// Eigen tekening in zwart, wit en grijs: hyperspace-tunnel, sterren, nevel,
// een grote ruimtestation-bol met details en een paar kleine ruimtejagers.
// Alles is pure vector; de bewegingen zijn langzaam.
let seed = 7
const rnd = () => {
  seed = (seed * 16807) % 2147483647
  return seed / 2147483647
}

const stars = Array.from({ length: 170 }, () => {
  const x = Math.round(rnd() * 1200)
  const y = Math.round(rnd() * 800)
  const r = (0.5 + rnd() * 1.6).toFixed(1)
  const d = Math.floor(rnd() * 4)
  const shade = rnd() > 0.7 ? '#c9c9d0' : '#ffffff'
  return `<circle class="s d${d}" cx="${x}" cy="${y}" r="${r}" fill="${shade}"/>`
}).join('')

// Hyperspace: twee lagen lichtstrepen vanuit het midden. De ver-weg-laag is zacht en dun.
const streakLayer = (count: number, cls: string, minR: number, spread: number, minLen: number, lenSpread: number, width: number, shade: string) =>
  Array.from({ length: count }, (_, i) => {
    const angle = rnd() * Math.PI * 2
    const r1 = minR + rnd() * spread
    const len = minLen + rnd() * lenSpread
    const x1 = Math.round(600 + Math.cos(angle) * r1)
    const y1 = Math.round(400 + Math.sin(angle) * r1)
    const x2 = Math.round(600 + Math.cos(angle) * (r1 + len))
    const y2 = Math.round(400 + Math.sin(angle) * (r1 + len))
    const w = (width * (0.6 + rnd() * 0.9)).toFixed(1)

    return `<line class="${cls} w${i % 4}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${shade}" stroke-width="${w}" stroke-linecap="round" pathLength="100" stroke-dasharray="14 100" opacity="0.3"/>`
  }).join('')

const streaksFar = streakLayer(70, 'w wf', 40, 120, 260, 220, 0.9, '#8a8a92')
const streaksNear = streakLayer(46, 'w wn', 90, 160, 380, 300, 1.8, '#ffffff')

// Kleine lichtjes en paneellijnen op de grote bol.
const lights = Array.from({ length: 90 }, () => {
  const a = rnd() * Math.PI * 2
  const rr = Math.sqrt(rnd()) * 160
  const x = (940 + Math.cos(a) * rr).toFixed(0)
  const y = (230 + Math.sin(a) * rr).toFixed(0)
  const d = Math.floor(rnd() * 4)
  return `<rect class="l d${d}" x="${x}" y="${y}" width="${rnd() > 0.8 ? 2.5 : 1.5}" height="1.5" fill="#e4e4ea"/>`
}).join('')

// Een TIE-achtige ruimtejager als eigen silhouet: kleine kern met twee hoge vleugels.
const fighter = (x: number, y: number, s: number, cls: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><g class="${cls}" fill="#4a4a50" stroke="#c4c4cc" stroke-width="0.9">
<rect x="-17" y="-16" width="5" height="32" rx="1"/><rect x="12" y="-16" width="5" height="32" rx="1"/>
<rect x="-12" y="-1.5" width="24" height="3"/><circle r="6.5" fill="#1a1a1d"/><circle r="2.5" fill="#f0f0f4" stroke="none"/></g></g>`

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
<style>
.s{opacity:0.7;animation:tw 7s ease-in-out infinite}
.l{opacity:0.55;animation:tw 9s ease-in-out infinite}
.d1{animation-delay:-1.75s}
.d2{animation-delay:-3.5s}
.d3{animation-delay:-5.25s}
.w{animation:warp 2.4s linear infinite}
.wf{animation-duration:3.6s}
.w1{animation-delay:-0.6s}
.w2{animation-delay:-1.2s}
.w3{animation-delay:-1.8s}
.dish{opacity:0.9;animation:pulse 5s ease-in-out infinite}
.core{animation:pulse 4s ease-in-out infinite}
.f1{animation:drift1 14s ease-in-out infinite}
.f2{animation:drift2 18s ease-in-out infinite}
.f3{animation:drift1 22s ease-in-out infinite reverse}
@keyframes tw{0%,100%{opacity:0.3}50%{opacity:0.9}}
@keyframes pulse{0%,100%{opacity:0.55}50%{opacity:1}}
@keyframes warp{0%{stroke-dashoffset:14;opacity:0}15%{opacity:0.75}100%{stroke-dashoffset:-100;opacity:0}}
@keyframes drift1{0%,100%{transform:translate(0px,0px)}50%{transform:translate(90px,-40px)}}
@keyframes drift2{0%,100%{transform:translate(0px,0px)}50%{transform:translate(-70px,45px)}}
</style>
<defs>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="52%" stop-color="#8a8a92" stop-opacity="0.38"/><stop offset="100%" stop-color="#050505" stop-opacity="0"/></radialGradient>
<radialGradient id="sphere" cx="32%" cy="28%" r="85%"><stop offset="0%" stop-color="#75757c"/><stop offset="50%" stop-color="#2e2e32"/><stop offset="100%" stop-color="#070708"/></radialGradient>
<radialGradient id="shade" cx="30%" cy="26%" r="90%"><stop offset="55%" stop-color="#000000" stop-opacity="0"/><stop offset="100%" stop-color="#000000" stop-opacity="0.65"/></radialGradient>
<radialGradient id="dishg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff"/><stop offset="55%" stop-color="#a8a8b0"/><stop offset="100%" stop-color="#2a2a2d"/></radialGradient>
<radialGradient id="tunnel" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/><stop offset="35%" stop-color="#9a9aa2" stop-opacity="0.12"/><stop offset="100%" stop-color="#050505" stop-opacity="0"/></radialGradient>
<radialGradient id="neb1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#6a6a72" stop-opacity="0.28"/><stop offset="100%" stop-color="#050505" stop-opacity="0"/></radialGradient>
<radialGradient id="neb2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#4a4a52" stop-opacity="0.3"/><stop offset="100%" stop-color="#050505" stop-opacity="0"/></radialGradient>
<clipPath id="ball"><circle cx="940" cy="230" r="170"/></clipPath>
</defs>
<rect width="1200" height="800" fill="#050505"/>
<ellipse cx="260" cy="620" rx="420" ry="220" fill="url(#neb1)"/>
<ellipse cx="520" cy="120" rx="360" ry="160" fill="url(#neb2)"/>
${stars}
<circle class="core" cx="600" cy="400" r="260" fill="url(#tunnel)"/>
${streaksFar}
${streaksNear}
${fighter(230, 560, 1.8, 'f1')}
${fighter(420, 690, 1.2, 'f2')}
${fighter(120, 380, 0.9, 'f3')}
<circle cx="940" cy="230" r="340" fill="url(#halo)"/>
<circle cx="940" cy="230" r="170" fill="url(#sphere)"/>
<g clip-path="url(#ball)">
<g fill="none" stroke="#0a0a0b" stroke-width="3" opacity="0.9">
<path d="M750 238 Q940 264 1130 238"/>
<path d="M750 226 Q940 252 1130 226" stroke-width="1.5" opacity="0.6"/>
<path d="M770 140 Q940 172 1110 140" stroke-width="1" opacity="0.55"/>
<path d="M770 322 Q940 354 1110 322" stroke-width="1" opacity="0.55"/>
<path d="M800 82 Q940 110 1080 82" stroke-width="1" opacity="0.4"/>
<path d="M800 380 Q940 408 1080 380" stroke-width="1" opacity="0.4"/>
<path d="M850 60 Q820 230 850 400" stroke-width="1" opacity="0.4"/>
<path d="M940 55 Q925 230 940 405" stroke-width="1" opacity="0.4"/>
<path d="M1030 60 Q1060 230 1030 400" stroke-width="1" opacity="0.4"/>
</g>
${lights}
<rect x="740" y="55" width="400" height="350" fill="url(#shade)"/>
</g>
<circle cx="890" cy="165" r="40" fill="#18181a" stroke="#0a0a0b" stroke-width="3"/>
<circle cx="890" cy="165" r="31" fill="none" stroke="#6a6a70" stroke-width="1" opacity="0.7"/>
<circle class="dish" cx="890" cy="165" r="22" fill="url(#dishg)"/>
<circle cx="940" cy="230" r="170" fill="none" stroke="#c9c9d0" stroke-width="2" opacity="0.3"/>
</svg>`

const LOOK: ThemeSetArgs = {
  colors: theme,
  overrideColorScheme: 'dark',
  backdrop: { scene: 'deathstar', glass: { blur: 8, tint: '#050505', opacity: 0.6 } },
  style: {
    Heading: { color: '#ffffff', fontWeight: 'bold', letterSpacing: 1 },
    UserMessage: {
      backgroundColor: '#1a1a1c',
      borderColor: '#5a5a60',
      borderWidth: 1,
      radius: 8,
      padding: 12,
    },
    AssistantMessage: {
      backgroundColor: '#0d0d0e',
      borderColor: '#d9d9de',
      borderWidth: 1,
      radius: 8,
      padding: 12,
    },
    ToolUse: { backgroundColor: '#0d0d0e', radius: 6, paddingX: 8 },
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
      await $.theme.set({ colors: theme, overrideColorScheme: 'dark', backdrop: { scene: 'deathstar' } })
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Hyperspace-strepen, ruimtejagers en een grote grijze ruimtestation-bol" isInteractive />
  })
}
