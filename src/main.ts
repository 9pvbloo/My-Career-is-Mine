import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Application root not found.')
}

app.innerHTML = `
  <main>
    <h1>My Career Is Mine.</h1>
  </main>
`