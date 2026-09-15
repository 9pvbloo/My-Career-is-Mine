import * as THREE from 'three'

import type { Renderer } from '../core/Renderer'
import type { Sizes } from '../core/Sizes'

const HERO_TEXTURE_PATH = '/assets/horse/hero/hero-horse.webp'

type HorseLayout = {
  heightRatio: number
  xRatio: number
  yRatio: number
}

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

    const textureAspect = image.width / image.height

    const viewportWidth = this.sizes.width
    const viewportHeight = this.sizes.height

    const viewportAspect = viewportWidth / viewportHeight

    const viewSize = this.getCameraViewSize()

    const layout = this.getHorseLayout(
      viewportWidth,
      viewportHeight,
      viewportAspect,
    )

    let horseHeight = viewSize.height * layout.heightRatio

    let horseY = viewSize.height * layout.yRatio

    if (viewportHeight < 720 && viewportWidth > 700) {
      horseHeight *= 0.92
      horseY -= viewSize.height * 0.025
    }

    const horseWidth = horseHeight * textureAspect

    const horseX = viewSize.width * layout.xRatio

    this.horse.scale.set(horseWidth, horseHeight, 1)

    this.horse.position.set(horseX, horseY, 0)
  }

  private getCameraViewSize(): {
    width: number
    height: number
  } {
    const distance = Math.abs(this.camera.position.z)

    const verticalFov = THREE.MathUtils.degToRad(this.camera.fov)

    const height = 2 * Math.tan(verticalFov / 2) * distance

    const width = height * this.camera.aspect

    return {
      width,
      height,
    }
  }

  private getHorseLayout(
    viewportWidth: number,
    viewportHeight: number,
    viewportAspect: number,
  ): HorseLayout {
    const isCompactLandscape =
      viewportWidth <= 1000 && viewportHeight <= 500 && viewportAspect > 1.35

    if (isCompactLandscape) {
      return {
        heightRatio: 1.16,
        xRatio: 0.27,
        yRatio: -0.02,
      }
    }

    if (viewportWidth <= 700) {
      return {
        heightRatio: 1.1,
        xRatio: 0.3,
        yRatio: -0.16,
      }
    }

    const isPortraitTablet = viewportWidth <= 900 && viewportAspect < 0.9

    if (isPortraitTablet) {
      return {
        heightRatio: 1.18,
        xRatio: 0.22,
        yRatio: -0.08,
      }
    }

    if (viewportWidth <= 1100) {
      return {
        heightRatio: 1.3,
        xRatio: 0.21,
        yRatio: -0.03,
      }
    }

    if (viewportAspect >= 2) {
      return {
        heightRatio: 1.48,
        xRatio: 0.22,
        yRatio: -0.01,
      }
    }

    return {
      heightRatio: 1.42,
      xRatio: 0.22,
      yRatio: -0.02,
    }
  }
}
