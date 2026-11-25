# Lyra design system

Lyra is a fictional closed-back planar headphone. Kinetic is the site that launches it. This file is the system: the decisions that keep the pages looking like one object.

## Brand

- **Name.** Lyra. A lyre, and a constellation. The wordmark is Fraunces italic, never all-caps, never outlined except for the giant footer.
- **Mark.** Two circles. The outer is the cup, the inner is the driver. Stroke, not fill.
- **Product.** One ring, milled aluminum, a leather seal, no lamp, no app.
- **Place.** Milled in Osaka, tuned in Kyoto. Use those cities. Do not invent a third.
- **Fiction.** The object is not for sale. The reserve dialog says so. Do not add a checkout, a price, or a fake email field.

## Principles

1. **One chromatic color.** Copper is the only hue. Everything else is warm black or ivory.
2. **Type does the decorating.** No icons, no illustration set, no card grids of features.
3. **The object stays in the room.** The 3D model occupies the hero and the pinned chapter, then leaves. Later sections are type, plates, and numbers.
4. **Motion is a sentence.** A tween should reveal one idea. If it does not change the meaning of the scroll, remove it.
5. **Say less.** Short sentences. Concrete nouns. No exclamation marks. No “discover”, “seamless”, “elevate”, or “experience” used as a verb.

## Color

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#0e0d0c` | Page. Not pure black; the grain needs a little warmth. |
| `--bg-2` | `#171512` | Dialogs, title cards |
| `--ivory` | `#f3ecdf` | Text, buttons, the page-transition panels |
| `--ivory-dim` | `#c9c1b3` | Body copy on black |
| `--muted` | `#8f887c` | Captions, specification labels |
| `--copper` | `#c47a4a` | Indexes, focus, the driver ring, rules that mean “you are here” |
| `--copper-2` | `#e0a078` | Button hover, links on hover |
| `--line` | `rgba(243, 236, 223, 0.16)` | Hairline rules |
| `--line-strong` | `rgba(243, 236, 223, 0.34)` | Controls, dialog border |

Selection is copper with near-black text. Focus is a 1px copper outline, 4px offset. Do not introduce blue, purple, or a second accent.

## Type

| Role | Family | Weight | Notes |
| --- | --- | --- | --- |
| Display | Fraunces | 500 | Headlines. Italic only for the second hero line, the marquee, the footer wordmark, and pull quotes. |
| Body | Outfit | 300–400 | Interface and paragraphs. 300 for long copy on black. |
| Meta | IBM Plex Mono | 400 | Kickers, spec labels, captions. Uppercase, tracking `0.14em`–`0.18em`. |

The scale lives in `src/styles/tokens.css` as `--step--1` through `--step-5`. Headlines use `clamp` so they stay one composition from a phone to a desktop. Do not set a headline in `px`.

Line length for prose is `--measure` (40rem). Display lines can be shorter on purpose (`max-width: 10ch` to `14ch`) so they break like a title, not a paragraph.

## Space and layout

- **Gutter.** `--gutter: clamp(18px, 3.6vw, 72px)`.
- **Nav height.** `--nav-h: 76px`. The first screen of every route clears it.
- **Desktop.** `min-width: 900px`. Below that, pinned horizontal scroll becomes a native snap scroll, the custom cursor goes away, and the model sits in its own band above the headline.
- **Sections.** Full-bleed. Do not wrap the page in a centered `max-width` container. Constrain the text, not the ground.

## Motion

| Token | Value | Use |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrances, hovers |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.18, 1)` | The preloader exit, the menu, the curtain |

Durations:

- Hover and magnetic settle: 0.35–0.45s
- Type reveal: about 1.15s, `expo.out`, stagger near 0.014s per character
- Preloader exit: 0.95s
- Route curtain: 0.65s cover, then 0.76s reveal
- Lenis wheel duration: 1.15s
- Marquee: 46s linear, and only a loop

Scroll timelines are scrubbed. They do not play on their own. A scrubbed crossfade must finish the outgoing line before the incoming line is readable. Overlapping two headlines is a bug.

`prefers-reduced-motion: reduce` removes the preloader, Lenis, pins, the custom cursor, shader hover, and the curtain. Content stays in document order. The model renders once and does not spin.

## Components

- **Kicker.** Mono, copper, uppercase. Pattern: `01 — The instrument`.
- **Button.** Ivory pill, black type, uppercase tracked. Hover turns copper-2. There is one button label on this site: “Request a pair”.
- **Nav.** Wordmark left, four routes centered, button right. The current route has a copper underline. Under 900px the routes move into a full-screen menu and the button becomes a close control.
- **Pin chapter.** One statement at a time, a copper progress hairline, the model held on the right.
- **Emerge.** A plate scales from a window to the viewport. The sentence appears only after the image has become the room.
- **Spec row.** Mono label, serif value, hairline above.
- **Gallery plate.** Generated study, mono caption, distortion shader on a fine pointer.
- **Dialog.** The only modal. It tells the truth about the fiction.

## Voice

Write the way the object is made: few parts, each one doing a job.

- “Eighteen hours, and no lamp to announce it.”
- Not “Experience 18 hours of seamless battery life.”

Numbers are specific. Adjectives are rare. The reader should be able to repeat a sentence out loud without feeling sold to.

## Accessibility

- One `h1` per route. Its accessible name is the full sentence, including when characters are split for animation.
- Split text is `aria-hidden`. The parent heading carries `aria-label`.
- The model is decorative. A visually hidden sentence describes it.
- Focus states are visible. The custom cursor is removed for `prefers-reduced-motion` and for coarse pointers, and it never replaces the cursor inside a modal.
- The preloader is a `progressbar` with a name. It does not trap the page once it has left.
- Routes are real links. Modified clicks (command, ctrl, middle) are not intercepted.
