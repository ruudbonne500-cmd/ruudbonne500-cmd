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

// Eigen tekening: een grote grijze ruimtestation-bol met een gleuf rond het midden,
// een ronde schotel en een zachte witte gloed. Sterren knipperen, de schotel pulseert langzaam.
const stars = [
  [60, 90, 1.5, 0], [190, 50, 1.1, 1], [320, 130, 1.7, 2], [460, 70, 1.2, 3], [570, 160, 1.4, 1],
  [90, 280, 1.2, 3], [250, 330, 1.7, 0], [390, 250, 1.1, 2], [530, 340, 1.8, 1], [650, 280, 1.3, 3],
  [40, 480, 1.5, 2], [180, 550, 1.1, 0], [310, 490, 1.8, 3], [440, 570, 1.3, 1], [600, 510, 1.5, 2],
  [120, 710, 1.6, 1], [270, 750, 1.2, 3], [420, 700, 1.4, 0], [560, 770, 1.1, 2], [700, 720, 1.7, 1],
  [830, 780, 1.3, 3], [960, 720, 1.5, 0], [1090, 760, 1.2, 2], [800, 470, 1.1, 1], [1150, 520, 1.4, 3],
  [760, 40, 1.2, 2], [880, 110, 1.5, 0], [1100, 40, 1.3, 1],
]
  .map(([x, y, r, d]) => `<circle class="s d${d}" cx="${x}" cy="${y}" r="${r}" fill="#ffffff"/>`)
  .join('')

// Hyperspace: lichtstrepen die vanuit het midden naar buiten schieten.
const streaks = Array.from({ length: 48 }, (_, i) => {
  const angle = (i / 48) * Math.PI * 2 + (i % 3) * 0.04
  const r1 = 70 + (i % 5) * 18
  const len = 330 + (i % 7) * 40
  const x1 = Math.round(600 + Math.cos(angle) * r1)
  const y1 = Math.round(400 + Math.sin(angle) * r1)
  const x2 = Math.round(600 + Math.cos(angle) * (r1 + len))
  const y2 = Math.round(400 + Math.sin(angle) * (r1 + len))
  const shade = i % 2 === 0 ? '#ffffff' : '#9a9aa2'
  return `<line class="w w${i % 4}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${shade}" stroke-width="${1 + (i % 3) * 0.6}" stroke-linecap="round" pathLength="100" stroke-dasharray="14 100" stroke-dashoffset="0" opacity="0.3"/>`
}).join('')

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
<style>
.s{opacity:0.7;animation:tw 7s ease-in-out infinite}
.d1{animation-delay:-1.75s}
.d2{animation-delay:-3.5s}
.d3{animation-delay:-5.25s}
.w{animation:warp 3.2s linear infinite}
.w1{animation-delay:-0.8s}
.w2{animation-delay:-1.6s}
.w3{animation-delay:-2.4s}
@keyframes warp{0%{stroke-dashoffset:14;opacity:0}15%{opacity:0.7}100%{stroke-dashoffset:-100;opacity:0}}
.dish{opacity:0.85;animation:pulse 5s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:0.3}50%{opacity:0.9}}
@keyframes pulse{0%,100%{opacity:0.55}50%{opacity:1}}
</style>
<defs>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="55%" stop-color="#8a8a92" stop-opacity="0.35"/><stop offset="100%" stop-color="#050505" stop-opacity="0"/></radialGradient>
<radialGradient id="sphere" cx="35%" cy="30%" r="80%"><stop offset="0%" stop-color="#6a6a70"/><stop offset="55%" stop-color="#2c2c2f"/><stop offset="100%" stop-color="#0a0a0b"/></radialGradient>
<radialGradient id="dishg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff"/><stop offset="60%" stop-color="#9a9aa2"/><stop offset="100%" stop-color="#2a2a2d"/></radialGradient>
<clipPath id="ball"><circle cx="930" cy="230" r="170"/></clipPath>
</defs>
<rect width="1200" height="800" fill="#050505"/>
${stars}
${streaks}
<circle cx="930" cy="230" r="330" fill="url(#halo)"/>
<circle cx="930" cy="230" r="170" fill="url(#sphere)"/>
<g clip-path="url(#ball)" fill="none" stroke="#0a0a0b" stroke-width="3" opacity="0.9">
<path d="M740 238 Q930 262 1120 238"/>
<path d="M740 226 Q930 250 1120 226" stroke-width="1.5" opacity="0.6"/>
<path d="M770 140 Q930 170 1090 140" stroke-width="1" opacity="0.5"/>
<path d="M770 320 Q930 350 1090 320" stroke-width="1" opacity="0.5"/>
</g>
<circle cx="880" cy="165" r="38" fill="#18181a" stroke="#0a0a0b" stroke-width="3"/>
<circle class="dish" cx="880" cy="165" r="22" fill="url(#dishg)"/>
<circle cx="930" cy="230" r="170" fill="none" stroke="#c9c9d0" stroke-width="2" opacity="0.3"/>
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

    return <Svg source={SCENE} alt="Hyperspace-strepen en een grote grijze ruimtestation-bol en een witte gloed" isInteractive />
  })
}
