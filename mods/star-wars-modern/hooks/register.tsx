import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Donkere ruimte, gele (Imperial) tekstaccenten en blauwe (hyperspace) accenten.
const { theme, problems } = makeColors({
  label: 'Star Wars modern',
  roles: { accent: '#4aa8ff', danger: '#ff5a4d', success: '#5fd38d', warning: '#ffd341', pro: '#a98bff' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#05070f',
        'surface-1': '#0a0f1c',
        'surface-2': '#0f1626',
        'surface-3': '#141d31',
        'text-primary': '#eef3ff',
        'text-secondary': '#c3cde6',
        'text-muted': '#9aa8c9',
      },
    },
  },
  only: 'dark',
})

// Sterrenhemel: pure vector, langzaam knipperende sterren en een blauwe gloed.
const stars = [
  [60, 80, 1.6, 0], [180, 40, 1.1, 1], [310, 120, 1.8, 2], [450, 60, 1.2, 3], [560, 150, 1.5, 1],
  [700, 50, 1.9, 2], [820, 130, 1.1, 0], [940, 70, 1.6, 3], [1060, 140, 1.3, 1], [1150, 40, 1.8, 2],
  [90, 260, 1.2, 3], [240, 320, 1.7, 0], [380, 240, 1.1, 2], [520, 330, 1.9, 1], [660, 270, 1.3, 3],
  [790, 350, 1.6, 0], [920, 250, 1.2, 2], [1040, 340, 1.8, 1], [1140, 280, 1.1, 3],
  [40, 470, 1.5, 2], [170, 540, 1.1, 0], [300, 480, 1.8, 3], [430, 560, 1.3, 1], [590, 500, 1.6, 2],
  [720, 570, 1.1, 0], [860, 490, 1.9, 3], [990, 560, 1.4, 1], [1110, 500, 1.2, 2],
  [110, 700, 1.7, 1], [260, 740, 1.2, 3], [410, 690, 1.5, 0], [550, 760, 1.1, 2], [680, 710, 1.8, 1],
  [820, 770, 1.3, 3], [950, 700, 1.6, 0], [1080, 750, 1.2, 2],
]
  .map(([x, y, r, d]) => `<circle class="s d${d}" cx="${x}" cy="${y}" r="${r}" fill="#ffffff"/>`)
  .join('')

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
<style>
.s{opacity:0.75;animation:tw 6s ease-in-out infinite}
.d1{animation-delay:-1.5s}
.d2{animation-delay:-3s}
.d3{animation-delay:-4.5s}
@keyframes tw{0%,100%{opacity:0.35}50%{opacity:0.95}}
</style>
<defs>
<radialGradient id="g1" cx="85%" cy="12%" r="55%"><stop offset="0%" stop-color="#1b4f9c" stop-opacity="0.45"/><stop offset="100%" stop-color="#05070f" stop-opacity="0"/></radialGradient>
<radialGradient id="g2" cx="10%" cy="95%" r="50%"><stop offset="0%" stop-color="#6b4a08" stop-opacity="0.35"/><stop offset="100%" stop-color="#05070f" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1200" height="800" fill="#05070f"/>
<rect width="1200" height="800" fill="url(#g1)"/>
<rect width="1200" height="800" fill="url(#g2)"/>
${stars}
</svg>`

const LOOK: ThemeSetArgs = {
  colors: theme,
  overrideColorScheme: 'dark',
  backdrop: { scene: 'starfield', glass: { blur: 8, tint: '#05070f', opacity: 0.55 } },
  style: {
    Heading: { color: '#ffd341', fontWeight: 'bold', letterSpacing: 1 },
    UserMessage: {
      backgroundColor: '#0f1c33',
      borderColor: '#4aa8ff',
      borderWidth: 1,
      radius: 10,
      padding: 12,
    },
    AssistantMessage: {
      backgroundColor: '#0a0f1c',
      borderColor: '#ffd341',
      borderWidth: 1,
      radius: 10,
      padding: 12,
    },
    ToolUse: { backgroundColor: '#0a0f1c', radius: 6, paddingX: 8 },
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
      await $.theme.set({ colors: theme, overrideColorScheme: 'dark', backdrop: { scene: 'starfield' } })
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Sterrenhemel met een blauwe gloed" isInteractive />
  })
}
