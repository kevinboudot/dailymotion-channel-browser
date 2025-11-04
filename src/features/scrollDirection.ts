import { SCROLL_DIRECTION_THRESHOLD } from '@/constants';
import type { AppFeature, ScrollDirection } from '@/types';

type ScrollDirectionFeature = AppFeature;

const CLASSNAME_UP = 'scroll-up';
const CLASSNAME_DOWN = 'scroll-down';

export function ScrollDirectionFeature(): ScrollDirectionFeature {
  const $body = document.body;

  let lastY = Math.max(0, window.scrollY || 0);
  let raf: number | null = null;
  let currentDir: ScrollDirection = 'none';

  const applyDirection = (dir: ScrollDirection) => {
    if (dir === currentDir) return;
    currentDir = dir;
    $body.classList.toggle(CLASSNAME_UP, dir === 'up');
    $body.classList.toggle(CLASSNAME_DOWN, dir === 'down');
  };

  const updateDirection = () => {
    raf = null;
    const y = Math.max(0, window.scrollY || 0);
    const dy = y - lastY;
    // Only detect direction if scrolled past threshold; compare current vs previous position
    const dir: ScrollDirection = y > SCROLL_DIRECTION_THRESHOLD ? (dy < 0 ? 'up' : 'down') : 'none';
    applyDirection(dir);
    lastY = y;
  };

  const onScroll = () => {
    // Throttle scroll updates using requestAnimationFrame to avoid excessive DOM updates
    if (raf == null) raf = requestAnimationFrame(updateDirection);
  };

  const mount = () => {
    window.addEventListener('scroll', onScroll, { passive: true });
    updateDirection();
  };

  const destroy = () => {
    if (raf != null) cancelAnimationFrame(raf);
    window.removeEventListener('scroll', onScroll);
    $body.classList.remove(CLASSNAME_UP, CLASSNAME_DOWN);
    currentDir = 'none';
    // Reset scroll position on cleanup for next session ;)
    window.scrollTo(0, 0);
  };

  return { mount, destroy };
}
