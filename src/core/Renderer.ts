import * as THREE from 'three'

import type { Sizes } from './Sizes'

export class Renderer {
  readonly instance: THREE.WebGLRenderer
  readonly canvas: HTMLCanvasElement

  private readonly unsubscribeResize: () => void
  private readonly ownsCanvas: boolean

  constructor(sizes: Sizes, canvas?: HTMLCanvasElement) {
    this.ownsCanvas = !canvas

    this.canvas = canvas ?? document.createElement('canvas')

    if (this.ownsCanvas) {
      this.canvas.classList.add('webgl')
      document.body.prepend(this.canvas)
    }

    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })

    this.instance.outputColorSpace = THREE.SRGBColorSpace

    this.resize(sizes)

    this.unsubscribeResize = sizes.onResize(() => {
      this.resize(sizes)
    })
  }

  resize(sizes: Sizes): void {
    this.instance.setSize(sizes.width, sizes.height)
    this.instance.setPixelRatio(sizes.pixelRatio)
  }

  dispose(): void {
    this.unsubscribeResize()
    this.instance.dispose()

    if (this.ownsCanvas) {
      this.canvas.remove()
    }
  }
}