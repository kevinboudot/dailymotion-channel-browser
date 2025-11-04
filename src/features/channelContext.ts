import {
  CHANNEL_PAGE_LIMIT,
  CHANNEL_DEFAULT_ID,
  CHANNEL_QUERY_PARAM,
  DM_API_FIELDS,
} from '@/constants';
import type { AppFeature, VideosResponse } from '@/types';
import DailymotionService from '@/services/dailymotion';

export interface ChannelContextFeature extends AppFeature {
  loadMoreVideos: () => void;
  onVideosLoaded: (fn: (videos: VideosResponse) => void) => void;
}

export function ChannelContextFeature(): ChannelContextFeature {
  let currentChannelId: string = CHANNEL_DEFAULT_ID;
  let currentPage = 0;

  let handleVideosLoaded: (videos: VideosResponse) => void = () => {};

  const onVideosLoadedAction = (videos: VideosResponse) => handleVideosLoaded(videos);
  const onVideosLoaded = (fn: (videos: VideosResponse) => void) => {
    handleVideosLoaded = fn;
  };

  const loadMoreVideos = async () => {
    currentPage++;
    const videos = await DailymotionService.getChannelVideos(currentChannelId, {
      fields: DM_API_FIELDS,
      limit: CHANNEL_PAGE_LIMIT,
      page: currentPage,
    });
    onVideosLoadedAction(videos);
  };

  const mount = async () => {
    // Extract channel ID from URL query parameter, fallback to default if missing
    const param = new URLSearchParams(window.location.search)
      .get(CHANNEL_QUERY_PARAM)
      ?.trim()
      .toLowerCase();
    if (param) {
      currentChannelId = param;
    } else {
      window.history.pushState({}, '', `?${CHANNEL_QUERY_PARAM}=${CHANNEL_DEFAULT_ID}`);
    }
  };

  const destroy = () => {};

  return { mount, destroy, onVideosLoaded, loadMoreVideos };
}
