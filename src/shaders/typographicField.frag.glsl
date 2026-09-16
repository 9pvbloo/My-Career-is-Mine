#include <common>

uniform sampler2D uCharacterTexture;
uniform sampler2D uLiquidField;
uniform sampler2D uHorseTexture;
uniform vec4 uHorseScreenBounds;
uniform vec2 uResolution;
uniform vec2 uPatternRepeat;
uniform float uOpacity;

varying vec2 vUv;

void main() {
  vec2 screenUv = gl_FragCoord.xy / uResolution;
  vec4 field = texture2D(uLiquidField, screenUv);
  vec2 displacement = field.rg * 2.0 - 1.0;
  float trailStrength = clamp(field.b, 0.0, 1.0);

  vec2 characterUv = screenUv * uPatternRepeat;
  vec2 liquidOffset = displacement * (0.006 + trailStrength * 0.024);
  characterUv += liquidOffset * uPatternRepeat;

  vec4 character = texture2D(uCharacterTexture, characterUv);

  vec2 horseSize = max(
    uHorseScreenBounds.zw - uHorseScreenBounds.xy,
    vec2(0.0001)
  );
  vec2 horseUv = (screenUv - uHorseScreenBounds.xy) / horseSize;
  float horseWithinBounds =
    step(0.0, horseUv.x) * step(horseUv.x, 1.0) *
    step(0.0, horseUv.y) * step(horseUv.y, 1.0);
  vec4 horseSample = texture2D(
    uHorseTexture,
    clamp(horseUv, vec2(0.001), vec2(0.999))
  );
  float horseMask = horseWithinBounds * horseSample.a;
  float horseLuminance = dot(
    horseSample.rgb,
    vec3(0.299, 0.587, 0.114)
  );
  float horseHighlights = smoothstep(0.08, 0.68, horseLuminance);
  float horseStructure = horseMask *
    mix(0.1, 0.7, horseHighlights);

  vec2 titleOffset = (screenUv - vec2(0.27, 0.57)) * vec2(0.72, 1.0);
  float titleSuppression = 1.0 - smoothstep(0.08, 0.62, length(titleOffset));
  float edgeVignette = smoothstep(0.0, 0.18, screenUv.y) *
    smoothstep(0.0, 0.18, 1.0 - screenUv.y);
  float backgroundOpacity = character.a * uOpacity *
    mix(0.6, 1.0, edgeVignette) *
    mix(1.0, 0.58, titleSuppression);
  float horseOpacity = character.a * horseStructure * 0.48;
  float opacity = max(backgroundOpacity, horseOpacity);
  vec3 backgroundInk = mix(vec3(0.31), vec3(0.945), character.a);
  vec3 horseInk = mix(vec3(0.18), vec3(0.98), horseHighlights);
  vec3 ink = mix(backgroundInk, horseInk, horseMask);

  gl_FragColor = vec4(ink, opacity);

  #include <colorspace_fragment>
}
