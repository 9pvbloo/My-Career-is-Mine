export type ScrollDirection = -1 | 0 | 1

export type SceneRange = {
  start: number
  end: number
}

export const SCENE_RANGES = {
  hero: { start: 0, end: 0.12 },
  breakAway: { start: 0.12, end: 0.25 },
  momentum: { start: 0.25, end: 0.42 },
  force: { start: 0.42, end: 0.56 },
  unbound: { start: 0.56, end: 0.69 },
  freedom: { start: 0.69, end: 0.82 },
  finalStatement: { start: 0.82, end: 0.92 },
  contact: { start: 0.92, end: 1 },
} satisfies Record<string, SceneRange>

export type SceneName = keyof typeof SCENE_RANGES

export class ScrollDirector {
  progress = 0
  smoothProgress = 0
  velocity = 0
  direction: ScrollDirection = 0

  private previousProgress = 0

  constructor() {
    this.handleScroll = this.handleScroll.bind(this)

    window.addEventListener('scroll', this.handleScroll, {
      passive: true,
    })

    this.handleScroll()
    this.smoothProgress = this.progress
  }

  update(delta: number): void {
    const smoothing = 1 - Math.exp(-10 * delta)

    this.smoothProgress += (this.progress - this.smoothProgress) * smoothing

    this.velocity *= Math.exp(-8 * delta)

    if (Math.abs(this.velocity) < 0.00001) {
      this.velocity = 0
      this.direction = 0
    }
  }

  getSceneProgress(scene: SceneName): number {
    const range = SCENE_RANGES[scene]

    if (this.smoothProgress <= range.start) {
      return 0
    }

    if (this.smoothProgress >= range.end) {
      return 1
    }

    return (this.smoothProgress - range.start) / (range.end - range.start)
  }

  dispose(): void {
    window.removeEventListener('scroll', this.handleScroll)
  }

  private handleScroll(): void {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight

    const nextProgress =
      scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0

    this.previousProgress = this.progress

    this.progress = Math.min(Math.max(nextProgress, 0), 1)

    const difference = this.progress - this.previousProgress

    this.velocity = difference

    if (difference > 0) {
      this.direction = 1
    } else if (difference < 0) {
      this.direction = -1
    }
  }
}
