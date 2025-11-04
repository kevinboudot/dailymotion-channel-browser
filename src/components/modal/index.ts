import type { AppComponent, VideoDto, DMPlayerInstance } from '@/types';
import { createElementFromHTML } from '@/utils';
import DailymotionService from '@/services/dailymotion';
import Template from './modal.tpl.html?raw';
import './modal.style.css';

export interface ModalComponent extends AppComponent {
  open: (video: VideoDto) => void;
  close: () => void;
}

export function ModalComponent(): ModalComponent {
  const $el = createElementFromHTML<HTMLElement>(Template);
  const $body = document.body as HTMLBodyElement;
  const $overlay = $el.querySelector('.modal__overlay') as HTMLDivElement;
  const $close = $el.querySelector('.modal__close') as HTMLButtonElement;

  let currentPlayer: DMPlayerInstance | null = null;

  const playerEndHandler = () => close();

  const close = () => {
    if (currentPlayer) {
      currentPlayer.pause();
      currentPlayer.off(window.dailymotion.events.VIDEO_END, playerEndHandler);
      currentPlayer.destroy();
      currentPlayer = null;
    }
    $body.classList.remove('no-scroll');
    $el.classList.remove('modal--visible');
  };

  const open = async (video: VideoDto) => {
    // Close any existing player before opening a new one
    if (currentPlayer) {
      close();
    }

    try {
      $body.classList.add('no-scroll');
      $el.classList.add('modal--visible');
      currentPlayer = await DailymotionService.createPlayer('modal__player', video.id);
      // Auto-close modal when video ends
      currentPlayer.on(window.dailymotion.events.VIDEO_END, playerEndHandler);
    } catch (error) {
      console.error('Failed to open video player:', error);
      // Close modal on error to restore UI state
      close();
    }
  };

  const mount = () => {
    $overlay.addEventListener('click', close);
    $close.addEventListener('click', close);
  };

  const destroy = () => {
    $overlay.removeEventListener('click', close);
    $close.removeEventListener('click', close);
    if (currentPlayer) {
      currentPlayer.destroy();
      currentPlayer = null;
    }
    $el.remove();
  };

  return { $el, mount, destroy, open, close };
}
