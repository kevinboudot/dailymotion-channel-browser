export const DM_API_BASE_URL = 'https://api.dailymotion.com';

export const DM_API_ENDPOINTS = {
  // Channel endpoints use 'user' in API (legacy terminology)
  channelVideos: (channelId: string) => `${DM_API_BASE_URL}/user/${channelId}/videos`,
} as const;

export const DM_API_FIELDS =
  'id,title,thumbnail_url,thumbnail_180_url,thumbnail_360_url,thumbnail_480_url,thumbnail_720_url,thumbnail_1080_url,aspect_ratio';
export const DM_PLAYER_SDK_URL = 'https://geo.dailymotion.com/libs';
export const DM_PLAYER_SDK_PLAYER_ID = 'player';
export const CHANNEL_QUERY_PARAM = 'channel';
export const CHANNEL_DEFAULT_ID = 'dm-support-policy';
export const CHANNEL_PAGE_LIMIT = 39; // 3-column layout
export const COLOR_SCHEME_STORAGE_KEY = 'dmcb.ui.colorScheme';
export const SCROLL_DIRECTION_THRESHOLD = 100;
export const GALLERY_PRELOAD_BOTTOM_MARGIN = '400px';
export const GALLERY_CARD_IMG_FETCH_PRIORITY = 9;
