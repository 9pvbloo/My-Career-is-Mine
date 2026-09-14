import * as THREE from 'three'

import type { Renderer } from '../core/Renderer'
import type { Sizes } from '../core/Sizes'

export class HeroScene {
  readonly scene: THREE.Scene
  readonly camera: THREE.PerspectiveCamera

  private readonly renderer: Renderer
  private readonly sizes: Sizes
  private readonly unsubscribeResize: () => void

  constructor(renderer: Renderer, sizes: Sizes) {
    this.renderer = renderer
    this.sizes = sizes

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100,
    )

    this.camera.position.set(0, 0, 5)

    this.unsubscribeResize = this.sizes.onResize(() => {
      this.resize()
    })

    this.resize()
  }

  update(): void {
    this.renderer.instance.render(this.scene, this.camera)
  }

  dispose(): void {
    this.unsubscribeResize()
    this.scene.clear()
  }

  private resize(): void {
    this.camera.aspect = this.sizes.width / this.sizes.height

    this.camera.updateProjectionMatrix()
  }
}
