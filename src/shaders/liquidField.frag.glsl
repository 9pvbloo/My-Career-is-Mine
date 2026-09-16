precision highp float;

uniform sampler2D uPreviousField;
uniform vec2 uPointerUv;
uniform vec2 uPointerVelocity;
uniform vec2 uPointerDirection;
uniform float uPointerIntensity;
uniform float uDelta;
uniform float uAspect;
uniform float uReset;

varying vec2 vUv;

void main() {
  if (uReset > 0.5) {
    gl_FragColor = vec4(0.5, 0.5, 0.0, 1.0);
    return;
  }

  vec4 previous = texture2D(uPreviousField, vUv);
  vec2 displacement = previous.rg * 2.0 - 1.0;
  float trail = previous.b;

  float decay = exp(-2.4 * uDelta);
  displacement *= decay;
  trail *= decay;

  float velocityStrength = clamp(length(uPointerVelocity), 0.0, 1.0);
  float inputStrength = uPointerIntensity * (0.2 + 0.8 * velocityStrength);

  if (inputStrength > 0.0) {
    vec2 offset = vUv - uPointerUv;
    offset.x *= uAspect;

    vec2 direction = normalize(
      vec2(uPointerDirection.x * uAspect, uPointerDirection.y) + 0.00001
    );
    vec2 tangent = vec2(-direction.y, direction.x);

    float radius = mix(0.035, 0.075, inputStrength);
    float elongation = mix(1.25, 2.3, velocityStrength);
    vec2 localOffset = vec2(dot(offset, direction), dot(offset, tangent));
    float ellipticalDistance = dot(
      localOffset / vec2(radius * elongation, radius),
      localOffset / vec2(radius * elongation, radius)
    );
    float influence = exp(-ellipticalDistance * 3.5);

    vec2 encodedDirection = normalize(uPointerDirection + 0.00001);
    displacement += encodedDirection * influence * inputStrength * 0.22;
    trail = max(trail, influence * inputStrength);
  }

  displacement = clamp(displacement, vec2(-0.5), vec2(0.5));

  gl_FragColor = vec4(displacement * 0.5 + 0.5, clamp(trail, 0.0, 1.0), 1.0);
}
