import { Pointer } from '../core/Pointer'
import { Renderer } from '../core/Renderer'
import { ScrollDirector } from '../core/ScrollDirector'
import { Sizes } from '../core/Sizes'
import { Time } from '../core/Time'
import { HeroScene } from '../scenes/HeroScene'

export type RuntimeUpdate = (time: Time) => void

export class Runtime {
  readonly time = new Time()
  readonly sizes: Sizes
  readonly renderer: Renderer
  readonly pointer: Pointer
  readonly scroll: ScrollDirector
  readonly heroScene: HeroScene

  private frameId: number | null = null
  private running = false
  private readonly updateCallbacks = new Set<RuntimeUpdate>()

  constructor() {
    this.sizes = new Sizes()
    this.renderer = new Renderer(this.sizes)
    this.pointer = new Pointer(this.sizes)
    this.scroll = new ScrollDirector()
    this.heroScene = new HeroScene(this.renderer, this.sizes)

    this.tick = this.tick.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
  }

  start(): void {
    if (this.running) {
      return
    }

    this.running = true
    this.time.reset()

    document.addEventListener('visibilitychange', this.handleVisibilityChange)

    this.frameId = requestAnimationFrame(this.tick)
  }

  stop(): void {
    if (!this.running) {
      return
    }

    this.running = false

    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId)
      this.frameId = null
    }

    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange,
    )
  }

  onUpdate(callback: RuntimeUpdate): () => void {
    this.updateCallbacks.add(callback)

    return () => {
      this.updateCallbacks.delete(callback)
    }
  }

  dispose(): void {
    this.stop()

    this.updateCallbacks.clear()

    this.heroScene.dispose()
    this.scroll.dispose()
    this.pointer.dispose()
    this.renderer.dispose()
    this.sizes.dispose()
  }

  private tick(now: number): void {
    if (!this.running) {
      return
    }

    this.time.update(now)
    this.pointer.update(this.time.delta)
    this.scroll.update(this.time.delta)

    for (const callback of this.updateCallbacks) {
      callback(this.time)
    }

    this.heroScene.update()

    this.frameId = requestAnimationFrame(this.tick)
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      if (this.frameId !== null) {
        cancelAnimationFrame(this.frameId)
        this.frameId = null
      }

      return
    }

    if (this.running && this.frameId === null) {
      this.time.reset()
      this.frameId = requestAnimationFrame(this.tick)
    }
  }
}
