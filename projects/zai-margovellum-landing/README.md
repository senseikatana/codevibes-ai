"Design a brand and graphic designer's portfolio that feels like a print monograph.

Logo systems, packaging, posters, type design. Each project gets a ""spread"" with editorial copy.

Visual: high-contrast, type-led, oversized headlines.

Page Structure:
Hero Section: oversized typographic name treatment.
Projects: each project is a vertically scrollable ""spread.""
Type Specimens: download specimen PDFs.
Lectures & Talks: with embedded video.
Contact.

Interaction Details:
- Hero name treatment animates with kinetic typography on load.
- Each project spread cross-fades into the next with a slight horizontal slide.
- Logos animate (build / rotate / construct) when scrolled into view.
- Type specimens are draggable; you can resize them by pinching.
- Color palette swatches scrub like film strips.
- Cursor leaves a faint risograph dot trail.

Overall Vibe: editorial, type-heavy, opinionated, art-directed."

Here's my take: a monograph that behaves like a printed object — warm uncoated stock, hairline rules, crop marks, real riso ink colors, and type doing all the heavy lifting. Everything visual is drawn in code (no stock photos), the "video" lectures are a live generative kinetic-type player, and the specimen PDFs are cut on demand from a hand-built PDF writer.

A few notes on how I approached it:

Print-monograph conceit, taken seriously. Fixed top bar and bottom folio (a live page indicator — "P.04 — FERMENT" updates as you scroll), crop marks in the hero, a slowly rotating registration mark, paper-grain background, and a colophon. Each project runs on a real riso spot ink (Kilter = Blue 072, Ferment = Green, etc.).
Kinetic hero. The name animates in on load, then the letters live on a variable-font axis: they swell in weight/width near your cursor and breathe with an idle wave — the M in VELLUM carries a deliberate misregistration ghost.
Spreads. Selected Work is a pinned stage; scrolling cross-fades each spread into the next with a horizontal slide, and each artifact builds when activated — the Kilter mark constructs from guides and strokes (its lower arm keeps wobbling, on brand), jars rise, posters fan out, and a book page turns.
Specimens. Cards drag anywhere on the drafting grid, resize by touch pinch, trackpad pinch (ctrl+wheel) or corner grip, and the PDF button renders a real A4 specimen sheet to canvas and writes an actual PDF byte-by-byte in the browser — no services.
Talks. The "footage" is a pure function of time drawn on canvas: kinetic-type title cards, marquee quotes, timecode burn-in and grain, with working play/pause and a scrubbable timeline.
Ink library. The palette scrubs like 35 mm film — sprocket holes, inertia, snap-to-frame — driving the big readout.
Plus the faint riso dot trail (overprinted two-color dots via multiply blend), toasts instead of alerts, and reduced-motion fallbacks throughout.


