import './animation/gsap'
import './style.css'

import { Runtime } from './app/Runtime'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Application root not found.')
}

app.innerHTML = `
  <main>
    <h1>My Career Is Mine.</h1>
  </main>
`

const runtime = new Runtime()

runtime.start()