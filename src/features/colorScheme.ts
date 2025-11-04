import { COLOR_SCHEME_STORAGE_KEY } from '@/constants';
import type { AppFeature, ColorScheme } from '@/types';

interface ColorSchemeFeature extends AppFeature {
  toggleColorScheme: () => void;
}

const DATA_ATTRIBUTE = 'colorScheme';

export function ColorSchemeFeature(): ColorSchemeFeature {
  const getSystemColorScheme = (): ColorScheme =>
    matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const getStoredColorScheme = (): ColorScheme | null =>
    (localStorage.getItem(COLOR_SCHEME_STORAGE_KEY) as ColorScheme) ?? null;

  /**
   * Applies a color scheme to the document and optionally persists it to localStorage.
   * @param persist - If true, saves the scheme to localStorage for future sessions
   */
  const setColorScheme = (scheme: ColorScheme, persist = false): void => {
    document.documentElement.dataset[DATA_ATTRIBUTE] = scheme;
    if (persist) localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, scheme);
  };

  const initialColorScheme = getStoredColorScheme() ?? getSystemColorScheme();

  const toggleColorScheme = () => {
    const current =
      (document.documentElement.dataset[DATA_ATTRIBUTE] as ColorScheme) || getSystemColorScheme();
    setColorScheme(current === 'dark' ? 'light' : 'dark', true);
  };

  const mount = () => {
    setColorScheme(initialColorScheme, false);
  };

  const destroy = () => {
    delete document.documentElement.dataset[DATA_ATTRIBUTE];
  };

  return { mount, destroy, toggleColorScheme };
}
