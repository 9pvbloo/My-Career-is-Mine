# My Career Is Mine.

## Technical Architecture V1

This document defines the initial technical architecture for the experience.

The goal is to build a cinematic, interactive and high-performance website where motion, WebGL and scroll storytelling work as one continuous system.

---

# 01 — Core Stack

## Runtime

- Vite
- TypeScript

## WebGL

- Three.js
- GLSL shaders

## Motion

- GSAP
- ScrollTrigger

## Smooth Scroll

- Lenis

## Styling

- CSS
- CSS Custom Properties
- Responsive layout with modern CSS

The project will not depend on a large UI framework.

The experience requires precise control over layout, rendering and animation.

---

# 02 — Rendering Strategy

The project will use two rendering layers.

## DOM Layer

Responsible for:

- typography
- navigation
- labels
- buttons
- section copy
- contact content
- accessibility
- semantic structure

## WebGL Layer

Responsible for:

- horse imagery
- liquid distortion
- energy reveal
- particle effects
- visual transitions
- cinematic compositing

Conceptually:

DOM +
WEBGL
↓
FINAL EXPERIENCE

The DOM must remain readable and accessible independently from WebGL.

---

# 03 — Global Architecture

Initial architecture:

src/
├── main.ts
├── style.css
│
├── app/
│ ├── App.ts
│ ├── Runtime.ts
│ └── Experience.ts
│
├── core/
│ ├── Renderer.ts
│ ├── Sizes.ts
│ ├── Time.ts
│ ├── Pointer.ts
│ ├── ScrollDirector.ts
│ └── AssetLoader.ts
│
├── scenes/
│ ├── HeroScene.ts
│ ├── BreakAwayScene.ts
│ ├── MomentumScene.ts
│ ├── ForceScene.ts
│ ├── UnboundScene.ts
│ ├── FreedomScene.ts
│ └── FinalScene.ts
│
├── shaders/
│ ├── liquid/
│ │ ├── liquid.vert.glsl
│ │ └── liquid.frag.glsl
│ │
│ ├── particles/
│ │ ├── particles.vert.glsl
│ │ └── particles.frag.glsl
│ │
│ └── transition/
│ ├── transition.vert.glsl
│ └── transition.frag.glsl
│
├── effects/
│ ├── LiquidInteraction.ts
│ ├── EnergyReveal.ts
│ ├── ParticleSystem.ts
│ └── TransitionSystem.ts
│
├── animation/
│ ├── MotionController.ts
│ ├── HeroTimeline.ts
│ ├── BreakAwayTimeline.ts
│ ├── MomentumTimeline.ts
│ └── FinalTimeline.ts
│
├── ui/
│ ├── Cursor.ts
│ ├── Navigation.ts
│ ├── Loader.ts
│ └── ScrollIndicator.ts
│
├── utils/
│ ├── math.ts
│ ├── lerp.ts
│ ├── clamp.ts
│ └── device.ts
│
└── types/
└── global.ts

---

# 04 — Runtime

Runtime.ts will coordinate the application lifecycle.

Responsibilities:

- initialize renderer
- initialize sizes
- initialize pointer
- initialize scroll
- initialize asset loader
- create scenes
- update animation loop
- pause when tab is hidden
- dispose resources when necessary

Runtime must not contain scene-specific visual logic.

---

# 05 — Renderer

Renderer.ts will manage Three.js WebGLRenderer.

Responsibilities:

- renderer creation
- pixel ratio
- canvas sizing
- rendering
- tone mapping if required
- WebGL capability detection
- performance configuration

Initial pixel ratio rule:

min(devicePixelRatio, 1.5)

Mobile may use a lower value if necessary.

---

# 06 — Sizes

Sizes.ts manages:

- viewport width
- viewport height
- device pixel ratio
- resize events
- breakpoint information

Scenes subscribe to size changes instead of creating their own resize listeners.

---

# 07 — Time

Time.ts manages the animation clock.

Provides:

- elapsed time
- delta time
- update event

This prevents separate requestAnimationFrame loops throughout the project.

There must be one primary rendering loop.

---

# 08 — Pointer

Pointer.ts manages:

- normalized X position
- normalized Y position
- previous position
- velocity
- direction
- pointer down state
- touch position

Pointer information will be reused by:

- liquid shader
- custom cursor
- parallax
- possible particle interaction

Pointer calculations must remain independent from visual effects.

---

# 09 — ScrollDirector

ScrollDirector.ts will be one of the most important systems.

It converts document scroll into normalized experience progress.

Example:

0.00 → Hero
0.12 → Break Away
0.25 → Momentum
0.42 → Force
0.56 → Unbound
0.69 → Freedom
0.82 → Final Statement
0.92 → Contact
1.00 → End

ScrollDirector provides:

- raw scroll progress
- smoothed progress
- scene progress
- direction
- velocity

Scene-specific animations should consume these values.

The global scroll logic should not be duplicated inside individual scenes.

---

# 10 — Lenis

Lenis will provide smooth scrolling.

Requirements:

- integrated with GSAP ticker
- ScrollTrigger synchronized
- disabled or simplified when necessary
- respect reduced motion
- avoid artificial excessive smoothing

Scrolling should remain responsive.

The experience must never feel disconnected from user input.

---

# 11 — GSAP

GSAP will control:

- DOM typography
- section transitions
- camera values
- scene choreography
- opacity
- scale
- transforms
- transition timing

GSAP will NOT control every frame of the liquid pointer shader.

Pointer interaction remains inside the runtime and shader system.

---

# 12 — ScrollTrigger

ScrollTrigger will control:

- pinned sequences when required
- timeline synchronization
- scene activation
- section boundaries
- DOM animation progress

Avoid excessive ScrollTrigger instances.

Prefer larger coordinated timelines.

---

# 13 — Hero Scene

HeroScene.ts will manage:

- hero horse plane
- main horse texture
- energy layer
- liquid shader
- initial camera composition
- interaction activation
- interaction fade during scroll

Hero must work even before other scenes are implemented.

This scene will be developed first.

---

# 14 — Liquid Interaction

LiquidInteraction.ts will manage:

- pointer render target
- displacement texture
- pointer trail
- decay
- pressure
- velocity influence

Input:

Pointer data

Output:

Displacement texture

The final hero shader consumes this displacement texture.

This separation allows the displacement system to be tested independently.

---

# 15 — Horse Assets

Initial strategy:

Use high-quality 2D imagery or rendered sequences instead of forcing a fully real-time 3D horse.

Possible assets:

- hero horse image
- alternate horse energy image
- running sequence
- close-up textures
- masks
- displacement maps
- particle source maps

A mediocre real-time horse model should never be chosen only because it is 3D.

Visual quality takes priority.

---

# 16 — MOMENTUM Strategy

The running horse may use:

Option A:
Image sequence

Option B:
Video texture

Option C:
3D animated horse

Option D:
Hybrid approach

Initial preference:

Image sequence or high-quality video combined with WebGL.

Reason:

- high visual fidelity
- predictable motion
- easier cinematic direction
- lower production complexity than realistic horse rigging

The final decision will be made after asset tests.

---

# 17 — FORCE Strategy

Force will use an abstract representation of movement.

Possible techniques:

- shader-generated lines
- particle paths
- image-based energy maps
- animated masks
- motion vectors

The goal is not realistic anatomy.

The goal is visualizing force and movement.

---

# 18 — Particle System

ParticleSystem.ts may be used during:

- Force
- Unbound
- transitions

Particles should support:

- position
- velocity
- life
- opacity
- size
- transition progress

Particles must never become decorative noise.

Their primary role is transformation.

---

# 19 — Scene Lifecycle

Each scene should support a common lifecycle.

Example:

init()
enter()
update()
resize()
exit()
dispose()

Not every method must be required initially.

The goal is to prevent scene logic from becoming coupled to the entire application.

---

# 20 — Assets

Proposed folder structure:

public/
└── assets/
├── horse/
│ ├── hero/
│ ├── energy/
│ ├── momentum/
│ └── details/
│
├── textures/
│ ├── noise/
│ ├── masks/
│ └── displacement/
│
└── fonts/

Large assets should be compressed before production.

Preferred image formats:

- WebP
- AVIF when appropriate

PNG only when transparency or precision requires it.

---

# 21 — Asset Loader

AssetLoader.ts will:

- preload critical hero assets
- expose progress
- lazy-load later scene assets
- handle loading failures

The full experience should not block because every asset is loading immediately.

Priority:

1. fonts
2. hero image
3. hero energy layer
4. hero shader resources
5. first transition assets
6. remaining experience

---

# 22 — Loader

The loader must remain minimal.

Possible structure:

MY CAREER IS MINE.

00
↓
100

No unnecessary animation.

Loader should disappear as soon as the hero is ready.

Later scenes can continue loading progressively.

---

# 23 — Custom Cursor

Cursor.ts will manage:

- DOM cursor visual
- pointer states
- interpolation
- velocity stretch
- hover modes
- pointer-down mode

The cursor uses the same pointer source as WebGL.

There must not be two independent pointer tracking implementations.

---

# 24 — CSS Architecture

Use:

:root
for global design tokens.

Example:

--color-obsidian
--color-ivory
--color-gunmetal
--color-burgundy

--font-display
--font-body
--font-mono

--space-xs
--space-sm
--space-md
--space-lg
--space-xl

Avoid random hard-coded values when the value belongs to the design system.

---

# 25 — Responsive Strategy

Desktop is the primary art-directed experience.

Responsive design must not simply shrink desktop.

Tablet and mobile may:

- reposition typography
- crop horse differently
- reduce particle count
- simplify shader effects
- reduce motion complexity
- disable custom cursor
- use shorter image sequences

Narrative order remains unchanged.

---

# 26 — Accessibility

Required:

- semantic HTML
- correct headings
- accessible links
- visible focus states
- keyboard navigation
- sufficient contrast
- reduced motion support
- non-WebGL fallback when possible

Interactive visual effects must not block content access.

---

# 27 — Reduced Motion

When:

prefers-reduced-motion: reduce

The site should:

- disable smooth scroll
- reduce parallax
- simplify WebGL displacement
- reduce particles
- remove unnecessary camera movement
- preserve all text
- preserve narrative order

---

# 28 — Performance

Targets:

- smooth desktop rendering
- stable mobile experience
- fast hero load
- minimal layout shifts

Techniques:

- cap DPR
- use compressed textures
- lazy-load scenes
- reduce render targets
- pause when document is hidden
- avoid excessive DOM updates
- avoid multiple animation loops
- reduce GPU work while idle

---

# 29 — Visibility Handling

When document.visibilityState becomes hidden:

- pause expensive updates
- pause unnecessary animation
- preserve current state

When visible:

- resume safely
- avoid large delta-time jumps

---

# 30 — Error Handling

If WebGL is unavailable:

- display static hero image
- preserve typography
- preserve navigation
- preserve contact
- maintain readable experience

The website must not become blank.

---

# 31 — Development Order

The experience will be built in phases.

## Phase 0

Runtime Foundation

- Vite
- TypeScript
- project structure
- renderer
- time
- sizes
- pointer
- scroll
- GSAP
- Lenis
- basic DOM

## Phase 1

Hero Static Composition

## Phase 2

Liquid Interaction

## Phase 3

Break Away

## Phase 4

Momentum

## Phase 5

Force

## Phase 6

Unbound

## Phase 7

Freedom

## Phase 8

Final Statement

## Phase 9

Contact

## Phase 10

Responsive

## Phase 11

Performance

## Phase 12

Accessibility

## Phase 13

Final Polish

---

# 32 — Git Strategy

Main branch:

main

Feature branches:

feature/<name>

Examples:

feature/runtime-foundation
feature/hero-layout
feature/liquid-pointer
feature/momentum-sequence

Fix branches:

fix/<name>

Examples:

fix/mobile-viewport
fix/shader-edge-artifacts

Documentation:

docs/<name>

Examples:

docs/storyboard
docs/technical-architecture

---

# 33 — Commit Convention

Use Conventional Commits.

Examples:

feat(hero): create initial WebGL composition

feat(pointer): add velocity tracking

feat(shader): implement liquid displacement

fix(shader): prevent uv edge stretching

perf(renderer): cap device pixel ratio

refactor(scroll): extract ScrollDirector

docs: add technical architecture

style(hero): refine title composition

chore: configure project dependencies

---

# 34 — Pull Request Strategy

Major features should use pull requests.

Workflow:

Issue
↓
Branch
↓
Implementation
↓
Commits
↓
Pull Request
↓
Review
↓
Merge

Avoid working directly on main for major features.

---

# 35 — Core Principle

Technology exists to support the experience.

Do not add:

- Three.js features without visual purpose
- particles without narrative purpose
- shaders only to demonstrate shaders
- complex architecture before it is needed

The website must feel sophisticated.

The codebase must remain understandable.

---

# Final Architecture Rule

The project should be possible to understand at three levels:

VISUAL
What does the user experience?

MOTION
How does the experience transform?

TECHNICAL
Which system is responsible for each transformation?

If those three layers remain separated and coordinated, the project can grow without becoming chaotic.
