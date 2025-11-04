import { DM_API_ENDPOINTS, DM_PLAYER_SDK_URL, DM_PLAYER_SDK_PLAYER_ID } from '@/constants';
import type {
  VideosRequestParams,
  VideosResponse,
  DMPlayerInstance,
  DMPlayerOptions,
  DMPlayerCreateOptions,
} from '@/types';
import { buildQueryUrl, fetchJson } from '@/utils';

export default class DailymotionService {
  static loadDMPlayerSDK = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window.dailymotion !== 'undefined') {
        resolve();
      } else {
        const script = document.createElement('script');
        script.defer = true;
        script.src = `${DM_PLAYER_SDK_URL}/${DM_PLAYER_SDK_PLAYER_ID}.js`;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Dailymotion Player SDK'));
        document.head.appendChild(script);
      }
    });
  };

  static getChannelVideos = async (
    channelId: string,
    filters: VideosRequestParams,
  ): Promise<VideosResponse> => {
    try {
      const url = buildQueryUrl(DM_API_ENDPOINTS.channelVideos(channelId), filters);
      const { data, error } = await fetchJson<VideosResponse>(url);
      if (error) {
        console.error('Failed to fetch channel videos:', error);
        // Return empty response structure to maintain consistent API contract
        return { page: 1, limit: 0, total: 0, has_more: false, list: [] };
      }
      return data ?? { page: 1, limit: 0, total: 0, has_more: false, list: [] };
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      // Return empty response structure to maintain consistent API contract
      return { page: 1, limit: 0, total: 0, has_more: false, list: [] };
    }
  };

  static createPlayer = async (
    selectorId: string,
    video: string,
    opts: DMPlayerOptions = {},
  ): Promise<DMPlayerInstance> => {
    try {
      await this.loadDMPlayerSDK();
      if (!window.dailymotion || !window.dailymotion.createPlayer) {
        throw new Error('Dailymotion Player SDK not available');
      }
      return await window.dailymotion.createPlayer(selectorId, {
        video,
        params: opts,
      } as DMPlayerCreateOptions);
    } catch (error) {
      console.error('Failed to create player:', error);
      throw error;
    }
  };
}
