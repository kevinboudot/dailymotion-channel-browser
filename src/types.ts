export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export interface AppFeature {
  mount?: () => void;
  destroy?: () => void;
}

export interface AppComponent extends AppFeature {
  $el: HTMLElement;
}

export type ColorScheme = 'light' | 'dark';
export type ScrollDirection = 'up' | 'down' | 'none';

export interface VideoDto {
  id: string;
  title: string;
  thumbnail_url: string;
  thumbnail_180_url: string;
  thumbnail_360_url: string;
  thumbnail_480_url: string;
  thumbnail_720_url: string;
  thumbnail_1080_url: string;
  aspect_ratio: number;
}

export interface VideosRequestParams {
  fields?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface VideosResponse {
  page: number;
  limit: number;
  total?: number;
  has_more: boolean;
  list: VideoDto[];
}

export type DMPlayerOptions = Record<string, string | number | boolean | undefined>;

export interface DMPlayerCreateOptions {
  video: string;
  params: DMPlayerOptions;
}

export type DMPlayerEvent = string;

export interface DMPlayerInstance {
  on: (event: DMPlayerEvent, callback: (payload: unknown) => void, parameters?: string[]) => void;
  off: (event: DMPlayerEvent, callback?: (payload: unknown) => void) => void;
  play: () => void;
  pause: () => void;
  destroy: () => void;
}

export interface DMPlayer {
  element: HTMLElement;
  instance: DMPlayerInstance | null;
}

declare global {
  interface Window {
    dailymotion: {
      createPlayer: (
        selectorId: string,
        options: DMPlayerCreateOptions,
      ) => Promise<DMPlayerInstance>;
      events: {
        VIDEO_END: string;
      };
    };
  }
}
