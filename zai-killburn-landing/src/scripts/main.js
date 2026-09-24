// KILBURN client script — minimal JS around HTMX + Astro server HTML.
// HTMX owns: video filtering, load-more, newsletter submit (HTML over the wire).
// This file keeps only what HTMX can't do: FLIP slider animation, typewriter,
// scroll progress, section-accent observer, chapters, back-to-top.

// ===== Price slider with FLIP animation (client-only, no server roundtrip) =====
function initPriceFilter() {
  const priceLow = document.getElementById('priceLow');
  const priceHigh = document.getElementById('priceHigh');
  if (!priceLow || !priceHigh) return;
  if (priceLow.dataset.wired) return;
  priceLow.dataset.wired = '1';

  const priceLowLabel = document.getElementById('priceLowLabel');
  const priceHighLabel = document.getElementById('priceHighLabel');
  const priceLowDisplay = document.getElementById('priceLowDisplay');
  const priceHighDisplay = document.getElementById('priceHighDisplay');
  const productCount = document.getElementById('productCount');
  const recGrid = document.getElementById('recGrid');

  function updatePriceFilter() {
    let low = parseInt(priceLow.value);
    let high = parseInt(priceHigh.value);
    if (low > high) {
      low = high;
      priceLow.value = low;
    }

    priceLowLabel.textContent = `$${low.toLocaleString()}`;
    priceHighLabel.textContent = `$${high.toLocaleString()}`;
    priceLowDisplay.textContent = `$${low.toLocaleString()}`;
    priceHighDisplay.textContent = `$${high.toLocaleString()}`;

    const cards = Array.from(recGrid.querySelectorAll('.rec-card'));
    const firstPositions = new Map();
    cards.forEach((c) => firstPositions.set(c, c.getBoundingClientRect()));

    let visibleCount = 0;
    cards.forEach((c) => {
      const price = parseInt(c.dataset.price);
      const visible = price >= low && price <= high;
      c.dataset.visible = visible ? '1' : '0';
      if (visible) visibleCount++;
    });

    const visible = cards
      .filter((c) => c.dataset.visible === '1')
      .sort((a, b) => parseInt(a.dataset.price) - parseInt(b.dataset.price));
    const hidden = cards.filter((c) => c.dataset.visible === '0');

    visible.forEach((c) => recGrid.appendChild(c));
    hidden.forEach((c) => recGrid.appendChild(c));

    cards.forEach((c) => {
      if (c.dataset.visible === '0') c.classList.add('filtered-out');
      else c.classList.remove('filtered-out');
    });

    requestAnimationFrame(() => {
      visible.forEach((c) => {
        const first = firstPositions.get(c);
        const last = c.getBoundingClientRect();
        const dy = first.top - last.top;
        const dx = first.left - last.left;
        if (Math.abs(dy) < 1 && Math.abs(dx) < 1) return;
        c.style.transform = `translate(${dx}px, ${dy}px)`;
        c.style.transition = 'none';
        c.style.zIndex = '5';
        requestAnimationFrame(() => {
          c.style.transform = '';
          c.style.transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
          setTimeout(() => {
            c.style.zIndex = '';
          }, 600);
        });
      });
    });

    productCount.textContent = visibleCount;
  }

  priceLow.addEventListener('input', updatePriceFilter);
  priceHigh.addEventListener('input', updatePriceFilter);
}

// ===== Typewriter placeholder =====
function initTypewriter() {
  const input = document.getElementById('emailInput');
  if (!input || input.dataset.wired) return;
  input.dataset.wired = '1';
  const phrases = [
    'you@example.com',
    'your.real.inbox@here.com',
    'first.last@gmail.com',
    'the.email.you.actually.check',
    'no.spam.i.promise@kilburn.tv',
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  function typeLoop() {
    if (document.activeElement === input || input.value) {
      input.setAttribute('placeholder', '');
      setTimeout(typeLoop, 600);
      return;
    }
    const phrase = phrases[phraseIdx];
    let text;
    if (!deleting) {
      text = phrase.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx >= phrase.length) {
        deleting = true;
        setTimeout(typeLoop, 2400);
        return;
      }
    } else {
      text = phrase.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx <= 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    input.setAttribute('placeholder', text + (charIdx % 2 ? '|' : ''));
    setTimeout(typeLoop, deleting ? 28 : 55 + Math.random() * 70);
  }
  typeLoop();
}

// ===== Scroll progress + section accent tracking =====
const accentMap = { red: '#ff2a2a', blue: '#2b6fff', yellow: '#e5ff00' };
let sectionObserver = null;

function updateScroll() {
  const bar = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  if (!bar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  bar.style.width = `${progress}%`;
  if (backToTop) backToTop.classList.toggle('visible', scrollTop > 800);
}

function initScrollChrome() {
  if (window.__killburnScrollWired) return;
  window.__killburnScrollWired = true;
  window.addEventListener('scroll', updateScroll, { passive: true });
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  sectionObserver = new IntersectionObserver(
    (entries) => {
      const intersecting = entries.filter((e) => e.isIntersecting);
      if (intersecting.length === 0) return;
      intersecting.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const accent = intersecting[0].target.dataset.accent;
      if (accent && accentMap[accent]) {
        document.documentElement.style.setProperty('--section-accent', accentMap[accent]);
      }
    },
    { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.1, 0.3, 0.6] },
  );
  observeAccentSections();
  updateScroll();
}

function observeAccentSections() {
  if (!sectionObserver) return;
  document.querySelectorAll('[data-accent]').forEach((s) => sectionObserver.observe(s));
}

// ===== Chapter clicks (event delegation survives HTMX swaps) =====
function initChapters() {
  if (window.__killburnChaptersWired) return;
  window.__killburnChaptersWired = true;
  document.addEventListener('click', (e) => {
    const ch = e.target.closest('.chapter');
    if (!ch) return;
    document.querySelectorAll('.chapter').forEach((c) => {
      c.classList.remove('active');
      c.classList.add('text-[var(--fg-dim)]');
    });
    ch.classList.add('active');
    ch.classList.remove('text-[var(--fg-dim)]');
  });
}

// ===== Filter chip active state (HTMX does the fetch + swap) =====
function initFilterChips() {
  if (window.__killburnChipsWired) return;
  window.__killburnChipsWired = true;
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    document.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
  });
  // Re-trigger shuffle animation on swapped cards + re-observe accent zones
  document.body.addEventListener('htmx:afterSwap', (e) => {
    if (e.target.id === 'videoGrid') {
      e.target.querySelectorAll('.video-card').forEach((card, i) => {
        card.classList.add('shuffling');
        card.style.animationDelay = `${Math.min(i, 11) * 35}ms`;
      });
    }
    observeAccentSections();
    updateScroll();
  });
}

// ===== HTMX fallbacks (kept here so templates stay parser-clean) =====
function initHtmxFallbacks() {
  if (window.__killburnHtmxFallbacksWired) return;
  window.__killburnHtmxFallbacksWired = true;
  // Static hosts have no POST endpoint: explain instead of failing silently.
  document.body.addEventListener('htmx:responseError', (e) => {
    const form = e.target && e.target.closest ? e.target.closest('#newsletterForm') : null;
    if (!form) return;
    const status = document.getElementById('subscribeStatus');
    if (status) {
      status.textContent = '> OFFLINE DEMO: static host has no mail endpoint — write to tips@kilburn.tv';
    }
  });
}

// Disable hover preview on touch devices
if ('ontouchstart' in window && window.innerWidth < 1024) {
  document.body.classList.add('touch-device');
}

initPriceFilter();
initTypewriter();
initScrollChrome();
initChapters();
initFilterChips();
initHtmxFallbacks();
