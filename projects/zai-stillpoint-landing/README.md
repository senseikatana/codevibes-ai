"Design a boutique yoga studio landing page that feels calm, intentional, and grounded — the antidote to high-intensity gym culture.

Visual Strategy:
Imagery: soft morning light through large windows, students in postures, plants, mat textures.
Photography: warm natural light, shallow depth of field.
Composition: open negative space, diagonal sunbeams.

Color Palette:
Primary Colors: warm sand, sage green, off-white.
Accent Colors: terracotta, dusk pink.
Background: subtle paper or linen texture.

Typography:
Headings: humanist serif, comfortable weight.
Body Text: airy line-height.
Layout: generous margins; one idea per scroll viewport.

Page Structure:
Hero Section: a slow-breathing visual + studio name + booking CTA.
Practices: vinyasa / yin / restorative / breathwork.
Teacher Bios: photo + personal ""why I teach"" quote.
Class Schedule: calendar view with seat availability.
First Class Free: prominent capture form.

Interaction Details:
- Hero visual subtly expands and contracts on a 4-second breath cycle.
- Headlines fade up with a soft 600ms ease as they enter view.
- Teacher quotes type out character-by-character on hover.
- Schedule rows expand to reveal the studio room and prerequisites.
- A tiny chime plays once on first scroll (opt-in).
- Hover on any image triggers a slow Ken Burns zoom.

Overall Vibe: calm, welcoming, intentional, restorative."

Here's my take on this brief — I leaned into a warm "morning-studio" system: a breathing arched window as the hero's signature moment, toned (duotone) photography so every image sits inside the sand/sage/terracotta palette, Fraunces + Karla for the humanist serif/airy body pairing, and a full schedule with real seat logic. Everything runs in one file.

How it's built, briefly:

The signature moment — the hero is an authored arched "window": a breathing light halo, an orbiting-dot ring, diagonal sunbeams, drifting dust motes, a leaf shadow, and a hand-drawn seated figure. One requestAnimationFrame loop drives everything on a strict 4-second cycle (ease-in-out scale on the arch, counter-scaling ring, subtle chest rise on the figure, pulsing beams, and the synced inhale / exhale word), so breath, light, and copy never drift apart.
Color & texture — warm sand/sage/terracotta/dusk-pink tokens on a linen weave plus an SVG-noise paper grain. All photography runs through a mix-blend-mode: luminosity treatment over warm bases, so any image instantly reads as toned, palette-cohesive photography.
Every requested interaction is live — 600ms blur-to-focus headline reveals via IntersectionObserver; teacher "why I teach" quotes that type out character-by-character on hover/focus/tap; schedule rows that expand (CSS grid-template-rows: 0fr → 1fr) to reveal room, prerequisites, and props; a slow Ken Burns zoom on every image; and an opt-in chime synthesized with the Web Audio API (detuned sine partials emulating a singing bowl) that sounds once on first scroll after you arm it.
The schedule is real software — a live week strip built from today's date, deterministic seat scatter (dots = mats), actual reservation logic that fills a mat, updates availability, and hands full classes a waitlist. The "first class free" form validates inline and swaps to a personalized confirmation — no browser dialogs anywhere.
Practices get an editorial treatment: large typographic rows with tiny hand-drawn glyphs and an image that drifts after your cursor (desktop only), rather than a card grid.
It also respects prefers-reduced-motion throughout and adapts down to mobile.
