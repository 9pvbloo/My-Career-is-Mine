import '@fontsource/barlow-condensed/700.css'
import '@fontsource/barlow-condensed/800.css'

import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'

import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'

import './animation/gsap'
import './style.css'

import { App } from './app/App'
import { Runtime } from './app/Runtime'

type RenderingMode = 'webgl-supported' | 'webgl-fallback'

const root = document.querySelector<HTMLDivElement>('#app')

if (!root) {
  throw new Error('Application root not found.')
}

new App(root)

let runtime: Runtime | null = null

const setRenderingMode = (mode: RenderingMode): void => {
  document.documentElement.classList.remove('webgl-supported', 'webgl-fallback')

  document.documentElement.classList.add(mode)
}

const activateFallback = (): void => {
  runtime?.stop()

  setRenderingMode('webgl-fallback')
}

try {
  runtime = new Runtime()

  runtime.start()

  setRenderingMode('webgl-supported')

  runtime.renderer.canvas.addEventListener('webglcontextlost', activateFallback)
} catch (error) {
  setRenderingMode('webgl-fallback')

  console.warn('WebGL unavailable. Using static hero fallback.', error)
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    runtime?.renderer.canvas.removeEventListener(
      'webglcontextlost',
      activateFallback,
    )

    runtime?.dispose()
  })
}
