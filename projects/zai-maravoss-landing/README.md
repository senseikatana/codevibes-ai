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


This brief is basically asking for a book that happens to be a website — so I built it that way: a single-file "monograph" with running heads, live folio numbers, registration marks, a paste-up board, and a colophon. Ink black + warm paper + two riso spot colors (red/blue, with multiply overprint), Archivo variable (animated on its weight/width axes) for display, Fraunces for editorial serif, Space Mono for captions. Here's the completed monograph — every section is now fully populated and wired: five scroll-driven spreads with editorial copy, duotone photo plates (placeholder images, art-directed in two-color riso so they read as intentional, not stock), a working film-strip scrubber in every spread, draggable/pinchable specimen sheets that generate real PDFs, a custom video player with a playlist, and the folio/running-head chrome that tracks your position like page numbers in a book.

What's in the completed build:

Hero — "MARA / VOSS" set edge-to-edge in variable Archivo; each letter animates its weight and width axes on load with a stagger and overshoot, then idles on a slow wave. Move your mouse across the name and letters bulge toward the cursor; click one and it bumps. A rotating rosette stamp marks the corner.
Project spreads — a cover with a clickable index, then four spreads (Havn identity, Brenna packaging, Oslo Jazz posters, Grotesk Nor type). Each is a full "page" with kicker/headline/two-column editorial copy/drop cap/pull quote, a construction or product illustration that builds itself when the spread activates (the mark draws on, the tin rises, the posters stamp down one by one, the glyph's axes run live with real readouts), and a duotone photo plate. Spreads cross-fade with a slight horizontal slide; arrow keys also turn them.
Film-strip palettes — each spread's ink library sits in a draggable sprocket-holed strip with a center playhead. Fling it and it decays and snaps to the nearest frame; leave it and it idles like a projector. Whatever ink sits under the playhead recolors that spread's big outline numeral and caption chip.
Specimens — a paste-up board with three taped-down sheets: drag them, pinch (or Ctrl+scroll) to scale/rotate, double-click to reset, and the download button renders a real A4 specimen PDF client-side (crop marks, giant glyph, character set, waterfall, barcode) via jsPDF.
Talks — a custom player (poster, play/pause, scrubbable timeline, mute, fullscreen) wired to a playlist of five lectures; selecting a row swaps the recording.
Print chrome — running head, live folio numbers ("P. 007–008 / Spread 01/04 — HAVN"), Oslo clock, reading progress, crop marks, paper grain, and the riso dot cursor trail (with a burst on click). The chrome inverts to paper-on-ink over the contact/colophon.
The photos are seeded placeholder plates in red/blue riso duotone — swap the picsum.photos URLs for real scans when you have them, and the colophon already confesses they're stand-ins.
