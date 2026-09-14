import './animation/gsap'
import './style.css'

import { App } from './app/App'
import { Runtime } from './app/Runtime'

const root = document.querySelector<HTMLDivElement>('#app')

if (!root) {
  throw new Error('Application root not found.')
}

new App(root)

const runtime = new Runtime()

runtime.start()

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    runtime.dispose()
  })
}
