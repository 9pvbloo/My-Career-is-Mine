import * as THREE from 'three'

import type { Pointer } from '../core/Pointer'
import type { Renderer } from '../core/Renderer'
import type { Sizes } from '../core/Sizes'
import fragmentShader from '../shaders/liquidField.frag.glsl?raw'
import vertexShader from '../shaders/liquidField.vert.glsl?raw'

const MIN_SIMULATION_DIMENSION = 128
const MAX_SIMULATION_DIMENSION = 320
const MAX_SIMULATION_LONG_DIMENSION = 640
const SIMULATION_SCALE = 0.4
const MAX_POINTER_SPEED = 1800
const MIN_POINTER_SPEED = 8

export class LiquidField {
  private readonly renderer: Renderer
  private readonly sizes: Sizes
  private readonly pointer: Pointer

  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private readonly geometry = new THREE.PlaneGeometry(2, 2)
  private readonly pointerUv = new THREE.Vector2()
  private readonly pointerVelocity = new THREE.Vector2()
  private readonly pointerDirection = new THREE.Vector2()

  private readonly material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      uPreviousField: { value: null },
      uPointerUv: { value: this.pointerUv },
      uPointerVelocity: { value: this.pointerVelocity },
      uPointerDirection: { value: this.pointerDirection },
      uPointerIntensity: { value: 0 },
      uDelta: { value: 0 },
      uAspect: { value: 1 },
      uReset: { value: 1 },
    },
  })

  private readonly quad = new THREE.Mesh(this.geometry, this.material)

  private readTarget: THREE.WebGLRenderTarget
  private writeTarget: THREE.WebGLRenderTarget

  constructor(renderer: Renderer, sizes: Sizes, pointer: Pointer) {
    this.renderer = renderer
    this.sizes = sizes
    this.pointer = pointer

    const targetSize = this.getTargetSize()

    this.readTarget = this.createRenderTarget(
      targetSize.width,
      targetSize.height,
    )
    this.writeTarget = this.createRenderTarget(
      targetSize.width,
      targetSize.height,
    )

    this.scene.add(this.quad)
    this.updateAspect(targetSize.width, targetSize.height)
    this.reset()
  }

  get texture(): THREE.Texture {
    return this.readTarget.texture
  }

  update(delta: number): void {
    const speed = Math.hypot(this.pointer.velocity.x, this.pointer.velocity.y)
    const normalizedSpeed = THREE.MathUtils.clamp(
      speed / MAX_POINTER_SPEED,
      0,
      1,
    )
    const hasInput = this.pointer.isActive && speed >= MIN_POINTER_SPEED
    const inputMultiplier = this.pointer.pointerType === 'touch' ? 0.7 : 1
    const pressureMultiplier = this.pointer.isDown ? 1.12 : 1

    this.pointerUv.set(
      THREE.MathUtils.clamp(this.pointer.uv.x, 0, 1),
      1 - THREE.MathUtils.clamp(this.pointer.uv.y, 0, 1),
    )
    this.pointerVelocity.set(
      (this.pointer.velocity.x / MAX_POINTER_SPEED) * (hasInput ? 1 : 0),
      (-this.pointer.velocity.y / MAX_POINTER_SPEED) * (hasInput ? 1 : 0),
    )
    this.pointerDirection.set(
      this.pointer.direction.x * (hasInput ? 1 : 0),
      -this.pointer.direction.y * (hasInput ? 1 : 0),
    )

    this.material.uniforms.uPreviousField.value = this.readTarget.texture
    this.material.uniforms.uPointerIntensity.value =
      normalizedSpeed * inputMultiplier * pressureMultiplier
    this.material.uniforms.uDelta.value = Math.min(Math.max(delta, 0), 0.1)
    this.material.uniforms.uReset.value = 0

    this.renderToWriteTarget()
    this.swapTargets()
  }

  resize(): void {
    const targetSize = this.getTargetSize()

    if (
      this.readTarget.width === targetSize.width &&
      this.readTarget.height === targetSize.height
    ) {
      return
    }

    this.readTarget.dispose()
    this.writeTarget.dispose()

    this.readTarget = this.createRenderTarget(
      targetSize.width,
      targetSize.height,
    )
    this.writeTarget = this.createRenderTarget(
      targetSize.width,
      targetSize.height,
    )

    this.updateAspect(targetSize.width, targetSize.height)
    this.reset()
  }

  dispose(): void {
    this.readTarget.dispose()
    this.writeTarget.dispose()
    this.material.dispose()
    this.geometry.dispose()

    this.scene.remove(this.quad)
    this.scene.clear()
  }

  private createRenderTarget(
    width: number,
    height: number,
  ): THREE.WebGLRenderTarget {
    const target = new THREE.WebGLRenderTarget(width, height, {
      depthBuffer: false,
      stencilBuffer: false,
      magFilter: THREE.LinearFilter,
      minFilter: THREE.LinearFilter,
      generateMipmaps: false,
    })

    target.texture.colorSpace = THREE.NoColorSpace

    return target
  }

  private getTargetSize(): { width: number; height: number } {
    const viewportWidth = Math.max(this.sizes.width, 1)
    const viewportHeight = Math.max(this.sizes.height, 1)
    const aspect = viewportWidth / viewportHeight
    const shortDimension = THREE.MathUtils.clamp(
      Math.round(Math.min(viewportWidth, viewportHeight) * SIMULATION_SCALE),
      MIN_SIMULATION_DIMENSION,
      MAX_SIMULATION_DIMENSION,
    )

    let width = shortDimension
    let height = Math.round(shortDimension / aspect)

    if (aspect >= 1) {
      width = Math.round(shortDimension * aspect)
      height = shortDimension
    }

    const longestDimension = Math.max(width, height)

    if (longestDimension > MAX_SIMULATION_LONG_DIMENSION) {
      const scale = MAX_SIMULATION_LONG_DIMENSION / longestDimension

      width = Math.max(1, Math.round(width * scale))
      height = Math.max(1, Math.round(height * scale))
    }

    return {
      width,
      height,
    }
  }

  private updateAspect(width: number, height: number): void {
    this.material.uniforms.uAspect.value = width / height
  }

  private reset(): void {
    this.material.uniforms.uReset.value = 1
    this.renderToWriteTarget()
    this.swapTargets()
    this.material.uniforms.uReset.value = 0
  }

  private renderToWriteTarget(): void {
    const activeRenderTarget = this.renderer.instance.getRenderTarget()

    try {
      this.renderer.instance.setRenderTarget(this.writeTarget)
      this.renderer.instance.render(this.scene, this.camera)
    } finally {
      this.renderer.instance.setRenderTarget(activeRenderTarget)
    }
  }

  private swapTargets(): void {
    const previousReadTarget = this.readTarget

    this.readTarget = this.writeTarget
    this.writeTarget = previousReadTarget
  }
}
