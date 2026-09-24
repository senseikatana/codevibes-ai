import videosData from '../content/videos.json';
import productsData from '../content/products.json';

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

export const videos: Video[] = videosData as Video[];

export const products: Product[] = productsData as Product[];

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
