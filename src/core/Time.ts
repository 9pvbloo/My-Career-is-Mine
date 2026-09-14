export class Time {
  private start = performance.now()
  private previous = this.start

  elapsed = 0
  delta = 0

  update(now: number): void {
    this.delta = Math.min((now - this.previous) / 1000, 0.1)
    this.elapsed = (now - this.start) / 1000
    this.previous = now
  }

  reset(now = performance.now()): void {
    this.previous = now
  }
}
