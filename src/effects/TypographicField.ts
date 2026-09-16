import * as THREE from 'three'

import fragmentShader from '../shaders/typographicField.frag.glsl?raw'
import vertexShader from '../shaders/typographicField.vert.glsl?raw'

const CHARACTER_TEXTURE_SIZE = 512
const CHARACTER_GRID_SIZE = 32
const DESKTOP_CHARACTER_SIZE = 14
const TABLET_CHARACTER_SIZE = 13
const MOBILE_CHARACTER_SIZE = 15
const DESKTOP_OPACITY = 0.3
const TABLET_OPACITY = 0.27
const MOBILE_OPACITY = 0.19

const CHARACTER_SET = ['M', 'I', 'N', 'E', '0', '1', '/', '+', '*']

export class TypographicField {
  readonly mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>

  private readonly geometry = new THREE.PlaneGeometry(1, 1)
  private readonly horseScreenBounds = new THREE.Vector4(0, 0, 1, 1)
  private readonly patternRepeat = new THREE.Vector2()
  private readonly texture: THREE.CanvasTexture
  private readonly material: THREE.ShaderMaterial

  constructor(
    liquidFieldTexture: THREE.Texture,
    drawingBufferSize: THREE.Vector2,
  ) {
    this.texture = this.createCharacterTexture()
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
      vertexShader,
      fragmentShader,
      uniforms: {
        uCharacterTexture: { value: this.texture },
        uLiquidField: { value: liquidFieldTexture },
        uHorseTexture: { value: null },
        uHorseScreenBounds: { value: this.horseScreenBounds },
        uResolution: { value: drawingBufferSize },
        uPatternRepeat: { value: this.patternRepeat },
        uOpacity: { value: DESKTOP_OPACITY },
      },
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.z = -0.1
    this.mesh.renderOrder = -1
  }

  setLiquidFieldTexture(texture: THREE.Texture): void {
    this.material.uniforms.uLiquidField.value = texture
  }

  setHorseTexture(texture: THREE.Texture): void {
    this.material.uniforms.uHorseTexture.value = texture
  }

  setHorseScreenBounds(bounds: THREE.Vector4): void {
    this.horseScreenBounds.copy(bounds)
  }

  resize(
    viewWidth: number,
    viewHeight: number,
    viewportWidth: number,
    viewportHeight: number,
  ): void {
    const isMobile = viewportWidth <= 700
    const isTablet = viewportWidth <= 1100
    const characterSize = isMobile
      ? MOBILE_CHARACTER_SIZE
      : isTablet
        ? TABLET_CHARACTER_SIZE
        : DESKTOP_CHARACTER_SIZE
    const tileSize = CHARACTER_GRID_SIZE * characterSize

    this.mesh.scale.set(viewWidth, viewHeight, 1)
    this.patternRepeat.set(
      Math.max(viewportWidth / tileSize, 1),
      Math.max(viewportHeight / tileSize, 1),
    )
    this.material.uniforms.uOpacity.value = isMobile
      ? MOBILE_OPACITY
      : isTablet
        ? TABLET_OPACITY
        : DESKTOP_OPACITY
  }

  dispose(): void {
    this.texture.dispose()
    this.material.dispose()
    this.geometry.dispose()
  }

  private createCharacterTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Unable to create the typographic field texture.')
    }

    canvas.width = CHARACTER_TEXTURE_SIZE
    canvas.height = CHARACTER_TEXTURE_SIZE

    const cellSize = CHARACTER_TEXTURE_SIZE / CHARACTER_GRID_SIZE

    context.clearRect(0, 0, CHARACTER_TEXTURE_SIZE, CHARACTER_TEXTURE_SIZE)
    context.fillStyle = '#ffffff'
    context.font = `500 ${Math.round(cellSize * 0.72)}px "IBM Plex Mono", monospace`
    context.textAlign = 'center'
    context.textBaseline = 'middle'

    for (let row = 0; row < CHARACTER_GRID_SIZE; row += 1) {
      for (let column = 0; column < CHARACTER_GRID_SIZE; column += 1) {
        const sequenceIndex =
          (column * 7 + row * 11 + Math.floor(row / 4) * 3) %
          CHARACTER_SET.length
        const isSparseCell = (column * 5 + row * 3) % 17 === 0
        const opacity = (column + row * 2) % 5 === 0 ? 0.32 : 0.62

        if (isSparseCell) {
          continue
        }

        context.globalAlpha = opacity
        context.fillText(
          CHARACTER_SET[sequenceIndex],
          (column + 0.5) * cellSize,
          (row + 0.52) * cellSize,
        )
      }
    }

    context.globalAlpha = 1

    const texture = new THREE.CanvasTexture(canvas)

    texture.colorSpace = THREE.NoColorSpace
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.LinearFilter
    texture.minFilter = THREE.LinearFilter
    texture.generateMipmaps = false

    return texture
  }
}
