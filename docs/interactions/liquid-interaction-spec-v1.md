# My Career Is Mine.
## Liquid Interaction Specification V1

The hero interaction must feel physical, elegant and organic.

The horse should not behave like a rubber image or a generic distortion filter.

The intended sensation is that the horse exists beneath or inside a dark liquid surface that reacts naturally to the user's pointer.

---

# 01 — Core Interaction

The interaction follows this sequence:

MOVE  
→ DISTORT  
→ REVEAL  
→ TRAIL  
→ RECOVER

The effect is primarily controlled by:

- pointer position
- pointer velocity
- pointer direction
- movement intensity
- elapsed time since the last movement

The horse is the main interactive surface.

Typography and interface elements must remain sharp and stable.

---

# 02 — Initial State

When the page loads:

- The horse dominates the right side of the hero.
- "MY CAREER IS MINE." remains completely sharp.
- The horse surface is calm.
- Ambient grain is visible.
- Very subtle particle movement may exist.
- The horse may have minimal environmental motion.
- No strong distortion occurs without user input.

The experience should invite exploration without explicitly explaining the interaction.

---

# 03 — Pointer Proximity

When the pointer approaches the horse:

- The surface may begin reacting slightly before direct contact.
- Distortion intensity remains very low.
- No visible circular mask should appear.
- The interaction radius must feel soft and organic.

The user should feel that the horse reacts to their presence.

---

# 04 — Pointer Movement

When the pointer moves across the horse, the image is displaced.

Slow movement:

- subtle distortion
- small displacement
- minimal trail
- calm liquid behavior

Normal movement:

- clearly visible displacement
- organic surface movement
- short trail
- subtle reveal of the secondary layer

Fast movement:

- stronger displacement
- elongated distortion in movement direction
- longer liquid trail
- stronger reveal
- slightly increased energy response

Pointer velocity directly controls interaction intensity.

---

# 05 — Velocity System

Interaction intensity should be calculated from pointer speed.

Conceptually:

slow movement  
→ low displacement

medium movement  
→ medium displacement

fast movement  
→ strong displacement

The effect must be clamped to avoid excessive deformation.

Extremely fast pointer movement must not destroy the composition.

---

# 06 — Direction

Distortion must react to movement direction.

Horizontal movement should stretch the displacement horizontally.

Vertical movement should influence the surface vertically.

Diagonal movement should naturally combine both axes.

The effect must feel like the pointer is physically dragging the liquid surface.

---

# 07 — Liquid Trail

Pointer movement leaves a temporary displacement trail.

The trail should:

- follow pointer movement
- fade gradually
- remain visible approximately 0.4 to 0.8 seconds
- never look like smoke
- never look like a painted brush stroke
- blend naturally into the horse surface

The trail represents temporary memory in the liquid surface.

---

# 08 — Recovery

When the pointer stops moving:

- distortion gradually decreases
- trail fades
- horse surface slowly returns to its original state

Recovery must never be instantaneous.

Approximate behavior:

0.0s  
Strong distortion

0.2s  
Distortion begins relaxing

0.4s  
Trail becomes subtle

0.6s–1.0s  
Surface returns to resting state

The exact timing may change after visual testing.

---

# 09 — Secondary Reveal Layer

The interaction should reveal a second representation of the horse beneath the main photographic layer.

Working concept:

HORSE PHOTOGRAPHY  
↓  
LIQUID DISTORTION  
↓  
ENERGY STRUCTURE

The secondary layer may use:

- metallic lines
- directional fibers
- abstract muscle paths
- motion vectors
- subtle luminous structures

The reveal should not look like a completely different image.

It should feel like the internal energy or structure of the same horse.

This visual language will later connect with the FORCE section.

---

# 10 — Pointer Cursor

Inside the hero, the default operating system cursor may be replaced by a custom cursor.

Base appearance:

- thin ivory circle
- approximately 34–40 px
- small central point
- minimal visual weight

Possible states:

REST  
Circle remains stable.

HORSE HOVER  
Circle contracts slightly.

FAST MOVEMENT  
Cursor stretches subtly in movement direction.

POINTER DOWN  
Cursor compresses slightly.

The cursor must never distract from the horse.

---

# 11 — Pointer Down Interaction

Clicking does not navigate anywhere.

Holding the pointer down may increase virtual pressure on the surface.

Pointer down:

- slightly stronger displacement
- interaction radius expands subtly
- energy reveal becomes slightly stronger

Pointer release:

- small ripple response
- surface gradually recovers

This should remain a secondary interaction.

It must not feel like a button.

---

# 12 — Interaction Area

The entire page should not behave like liquid.

Primary interaction area:

- horse body
- horse head
- mane
- surrounding immediate visual area

The mane may extend the interaction slightly beyond the horse silhouette.

Typography remains unaffected.

Interface remains unaffected.

This creates contrast between:

TYPOGRAPHY  
precise / rigid / controlled

HORSE  
organic / fluid / reactive

---

# 13 — Scroll Takeover

The liquid interaction is strongest at the beginning of the experience.

Approximate behavior:

0% → 4% scroll  
Full pointer interaction.

4% → 8% scroll  
Pointer interaction remains active but begins reducing.

8% → 12% scroll  
Scroll animation takes control.

After approximately 12%:

- liquid interaction is mostly disabled
- BREAK AWAY choreography becomes dominant
- pointer effects must not fight scroll animation

The transition between pointer control and scroll control must feel seamless.

---

# 14 — Visual Restrictions

Avoid:

- obvious circular distortion masks
- excessive chromatic aberration
- cartoon water ripples
- rubber-like stretching
- large waves covering the entire page
- overpowered particle effects
- random glitch effects
- excessive blur

The interaction must remain premium and cinematic.

---

# 15 — Mobile Interaction

Desktop interaction uses mouse or trackpad pointer movement.

Mobile behavior uses touch drag.

Touch behavior:

- finger position controls displacement
- intensity is reduced
- trail remains shorter
- pressure interaction is optional
- effects are simplified when necessary

Mobile must preserve the idea without reproducing every desktop effect.

---

# 16 — Reduced Motion

If:

prefers-reduced-motion: reduce

is enabled:

- disable strong displacement
- disable long trails
- disable unnecessary particles
- preserve horse imagery
- preserve complete content
- preserve navigation

The experience must remain visually coherent without animation.

---

# 17 — Performance Targets

Desktop target:

60 FPS whenever reasonably possible.

Recommended renderer pixel ratio:

min(devicePixelRatio, 1.5)

Possible optimizations:

- reduce render target resolution
- stop unnecessary updates when idle
- clamp pointer velocity
- reduce particle count
- use compressed textures
- simplify mobile shader
- pause rendering when page is hidden

The visual result should appear expensive.

The GPU cost should not be expensive.

---

# 18 — Technical Direction

Expected architecture:

Pointer Events
↓
Pointer Tracker
↓
Position
Velocity
Direction
Pressure
↓
Displacement Render Target
↓
GLSL Displacement Shader
↓
Horse Main Texture
+
Horse Energy Texture
↓
Final WebGL Composition

Three.js will manage WebGL rendering.

GLSL will control visual displacement.

GSAP will primarily control scroll transitions and scene choreography.

The pointer shader should not depend on GSAP for every frame.

---

# 19 — Shader Inputs

Possible shader uniforms:

- uTime
- uResolution
- uMouse
- uMouseVelocity
- uMouseDirection
- uPressure
- uDistortionStrength
- uTrailStrength
- uRevealStrength
- uProgress

These names are provisional and may change during implementation.

---

# 20 — Interaction Philosophy

The user should not immediately think:

"This is a shader."

The intended reaction is:

"The horse feels alive."

The effect exists to reinforce:

- instinct
- energy
- control
- movement
- freedom

Technology must remain invisible behind the experience.

---

# Final Rule

The hero must remain visually powerful even when the user does nothing.

Interaction enhances the experience.

Interaction must never be required to understand the composition.

The horse is the protagonist.

The liquid effect supports the horse.

It does not replace it.