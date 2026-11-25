# Learning the motion

This is a study guide for the Lyra site. Read it next to the files it names. The exercises at the end are meant to be done in this repo, then thrown away or kept.

## Map

| Concern | Where |
| --- | --- |
| Register GSAP once | `src/lib/gsap.ts` |
| Smooth wheel, scroll lock | `src/lib/lenis.ts`, `src/components/SmoothScroll.tsx` |
| Hero type, pins, the scaling plate | `src/pages/Product.tsx` |
| The headphone and its shader | `src/components/hero/Headphone.tsx` |
| The canvas, paused offscreen | `src/components/hero/HeroCanvas.tsx` |
| Route curtain and the View Transitions API | `src/components/Transition.tsx` |
| Gallery hover shader | `src/lib/distort.ts` |
| Reduced motion | `src/hooks/useMediaQuery.ts`, the `html.motion` class in `index.html` |

`html.motion` is set before first paint, only when the visitor has not asked for reduced motion. CSS uses it for overflow-hidden type and for the sticky model. JavaScript uses `useReducedMotion()` and skips timelines entirely.

## 1. A GSAP timeline

A timeline is a sequence of tweens on one clock. In the hero, the clock is time. In the chapters, the clock is scroll.

The hero reveal in `Product.tsx` does two things:

1. `gsap.set` parks each character at `yPercent: 110` before the browser paints.
2. `gsap.to` brings them to `0` with `expo.out` and a small stagger.

`useLayoutEffect` matters. It runs after the DOM update and before paint, so the visitor does not see the type flash into place and then jump away.

Do not also set `transform` on those characters in CSS. When a GSAP tween ends at an identity transform, the stylesheet rule comes back and hides the type again. The clipping (`overflow: hidden` on `.char`) belongs in CSS. The motion belongs in GSAP.

`expo.out` is fast at the start and very slow at the end. That is the right curve for type: the letters arrive, then settle. `power3.out` is enough for a paragraph. Linear is for scrubbed scroll, almost nothing else.

## 2. ScrollTrigger

ScrollTrigger maps scroll position to a timeline.

```js
scrollTrigger: {
  trigger: '.pin',
  start: 'top top',
  end: '+=230%',
  pin: true,
  scrub: 0.65,
}
```

- `start: 'top top'` means “when the top of `.pin` hits the top of the viewport.”
- `end: '+=230%'` means “keep going for 2.3 viewport-heights.” The function form is better when the distance depends on content, as the horizontal materials track does.
- `pin: true` fixes the section in the viewport and inserts a spacer so the page is still as long as the scroll distance.
- `scrub: 0.65` ties the playhead to the scroll, with 0.65 seconds of catch-up so it does not feel mechanical. `scrub: true` is immediate.

The chapter timeline fades the current line out, and only then fades the next line in. If both tweens share a start time, the visitor reads two headlines at once. That was an early bug. The offset is `at + 0.26` in `Product.tsx`.

`anticipatePin: 1` asks ScrollTrigger to start the pin a little early so the section does not jump when it locks.

Lenis animates the native scroll position. ScrollTrigger does not need `scrollerProxy` with current Lenis. It does need to be told that a frame happened:

```js
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

`lagSmoothing(0)` stops GSAP from trying to catch up after a long frame, which otherwise fast-forwards a scrub.

Call `ScrollTrigger.refresh()` after fonts load and after the preloader unlocks the page. Pins measure the document. If they measure while overflow is hidden or before Fraunces has its real size, the pin points are wrong.

## 3. Smooth scroll

Lenis eases wheel input. Touch stays native (`syncTouch: false`) so a phone still feels like a phone.

`holdScroll` / `releaseScroll` in `src/lib/lenis.ts` are a counter. The preloader, the mobile menu, and the route curtain can all want the page still at the same time. Starting Lenis because the menu closed, while the curtain is still up, is the bug the counter prevents. Whoever is last to release is the one who starts it.

`scrollTo(0, { immediate: true, force: true })` runs even while Lenis is stopped. Route changes use it under the curtain so the new page is at the top when the panels lift.

## 4. React Three Fiber, briefly

A canvas is a React tree that reconciles to Three.js objects. `<mesh>` is a `THREE.Mesh`. `<meshPhysicalMaterial>` is a material. JSX props map to object properties.

The headphone is not a downloaded model. `LatheGeometry` spins a 2D profile into a cup. `TubeGeometry` sweeps a circle along a `CatmullRomCurve3` for the band. Two cups, two yokes, a leather pad. Sharing one lathe between both cups is fine if you `dispose={null}` on the meshes and dispose the geometry once yourself. React Three Fiber would otherwise dispose it twice.

`useFrame` is the render loop. It is where the headphone eases toward the pointer and toward `pose.story`, a plain object the scroll timeline writes. Do not put scroll progress in React state. State would re-render the page on every frame.

The driver is a `shaderMaterial`. The vertex shader only passes `uv` through. The fragment shader draws rings from the distance to the center and from `uTime`. `toneMapped={false}` keeps the copper from being crushed by the filmic tone map on the rest of the metal.

Lighting is the difference between a black blob and an object. The scene uses an `Environment` of `Lightformer`s (`frames={1}`, so the map is baked once) plus two spot lights and a directional. Metals need an environment to reflect. Without it, `metalness: 1` looks like flat gray.

The canvas is `React.lazy`. Three.js stays out of the first JavaScript chunk until the product route needs it. `frameloop` is `"demand"` when the visitor asked for reduced motion or the canvas has left the viewport, and `"always"` otherwise. `dpr` is capped at 1.6 on a desktop and 1.15 on a phone.

Drag rotation does not use `OrbitControls`. Those capture the wheel and fight the page. A transparent hit target writes into `src/lib/pointer.ts`, and the render loop reads it.

## 5. The gallery shader

`src/lib/distort.ts` is raw WebGL, not Three.js. One context is created on pointer enter and destroyed shortly after leave, so six plates do not mean six live contexts. The fragment shader pushes UVs away from the pointer and splits the red and blue samples. On a coarse pointer, or with reduced motion, the component renders the image and no canvas.

## 6. Page transitions

`Transition.tsx` plays an ivory curtain of five panels. Under the curtain it calls `document.startViewTransition` when the browser has it, then navigates with `flushSync` so React commits before the curtain lifts.

The default view-transition crossfade is turned off while `html.vt-running` is set. The curtain is the designed transition. The API is still doing the job it is for: the browser treats the DOM swap as one transition, and the fallback path (no API) is the same curtain with a direct `navigate`. Modified clicks are not intercepted, so command-click still opens a real URL.

Do not run Lenis during the curtain. The hold counter covers it.

## 7. Performance

Things that actually cost frames on this site:

- A full-viewport WebGL canvas that never pauses. The intersection observer exists so the product route does not burn frames after the model has scrolled away.
- `Environment` updating every frame. `frames={1}` bakes it.
- Animating `width` and `height` on scroll. The emerge sequence animates `scale` and `border-radius` instead.
- `will-change` left on forever. It is not used. GSAP promotes what it is animating.
- Six WebGL contexts. The gallery makes one, and only while a pointer is on a plate.
- Lenis on touch. It is off, on purpose.
- Layout reads inside a scroll handler that also writes layout. The scroll handlers in the nav only set a boolean.

Measure before adding. In Chrome, a Performance recording of the pinned chapter should stay near 16ms a frame on a recent laptop. If a frame is long, look at the canvas first, then at anything animating layout (`top`, `height`, `margin`) rather than `transform` and `opacity`.

## Exercises

Do these on a branch. The point is the diff, not a new feature in production.

### 1. A fourth chapter

In `src/pages/Product.tsx`, add a beat to `BEATS`. Reload and scroll the pin.

- Where does the new line appear in the timeline, and why does the formula `0.28 + (index - 1) * 0.95` place it?
- What happens to the copper hairline if you do not lengthen its tween?
- Make the new line’s entrance 0.1 seconds later than the previous line’s exit. Scroll slowly and confirm you never read two headlines at once.

### 2. Change the feel of the wheel

In `SmoothScroll.tsx`, set Lenis `duration` to `0.4`, then to `2.2`. Scroll the pinned chapter.

- Which value makes the scrub feel connected to your hand, and which makes it feel late?
- Why does `scrub: 0.65` on the timeline stack with Lenis duration instead of replacing it?

Put the duration back when you are done.

### 3. Retune the driver

In the fragment shader in `Headphone.tsx`, change `r * 86.0` to `r * 28.0`, then to `r * 180.0`.

- What did the frequency do to the drawing?
- Set `uTime`’s multiplier to `0` and describe what you lost. That is the difference between a texture and a material that feels alive.

### 4. A seventh plate

Add an entry to `STUDIES` in `Gallery.tsx` and a new SVG from `scripts/build-assets.mjs` (run `npm run assets`). Confirm the hover shader works on it and that a phone does not create a WebGL context. The check is in `DistortMedia.tsx`: `interactive` is false without a fine pointer.

### 5. A transition you can see fail

Temporarily remove `holdScroll()` from `go()` in `Transition.tsx` and scroll hard while a route change is covering the screen.

- What moved that should have stayed still?
- Put the hold back. Then explain, in a sentence, why a boolean is the wrong tool and a counter is the right one.

### 6. Find a long frame

Record a Performance trace while scrolling from the hero through the emerge plate.

- Find the longest frame. Is it the canvas, a layout read, or the image scaling?
- `scale` on the plate is a transform. If you change that tween to animate `width` and `height` instead, record again. What changed, and was it worth the control you gained over layout?

## Reduced motion is part of the design

Turn it on in the operating system, or in Chrome’s Rendering panel, and reload.

You should get the words immediately, no curtain, no pinned hijack, no spinning model. The same sentences have to work without the choreography. If a section only makes sense while it is pinned, the writing is hiding behind the animation.
