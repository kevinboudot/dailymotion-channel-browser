import '@/styles/global.css';
import { ScrollDirectionFeature } from '@/features/scrollDirection';
import { ColorSchemeFeature } from '@/features/colorScheme';
import { ChannelContextFeature } from '@/features/channelContext';
import { HeaderComponent } from '@/components/header';
import { GalleryComponent } from '@/components/gallery';
import { ModalComponent } from '@/components/modal';

async function App(): Promise<void> {
  const $app = document.querySelector('#app') as HTMLElement;

  const features = {
    colorScheme: ColorSchemeFeature(),
    channelContext: ChannelContextFeature(),
    scrollDirection: ScrollDirectionFeature(),
  };

  Object.values(features).forEach((f) => f.mount?.());

  const components = {
    header: HeaderComponent(),
    gallery: GalleryComponent(),
    modal: ModalComponent(),
  };

  const $fragment = new DocumentFragment();
  for (const c of Object.values(components)) {
    $fragment.append(c.$el);
    c.mount?.();
  }

  $app.append($fragment);

  // Components and features use a callback-based observer pattern where:
  components.header.onColorSchemeToggle(features.colorScheme.toggleColorScheme);
  components.gallery.onVideosPageRequested(features.channelContext.loadMoreVideos);
  features.channelContext.onVideosLoaded(components.gallery.appendVideos);
  components.gallery.onVideoRequested((data) => components.modal.open(data));

  // Load initial videos (aka The start button)
  components.gallery.loadMore();

  // Cleanup on page unload
  window.addEventListener(
    'beforeunload',
    () => {
      Object.values(components).forEach((c) => c.destroy?.());
      Object.values(features).forEach((f) => f.destroy?.());
    },
    { once: true },
  );
}

document.addEventListener('DOMContentLoaded', App, { once: true });
