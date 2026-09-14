import type { Sizes } from './Sizes'

export type PointerVector = {
  x: number
  y: number
}

export class Pointer {
  readonly position: PointerVector = { x: 0, y: 0 }
  readonly previous: PointerVector = { x: 0, y: 0 }

  readonly normalized: PointerVector = { x: 0, y: 0 }
  readonly uv: PointerVector = { x: 0, y: 0 }

  readonly velocity: PointerVector = { x: 0, y: 0 }
  readonly direction: PointerVector = { x: 0, y: 0 }

  isDown = false
  isActive = false
  pointerType: PointerEvent['pointerType'] = 'mouse'

  private readonly sizes: Sizes
  private lastMoveTime = performance.now()
  private hasPosition = false
  private readonly unsubscribeResize: () => void

  constructor(sizes: Sizes) {
    this.sizes = sizes

    this.handlePointerMove = this.handlePointerMove.bind(this)
    this.handlePointerDown = this.handlePointerDown.bind(this)
    this.handlePointerUp = this.handlePointerUp.bind(this)
    this.handleWindowBlur = this.handleWindowBlur.bind(this)

    window.addEventListener('pointermove', this.handlePointerMove)
    window.addEventListener('pointerdown', this.handlePointerDown)
    window.addEventListener('pointerup', this.handlePointerUp)
    window.addEventListener('pointercancel', this.handlePointerUp)
    window.addEventListener('blur', this.handleWindowBlur)

    this.unsubscribeResize = this.sizes.onResize(() => {
      this.updateNormalizedPosition()
    })
  }

  update(delta: number): void {
    const damping = Math.exp(-12 * delta)

    this.velocity.x *= damping
    this.velocity.y *= damping

    if (Math.abs(this.velocity.x) < 0.01 && Math.abs(this.velocity.y) < 0.01) {
      this.velocity.x = 0
      this.velocity.y = 0
      this.direction.x = 0
      this.direction.y = 0
    }
  }

  dispose(): void {
    window.removeEventListener('pointermove', this.handlePointerMove)
    window.removeEventListener('pointerdown', this.handlePointerDown)
    window.removeEventListener('pointerup', this.handlePointerUp)
    window.removeEventListener('pointercancel', this.handlePointerUp)
    window.removeEventListener('blur', this.handleWindowBlur)

    this.unsubscribeResize()
  }

  private handlePointerMove(event: PointerEvent): void {
    const now = performance.now()

    this.pointerType = event.pointerType
    this.isActive = true

    if (!this.hasPosition) {
      this.position.x = event.clientX
      this.position.y = event.clientY

      this.previous.x = event.clientX
      this.previous.y = event.clientY

      this.hasPosition = true
      this.lastMoveTime = now

      this.updateNormalizedPosition()
      return
    }

    this.previous.x = this.position.x
    this.previous.y = this.position.y

    this.position.x = event.clientX
    this.position.y = event.clientY

    const deltaSeconds = Math.max((now - this.lastMoveTime) / 1000, 0.001)

    this.velocity.x = (this.position.x - this.previous.x) / deltaSeconds

    this.velocity.y = (this.position.y - this.previous.y) / deltaSeconds

    const speed = Math.hypot(this.velocity.x, this.velocity.y)

    if (speed > 0) {
      this.direction.x = this.velocity.x / speed
      this.direction.y = this.velocity.y / speed
    }

    this.lastMoveTime = now

    this.updateNormalizedPosition()
  }

  private handlePointerDown(event: PointerEvent): void {
    this.pointerType = event.pointerType
    this.isDown = true
    this.isActive = true
  }

  private handlePointerUp(): void {
    this.isDown = false
  }

  private handleWindowBlur(): void {
    this.isDown = false
    this.isActive = false
  }

  private updateNormalizedPosition(): void {
    if (!this.hasPosition) {
      return
    }

    this.uv.x = this.position.x / this.sizes.width
    this.uv.y = this.position.y / this.sizes.height

    this.normalized.x = this.uv.x * 2 - 1
    this.normalized.y = -(this.uv.y * 2 - 1)
  }
}
