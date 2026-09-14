export type ResizeCallback = () => void

export class Sizes {
  width = window.innerWidth
  height = window.innerHeight
  pixelRatio = Math.min(window.devicePixelRatio, 1.5)

  private readonly resizeCallbacks = new Set<ResizeCallback>()

  constructor() {
    this.handleResize = this.handleResize.bind(this)

    window.addEventListener('resize', this.handleResize)
  }

  onResize(callback: ResizeCallback): () => void {
    this.resizeCallbacks.add(callback)

    return () => {
      this.resizeCallbacks.delete(callback)
    }
  }

  dispose(): void {
    window.removeEventListener('resize', this.handleResize)
    this.resizeCallbacks.clear()
  }

  private handleResize(): void {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 1.5)

    for (const callback of this.resizeCallbacks) {
      callback()
    }
  }
}