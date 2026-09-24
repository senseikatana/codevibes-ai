export interface Video {
  id: number;
  title: string;
  cat: string;
  date: string;
  views: string;
  runtime: string;
  img: string;
  tag?: string;
}

export interface Product {
  name: string;
  price: number;
  cat: string;
  why: string;
  img: string;
}

export const videos: Video[] = [
  {
    id: 247,
    title: 'The Phone That Killed The Compact Flagship',
    cat: 'review',
    date: '2 DAYS AGO',
    views: '142K',
    runtime: '18:24',
    img: 'vid247',
    tag: 'NEW',
  },
  {
    id: 246,
    title: 'I Bought Every $100 Wireless Earbud on Amazon',
    cat: 'comparison',
    date: '1 WEEK AGO',
    views: '289K',
    runtime: '24:11',
    img: 'vid246',
  },
  {
    id: 245,
    title: "Why Apple's M4 Mac Mini Changes Everything",
    cat: 'deep',
    date: '2 WEEKS AGO',
    views: '412K',
    runtime: '32:08',
    img: 'vid245',
  },
  {
    id: 244,
    title: 'Sony A7V vs Canon R5 II — The Real Test',
    cat: 'comparison',
    date: '3 WEEKS AGO',
    views: '178K',
    runtime: '19:47',
    img: 'vid244',
  },
  {
    id: 243,
    title: 'My 2025 Desk Setup — Final Form',
    cat: 'setup',
    date: '1 MONTH AGO',
    views: '356K',
    runtime: '14:22',
    img: 'vid243',
  },
  {
    id: 242,
    title: "ChatGPT Can Now Write Code. I'm Worried.",
    cat: 'news',
    date: '1 MONTH AGO',
    views: '524K',
    runtime: '11:35',
    img: 'vid242',
  },
  {
    id: 241,
    title: 'The Truth About OLED Burn-In (3 Year Study)',
    cat: 'deep',
    date: '6 WEEKS AGO',
    views: '632K',
    runtime: '28:14',
    img: 'vid241',
  },
  {
    id: 240,
    title: 'Framework 16 Review — A Laptop I Can Fix',
    cat: 'review',
    date: '2 MONTHS AGO',
    views: '247K',
    runtime: '21:39',
    img: 'vid240',
  },
  {
    id: 239,
    title: 'Behind The Scenes: Building The New Studio',
    cat: 'bts',
    date: '2 MONTHS AGO',
    views: '98K',
    runtime: '16:52',
    img: 'vid239',
  },
  {
    id: 238,
    title: "RTX 5090 — Don't Buy One Yet",
    cat: 'news',
    date: '2 MONTHS AGO',
    views: '1.1M',
    runtime: '12:48',
    img: 'vid238',
  },
  {
    id: 237,
    title: 'iPad Pro M4 — The Laptop Replacement Question',
    cat: 'review',
    date: '3 MONTHS AGO',
    views: '384K',
    runtime: '23:17',
    img: 'vid237',
  },
  {
    id: 236,
    title: 'I Tracked Every Notification For 30 Days',
    cat: 'deep',
    date: '3 MONTHS AGO',
    views: '447K',
    runtime: '19:05',
    img: 'vid236',
  },
];

export const products: Product[] = [
  {
    name: 'Audio-Technica M50x',
    price: 149,
    cat: 'AUDIO',
    why: 'Studio reference for 15 years. Still unbeaten.',
    img: 'prod1',
  },
  {
    name: 'Logitech MX Master 4',
    price: 119,
    cat: 'INPUT',
    why: 'The only mouse I recommend without caveats.',
    img: 'prod2',
  },
  {
    name: 'Røde PodMic USB',
    price: 199,
    cat: 'AUDIO',
    why: 'Better than mics twice the price. My daily.',
    img: 'prod3',
  },
  {
    name: 'Anker 737 Power Bank',
    price: 89,
    cat: 'ACCESSORY',
    why: 'Flown with this 40+ times. Indestructible.',
    img: 'prod4',
  },
  {
    name: 'Keychron Q1 Pro',
    price: 199,
    cat: 'INPUT',
    why: 'Best budget mechanical. End of debate.',
    img: 'prod5',
  },
  {
    name: 'Airthings Wave Plus',
    price: 249,
    cat: 'HOME',
    why: 'Know your air quality. Worth every cent.',
    img: 'prod6',
  },
  { name: 'Sony WH-1000XM6', price: 449, cat: 'AUDIO', why: 'Best noise cancelling. Period.', img: 'prod7' },
  {
    name: 'iPad Pro M4 11"',
    price: 999,
    cat: 'TABLET',
    why: 'The only tablet worth $1000 in 2025.',
    img: 'prod8',
  },
  {
    name: 'Kinesis Advantage360',
    price: 649,
    cat: 'INPUT',
    why: 'Daily driver since 2023. Saved my wrists.',
    img: 'prod9',
  },
  {
    name: 'Apple Studio Display',
    price: 1599,
    cat: 'DISPLAYS',
    why: 'Controversial but I genuinely love mine.',
    img: 'prod10',
  },
  {
    name: 'LG C4 OLED 65"',
    price: 1899,
    cat: 'DISPLAYS',
    why: 'Best TV for the money this year.',
    img: 'prod11',
  },
  {
    name: 'Sony A7CR',
    price: 1999,
    cat: 'CAMERA',
    why: 'Compact body, full-frame image quality.',
    img: 'prod12',
  },
];

export function videoCardHTML(v: Video, index = 0): string {
  return `<article class="video-card shuffling" style="animation-delay: ${Math.min(index, 11) * 35}ms">
      <div class="video-card-thumb">
        <img src="/img/${v.img}-640x360.jpg" alt="${v.title}" loading="lazy">
        <div class="preview-tag">PREVIEWING</div>
        <div class="preview-progress"></div>
        <div class="absolute bottom-3 right-3 bg-black/85 text-white px-2 py-1 text-[11px] font-mono z-[2]">${v.runtime}</div>
        ${v.tag ? `<div class="absolute top-3 right-3 bg-[var(--accent)] text-black px-2 py-1 text-[10px] font-mono font-bold z-[3]">${v.tag}</div>` : ''}
        <div class="absolute top-3 left-3 z-[3]">
          <span class="text-[10px] font-mono uppercase tracking-widest text-white bg-black/60 backdrop-blur px-2 py-1 border border-white/20">EP ${v.id}</span>
        </div>
      </div>
      <div class="mt-3">
        <a href="/videos/ep-${v.id}"><h3 class="font-display text-lg leading-tight mb-2 hover:text-[var(--accent)] transition cursor-pointer">${v.title}</h3></a>
        <div class="flex items-center gap-3 text-[11px] font-mono text-[var(--fg-dim)] uppercase tracking-wider">
          <span>${v.date}</span><span>·</span><span>${v.views} views</span>
        </div>
      </div>
    </article>`;
}

export function productCardHTML(p: Product): string {
  return `<div class="rec-card" data-price="${p.price}" data-cat="${p.cat}">
      <div class="aspect-[4/3] overflow-hidden bg-black relative">
        <img src="/img/${p.img}-600x450.jpg" class="w-full h-full object-cover" alt="${p.name}" loading="lazy">
        <div class="absolute top-3 left-3 bg-[var(--yellow)] text-black px-2 py-1 text-[10px] font-mono font-bold tracking-wider">${p.cat}</div>
        <div class="absolute bottom-3 right-3 bg-black/90 text-white px-3 py-1.5 text-sm font-mono">$${p.price.toLocaleString()}</div>
      </div>
      <div class="p-5">
        <h3 class="font-display text-xl mb-2">${p.name}</h3>
        <p class="text-sm text-[var(--fg-dim)] mb-4 leading-relaxed">"${p.why}"</p>
        <div class="flex items-center justify-between text-xs">
          <span class="font-mono text-[var(--fg-dim)] uppercase">Verified Purchase</span>
          <a href="/picks" class="text-[var(--yellow)] hover:text-white transition flex items-center gap-1.5 font-semibold uppercase tracking-wider">
            Buy <i class="fas fa-arrow-up-right-from-square text-[9px]"></i>
          </a>
        </div>
      </div>
    </div>`;
}
