# Journal by Maren Hofstad


Build a programmer blog with typewriter hero greeting, hover-raise article cards, copy-flash code-block buttons, top reading-progress bar, live GitHub star/fork counters, and a 3-state theme toggle with smooth color transitions. Looking at this, I'll craft a programmer blog with a strong editorial-tech aesthetic — warm amber accents on a deep charcoal canvas (no default blue/purple), bold display typography (JetBrains Mono + Fraunces), and every interaction carrying real weight. The 3-state theme toggle cycles through dark/light/high-contrast, with each transition animating colors across the entire page.

A few notes on what makes this come together:

Color & mood — warm amber (#ff8c42) on deep charcoal, with cyan-teal as a secondary. No blue/purple. The high-contrast mode flips to pure black with electric yellow — genuinely useful, not a gimmick.

3-state theme toggle — a segmented pill with a sliding indicator that animates between dark/light/hc positions. Pressing T also cycles. Every colored element transitions over 600ms, so the whole page morphs visibly when you switch.

Typewriter hero — cycles through five programmer-creditable greetings ("debugging a slow consumer", "reading the Raft paper again") with a real blinking caret. Pairs with a live UTC clock and a terminal panel showing a manifest.md cat'd out.

Hover-raise cards — each article card has a unique SVG banner pattern (dots, grid, waves, triangles, circles, lines), lifts 8px on hover, gets an accent border + glow, and reveals a top gradient line that sweeps in from the left.

Copy-flash — clicking the copy button triggers a green sweep overlay across the entire code block, the button label flips to "copied!", and a bottom toast confirms. The Go snippet is real, idiomatic code (a per-key token bucket rate limiter).

Reading progress — 3px gradient bar at the top, scaled via transform: scaleX() for buttery updates, with a subtle glow.

Live GitHub counters — animated count-up on first scroll-into-view, then a simulation ticks every 5 seconds, occasionally bumping a star (45% chance) or fork (15% chance). Each bump triggers a small "numBump" animation on the digit and a flash on the aggregate stat bar at the top. The page genuinely feels alive.

Other touches — sticky header with backdrop blur, active nav link tracking scroll position, subtle 3D parallax on the hero terminal following the mouse, custom toast (no alert), keyboard shortcut for theme, and a fully responsive grid that collapses cleanly on mobile.
