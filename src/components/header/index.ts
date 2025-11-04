import type { AppComponent } from '@/types';
import { createElementFromHTML } from '@/utils';
import Template from './header.tpl.html?raw';
import './header.style.css';

export interface HeaderComponent extends AppComponent {
  onColorSchemeToggle: (fn: () => void) => void;
}

export function HeaderComponent(): HeaderComponent {
  const $el = createElementFromHTML<HTMLElement>(Template);
  const $brandLogo = $el.querySelector<HTMLAnchorElement>('.header__logo')!;
  const $brandTitle = $el.querySelector<HTMLAnchorElement>('.header__brand-title')!;
  const $colorSchemeToggle = $el.querySelector<HTMLButtonElement>('.color-scheme-toggle')!;

  let handleColorSchemeToggle: () => void = () => {};

  const onBrandClick = (e: MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onColorSchemeToggleClick = () => handleColorSchemeToggle();
  const onColorSchemeToggle = (fn: () => void) => {
    handleColorSchemeToggle = fn;
  };

  const mount = () => {
    $brandLogo.addEventListener('click', onBrandClick);
    $brandTitle.addEventListener('click', onBrandClick);
    $colorSchemeToggle.addEventListener('click', onColorSchemeToggleClick);
  };

  const destroy = () => {
    $brandLogo.removeEventListener('click', onBrandClick);
    $brandTitle.removeEventListener('click', onBrandClick);
    $colorSchemeToggle.removeEventListener('click', onColorSchemeToggleClick);
    $el.remove();
  };

  return { $el, mount, destroy, onColorSchemeToggle };
}
