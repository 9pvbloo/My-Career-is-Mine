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
              <span class="scene-label__index">01</span>
              <span class="scene-label__divider">/</span>
              <span class="scene-label__name">Instinct</span>
            </div>

            <div class="hero-content">
              <h1 id="hero-title" class="hero-title">
                <span class="hero-title__line">
                  My Career
                </span>

                <span class="hero-title__line hero-title__line--mine">
                  Is Mine<span class="hero-title__period">.</span>
                </span>
              </h1>

              <p class="hero-intro">
                <span>No predefined tracks.</span>
                <span>No borrowed timelines.</span>
              </p>
            </div>

            <div class="hero-meta" aria-hidden="true">
              <span>Experimental Digital Experience</span>
              <span>2026</span>
            </div>

            <div class="scroll-indicator" aria-hidden="true">
              <span>Scroll to move</span>
              <span class="scroll-indicator__line"></span>
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
            <div class="scene-label">
              <span class="scene-label__index">08</span>
              <span class="scene-label__divider">/</span>
              <span class="scene-label__name">Contact</span>
            </div>

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
