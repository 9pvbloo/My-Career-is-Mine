import * as THREE from 'three'

import type { Renderer } from '../core/Renderer'
import type { Sizes } from '../core/Sizes'

const HERO_TEXTURE_PATH = '/assets/horse/hero/hero-horse.webp'

export class HeroScene {
  readonly scene: THREE.Scene
  readonly camera: THREE.PerspectiveCamera

  private readonly renderer: Renderer
  private readonly sizes: Sizes
  private readonly textureLoader = new THREE.TextureLoader()
  private readonly geometry = new THREE.PlaneGeometry(1, 1)
  private readonly material = new THREE.MeshBasicMaterial({
    transparent: true,
    toneMapped: false,
  })
  private readonly horse = new THREE.Mesh(this.geometry, this.material)
  private readonly unsubscribeResize: () => void

  private horseTexture: THREE.Texture | null = null

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

    this.scene.add(this.horse)

    this.unsubscribeResize = this.sizes.onResize(() => {
      this.resize()
    })

    this.loadHorseTexture()
    this.resize()
  }

  update(): void {
    this.renderer.instance.render(this.scene, this.camera)
  }

  dispose(): void {
    this.unsubscribeResize()

    this.horseTexture?.dispose()
    this.material.dispose()
    this.geometry.dispose()

    this.scene.remove(this.horse)
    this.scene.clear()
  }

  private loadHorseTexture(): void {
    this.textureLoader.load(
      HERO_TEXTURE_PATH,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.generateMipmaps = false

        this.horseTexture = texture
        this.material.map = texture
        this.material.needsUpdate = true

        this.updateHorseTransform()
      },
      undefined,
      (error) => {
        console.error('Failed to load hero horse texture.', error)
      },
    )
  }

  private resize(): void {
    this.camera.aspect = this.sizes.width / this.sizes.height

    this.camera.updateProjectionMatrix()

    this.updateHorseTransform()
  }

  private updateHorseTransform(): void {
    if (!this.horseTexture?.image) {
      return
    }

    const image = this.horseTexture.image as HTMLImageElement

    const aspect = image.width / image.height

    const height = this.sizes.width < 768 ? 3.4 : 4.6
    const width = height * aspect

    this.horse.scale.set(width, height, 1)

    if (this.sizes.width < 768) {
      this.horse.position.set(0.35, -0.35, 0)
      return
    }

    this.horse.position.set(1.15, -0.05, 0)
  }
}
