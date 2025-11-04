import { CHANNEL_PAGE_LIMIT } from '@/constants';
import type { AppComponent, VideoDto, VideosResponse } from '@/types';
import { createElementFromHTML } from '@/utils';
import { CardComponent } from '@/components/gallery/card';
import Template from './gallery.tpl.html?raw';
import './gallery.style.css';

interface GalleryComponent extends AppComponent {
  loadMore: () => void;
  onVideoRequested: (fn: (data: VideoDto) => void) => void;
  onVideosPageRequested: (fn: () => void) => void;
  appendVideos: (videos: VideosResponse) => void;
}

export function GalleryComponent(): GalleryComponent {
  const $el = createElementFromHTML<HTMLElement>(Template);
  const $items = $el.querySelector('.gallery__items') as HTMLDivElement;
  const $loadMore = $el.querySelector('.gallery__load-more') as HTMLButtonElement;
  const $findAnotherChannel = $el.querySelector('.gallery__empty-state-find') as HTMLButtonElement;

  const cards: ReturnType<typeof CardComponent>[] = [];

  let handleVideosPageRequested: () => void = () => {};
  let handleVideoRequested: (data: VideoDto) => void = () => {};

  /**
   * Creates placeholder card components for the next page of videos.
   * Cards are created in skeleton state and will be updated later.
   */
  const createCards = () => {
    $loadMore.classList.remove('button--display');
    const $fragment = new DocumentFragment();
    for (let i = 0; i < CHANNEL_PAGE_LIMIT; i++) {
      const card = CardComponent(cards.length);
      $fragment.appendChild(card.$el as Node);
      cards.push(card);
    }
    $items.appendChild($fragment);
  };

  /**
   * Populates the most recently created cards with video data.
   * If there are fewer videos than cards, destroys the unused cards.
   */
  const appendCards = (videos: VideosResponse) => {
    // Get the cards created for this page (last N cards)
    const lastCards = cards.slice(-CHANNEL_PAGE_LIMIT);
    const numVideos = videos.list.length;
    const cardsToMount = Math.min(numVideos, lastCards.length);

    // Mount video data to available cards
    for (let i = 0; i < cardsToMount; i++) {
      const card = lastCards[i];
      const item = videos.list[i];
      card.onCardOpen((data) => handleVideoRequested(data));
      if (card && item) {
        card.mount?.(item);
      }
    }

    // Clean up unused cards if we have fewer videos than expected
    if (cardsToMount < lastCards.length || numVideos === 0) {
      for (let i = cardsToMount; i < lastCards.length; i++) {
        const card = lastCards[i];
        card.destroy?.();
        const idx = cards.indexOf(card);
        if (idx !== -1) {
          cards.splice(idx, 1);
        }
      }
    }
  };

  const findAnotherChannel = () => (window.location.href = '/');

  const loadMore = () => {
    createCards();
    handleVideosPageRequested();
  };

  const appendVideos = (videos: VideosResponse) => {
    appendCards(videos);
    if (videos.has_more) $loadMore.classList.add('button--display');
    // Show empty state if first page has no videos (Same behavior for API errors)
    if (videos.page === 1 && videos.list.length === 0 && videos.total === 0)
      $el.classList.add('gallery--empty');
  };

  const onVideosPageRequested = (fn: () => void) => (handleVideosPageRequested = fn);
  const onVideoRequested = (fn: (data: VideoDto) => void) => (handleVideoRequested = fn);

  const mount = async () => {
    $findAnotherChannel.addEventListener('click', findAnotherChannel);
    $loadMore.addEventListener('click', loadMore);
  };

  const destroy = () => {
    $findAnotherChannel.removeEventListener('click', findAnotherChannel);
    $loadMore.removeEventListener('click', loadMore);
    for (const card of cards) card.destroy?.();
    $el?.remove();
  };

  return { $el, mount, destroy, loadMore, onVideoRequested, onVideosPageRequested, appendVideos };
}
