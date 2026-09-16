#include <common>

uniform sampler2D uHorseTexture;
uniform sampler2D uLiquidField;
uniform vec2 uResolution;
uniform float uDistortionStrength;

varying vec2 vUv;

const float MAX_UV_DISPLACEMENT = 0.024;
const float UV_EDGE_GUARD = 0.055;

void main() {
  vec2 screenUv = gl_FragCoord.xy / uResolution;
  vec4 field = texture2D(uLiquidField, screenUv);
  vec2 direction = field.rg * 2.0 - 1.0;
  float trailStrength = clamp(field.b, 0.0, 1.0);

  float interactionStrength = mix(0.4, 1.0, trailStrength);
  vec2 uvOffset = direction * interactionStrength * uDistortionStrength;
  float offsetLength = length(uvOffset);

  if (offsetLength > MAX_UV_DISPLACEMENT) {
    uvOffset *= MAX_UV_DISPLACEMENT / offsetLength;
  }

  float edgeDistance = min(
    min(vUv.x, 1.0 - vUv.x),
    min(vUv.y, 1.0 - vUv.y)
  );
  float edgeProtection = smoothstep(0.0, UV_EDGE_GUARD, edgeDistance);
  vec2 distortedUv = clamp(
    vUv + uvOffset * edgeProtection,
    vec2(0.001),
    vec2(0.999)
  );

  vec4 originalHorse = texture2D(uHorseTexture, vUv);
  vec4 distortedHorse = texture2D(uHorseTexture, distortedUv);

  gl_FragColor = vec4(distortedHorse.rgb, originalHorse.a);

  #include <colorspace_fragment>
}
