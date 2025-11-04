import { GALLERY_CARD_IMG_FETCH_PRIORITY, GALLERY_PRELOAD_BOTTOM_MARGIN } from '@/constants';
import type { AppComponent, VideoDto } from '@/types';
import { createElementFromHTML, nextTick } from '@/utils';
import Template from './card.tpl.html?raw';
import './card.style.css';

interface CardComponent extends Omit<AppComponent, 'mount'> {
  mount?: (item: VideoDto) => Promise<void>;
  onCardOpen: (fn: (data: VideoDto) => void) => void;
}

export function CardComponent(index: number): CardComponent {
  const $el = createElementFromHTML<HTMLElement>(Template);
  const $skeleton = $el.querySelector('.card__skeleton') as HTMLDivElement;
  const $title = $el.querySelector('.card__title') as HTMLDivElement;
  let $img: HTMLImageElement | null = null;

  let data: VideoDto | null = null;

  let handleCardOpen: (data: VideoDto) => void = () => {};

  /**
   * Preloads the video thumbnail image and swaps it with the skeleton loader.
   * Uses responsive images with srcset for optimal performance across devices.
   */
  const preloadAndSwap = async () => {
    $img = new Image();
    $img.classList.add('card__img', 'no-select');
    // Apply vertical layout class for portrait videos
    if (data?.aspect_ratio && data.aspect_ratio < 1) $el?.classList.add('card--vertical');

    $img.src = data?.thumbnail_360_url || data?.thumbnail_url || '';
    // Build responsive srcset: browser selects appropriate size based on viewport
    $img.srcset = [
      data?.thumbnail_180_url && `${data.thumbnail_180_url} 320w`,
      data?.thumbnail_360_url && `${data.thumbnail_360_url} 640w`,
      data?.thumbnail_480_url && `${data.thumbnail_480_url} 853w`,
      data?.thumbnail_720_url && `${data.thumbnail_720_url} 1280w`,
      data?.thumbnail_1080_url && `${data.thumbnail_1080_url} 1920w`,
    ]
      .filter(Boolean)
      .join(', ');

    // 3-column layout ≥640px (max 360px per column), single column otherwise
    $img.sizes = '(min-width: 640px) min(33vw, 360px), 100vw';

    $img.alt = data?.title || '';
    // Note: Not using lazy loading since IntersectionObserver handles visibility
    // $img.loading = 'lazy';
    // Prioritize first N images for faster initial render
    $img.fetchPriority = index < GALLERY_CARD_IMG_FETCH_PRIORITY ? 'high' : 'auto';
    $img.decoding = 'async';

    // Wait for image to decode before showing (prevents layout shift)
    try {
      await $img.decode();
    } catch (error) {
      console.error('Image decode error', error);
      destroy(); // Hard fallback for the moment
    }

    // Remove skeleton after image transition comletes
    $img.addEventListener('transitionend', () => $skeleton?.remove());

    await nextTick();
    $el.appendChild($img as Node);
    // Stop observing once image is loaded
    observer.unobserve($el);

    await nextTick();
    $el?.classList.add('card--loaded');
  };

  /**
   * IntersectionObserver callback: starts image loading when card enters viewport.
   * Uses rootMargin to preload images before they're fully visible for smoother scrolling.
   */
  const onIntersect = (entries: IntersectionObserverEntry[]) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      preloadAndSwap();
    }
  };

  // Observe card visibility with bottom margin to preload images before they're visible
  const observer = new IntersectionObserver(onIntersect, {
    root: null,
    rootMargin: GALLERY_PRELOAD_BOTTOM_MARGIN,
    threshold: 0.01,
  });

  const onCardClick = () => data && handleCardOpen(data);
  const onCardOpen = (fn: (data: VideoDto) => void) => (handleCardOpen = fn);

  const mount = async (item: VideoDto) => {
    data = item;
    $title.textContent = data?.title || '';
    observer.observe($el);
    $el.addEventListener('click', onCardClick);
  };

  const destroy = () => {
    observer.unobserve($el);
    $el.removeEventListener('click', onCardClick);
    $el?.remove();
  };

  return { $el, mount, destroy, onCardOpen };
}
