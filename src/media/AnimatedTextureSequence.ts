import * as THREE from 'three'

export type AnimatedTextureSequenceOptions = {
  configureTexture?: (texture: THREE.Texture) => void
  fps?: number
  loop?: boolean
  onError?: (url: string, error: unknown) => void
}

/**
 * Loads and plays an ordered collection of textures without allocating during
 * frame updates. Until the requested frame has loaded, the first available
 * texture remains visible.
 */
export class AnimatedTextureSequence {
  private readonly textures: Array<THREE.Texture | null>
  private readonly textureLoader = new THREE.TextureLoader()
  private readonly configureTexture?: (texture: THREE.Texture) => void
  private readonly onError?: (url: string, error: unknown) => void
  private readonly frameDuration: number
  private readonly loop: boolean

  private availableTexture: THREE.Texture | null = null
  private currentFrameIndex = 0
  private elapsedFrameTime = 0
  private disposed = false

  constructor(
    frameUrls: readonly string[],
    {
      configureTexture,
      fps = 24,
      loop = true,
      onError,
    }: AnimatedTextureSequenceOptions = {},
  ) {
    if (frameUrls.length === 0) {
      throw new RangeError(
        'Animated texture sequence requires at least one frame.',
      )
    }

    if (!Number.isFinite(fps) || fps <= 0) {
      throw new RangeError(
        'Animated texture sequence fps must be greater than 0.',
      )
    }

    this.textures = new Array(frameUrls.length).fill(null)
    this.configureTexture = configureTexture
    this.onError = onError
    this.frameDuration = 1 / fps
    this.loop = loop

    for (let frameIndex = 0; frameIndex < frameUrls.length; frameIndex += 1) {
      this.loadTexture(frameUrls[frameIndex], frameIndex)
    }
  }

  get currentTexture(): THREE.Texture | null {
    return this.textures[this.currentFrameIndex] ?? this.availableTexture
  }

  update(delta: number): void {
    if (
      this.disposed ||
      this.textures.length < 2 ||
      !Number.isFinite(delta) ||
      delta <= 0
    ) {
      return
    }

    this.elapsedFrameTime += delta

    if (this.elapsedFrameTime < this.frameDuration) {
      return
    }

    const frameSteps = Math.floor(this.elapsedFrameTime / this.frameDuration)

    this.elapsedFrameTime -= frameSteps * this.frameDuration

    if (this.loop) {
      this.currentFrameIndex =
        (this.currentFrameIndex + frameSteps) % this.textures.length
      return
    }

    this.currentFrameIndex = Math.min(
      this.currentFrameIndex + frameSteps,
      this.textures.length - 1,
    )
  }

  dispose(): void {
    if (this.disposed) {
      return
    }

    this.disposed = true

    for (
      let frameIndex = 0;
      frameIndex < this.textures.length;
      frameIndex += 1
    ) {
      this.textures[frameIndex]?.dispose()
      this.textures[frameIndex] = null
    }

    this.availableTexture = null
  }

  private loadTexture(url: string, frameIndex: number): void {
    this.textureLoader.load(
      url,
      (texture) => {
        if (this.disposed) {
          texture.dispose()
          return
        }

        this.configureTexture?.(texture)
        this.textures[frameIndex] = texture
        this.availableTexture ??= texture
      },
      undefined,
      (error) => {
        if (!this.disposed) {
          this.onError?.(url, error)
        }
      },
    )
  }
}
