import * as THREE from 'three'

import type { Pointer } from '../core/Pointer'
import type { Renderer } from '../core/Renderer'
import type { Sizes } from '../core/Sizes'
import { LiquidField } from '../effects/LiquidField'
import { TypographicField } from '../effects/TypographicField'
import { AnimatedTextureSequence } from '../media/AnimatedTextureSequence'
import fragmentShader from '../shaders/horseLiquid.frag.glsl?raw'
import vertexShader from '../shaders/horseLiquid.vert.glsl?raw'

const HERO_HORSE_FRAME_URLS = ['/assets/horse/hero/hero-horse.webp'] as const
const HERO_HORSE_FPS = 24
const HORSE_LIQUID_DISTORTION_STRENGTH = 0.12
const TYPOGRAPHIC_FIELD_DEPTH = -0.1

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
  private readonly liquidField: LiquidField
  private readonly typographicField: TypographicField
  private readonly horseSequence: AnimatedTextureSequence
  private readonly drawingBufferSize = new THREE.Vector2()
  private readonly horseScreenBounds = new THREE.Vector4()

  private readonly geometry = new THREE.PlaneGeometry(1, 1)

  private readonly material = new THREE.ShaderMaterial({
    transparent: true,
    toneMapped: false,
    vertexShader,
    fragmentShader,
    uniforms: {
      uHorseTexture: { value: null },
      uLiquidField: { value: null },
      uResolution: { value: this.drawingBufferSize },
      uDistortionStrength: { value: HORSE_LIQUID_DISTORTION_STRENGTH },
    },
  })

  private readonly horse = new THREE.Mesh(this.geometry, this.material)

  private readonly unsubscribeResize: () => void

  private horseTexture: THREE.Texture | null = null

  constructor(renderer: Renderer, sizes: Sizes, pointer: Pointer) {
    this.renderer = renderer
    this.sizes = sizes
    this.liquidField = new LiquidField(renderer, sizes, pointer)
    this.material.uniforms.uLiquidField.value = this.liquidField.texture
    this.typographicField = new TypographicField(
      this.liquidField.texture,
      this.drawingBufferSize,
    )

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100,
    )

    this.camera.position.set(0, 0, 5)

    this.scene.add(this.typographicField.mesh, this.horse)

    this.unsubscribeResize = this.sizes.onResize(() => {
      this.resize()
    })

    this.horseSequence = new AnimatedTextureSequence(HERO_HORSE_FRAME_URLS, {
      fps: HERO_HORSE_FPS,
      configureTexture: this.configureHorseTexture,
      onError: (url, error) => {
        console.error(`Failed to load hero horse texture: ${url}`, error)
      },
    })

    this.resize()
  }

  update(delta: number): void {
    this.liquidField.update(delta)
    this.material.uniforms.uLiquidField.value = this.liquidField.texture
    this.typographicField.setLiquidFieldTexture(this.liquidField.texture)
    this.horseSequence.update(delta)
    this.syncHorseTexture()

    this.renderer.instance.render(this.scene, this.camera)
  }

  dispose(): void {
    this.unsubscribeResize()

    this.liquidField.dispose()
    this.typographicField.dispose()
    this.horseSequence.dispose()
    this.material.dispose()
    this.geometry.dispose()

    this.scene.remove(this.typographicField.mesh, this.horse)
    this.scene.clear()
  }

  private configureHorseTexture(texture: THREE.Texture): void {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
  }

  private syncHorseTexture(): void {
    const texture = this.horseSequence.currentTexture

    if (!texture || texture === this.horseTexture) {
      return
    }

    this.horseTexture = texture
    this.material.uniforms.uHorseTexture.value = texture
    this.typographicField.setHorseTexture(texture)
    this.updateHorseTransform()
  }

  private resize(): void {
    this.camera.aspect = this.sizes.width / this.sizes.height

    this.camera.updateProjectionMatrix()

    this.liquidField.resize()
    this.updateDrawingBufferSize()
    this.updateTypographicFieldTransform()
    this.updateHorseTransform()
  }

  private updateDrawingBufferSize(): void {
    this.renderer.instance.getDrawingBufferSize(this.drawingBufferSize)
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
    this.updateHorseScreenBounds(viewSize)
  }

  private updateTypographicFieldTransform(): void {
    const viewSize = this.getCameraViewSize(TYPOGRAPHIC_FIELD_DEPTH)

    this.typographicField.resize(
      viewSize.width,
      viewSize.height,
      this.sizes.width,
      this.sizes.height,
    )
  }

  private updateHorseScreenBounds(viewSize: {
    width: number
    height: number
  }): void {
    const halfHorseWidth = this.horse.scale.x / 2
    const halfHorseHeight = this.horse.scale.y / 2

    this.horseScreenBounds.set(
      0.5 + (this.horse.position.x - halfHorseWidth) / viewSize.width,
      0.5 + (this.horse.position.y - halfHorseHeight) / viewSize.height,
      0.5 + (this.horse.position.x + halfHorseWidth) / viewSize.width,
      0.5 + (this.horse.position.y + halfHorseHeight) / viewSize.height,
    )

    this.typographicField.setHorseScreenBounds(this.horseScreenBounds)
  }

  private getCameraViewSize(depth = 0): {
    width: number
    height: number
  } {
    const distance = Math.abs(this.camera.position.z - depth)

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
