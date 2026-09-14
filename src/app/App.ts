export class App {
  readonly root: HTMLDivElement

  constructor(root: HTMLDivElement) {
    this.root = root
    this.render()
  }

  private render(): void {
    this.root.innerHTML = `
      <div class="experience">
        <div
          id="webgl-root"
          class="webgl-layer"
          aria-hidden="true"
        ></div>

        <header class="site-header">
          <a class="site-brand" href="#hero">
            MY CAREER IS MINE.
          </a>

          <nav class="site-nav" aria-label="Primary navigation">
            <a href="#hero">Instinct</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <main>
          <section
            id="hero"
            class="scene scene--hero"
            aria-labelledby="hero-title"
          >
            <div class="scene-label">
              <span>01</span>
              <span>Instinct</span>
            </div>

            <div class="hero-content">
              <h1 id="hero-title">
                <span>My Career</span>
                <span>Is Mine.</span>
              </h1>

              <p class="hero-intro">
                No predefined tracks.<br />
                No borrowed timelines.
              </p>
            </div>

            <div class="scroll-indicator" aria-hidden="true">
              <span>Scroll</span>
              <span>↓</span>
            </div>
          </section>

          <section
            class="scene scene--break-away"
            aria-label="Break Away"
          ></section>

          <section
            class="scene scene--momentum"
            aria-label="Momentum"
          ></section>

          <section
            class="scene scene--force"
            aria-label="Force"
          ></section>

          <section
            class="scene scene--unbound"
            aria-label="Unbound"
          ></section>

          <section
            class="scene scene--freedom"
            aria-label="Freedom"
          ></section>

          <section
            class="scene scene--statement"
            aria-labelledby="statement-title"
          >
            <h2 id="statement-title">
              My Career Is Mine.
            </h2>
          </section>

          <section
            id="contact"
            class="scene scene--contact"
            aria-labelledby="contact-title"
          >
            <span class="scene-label">
              08 / Contact
            </span>

            <h2 id="contact-title">Contact</h2>

            <p>
              Want to build something unforgettable?
            </p>

            <a
              href="https://github.com/9pvbloo"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          </section>
        </main>

        <footer class="site-footer">
          <span>My Career Is Mine.</span>
          <span>2026</span>
        </footer>
      </div>
    `
  }
}