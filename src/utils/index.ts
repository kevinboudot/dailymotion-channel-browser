import type { QueryParams } from '@/types';

/**
 * Creates a DOM element from an HTML string using the template element pattern.
 * This approach is safer than innerHTML on regular elements as it doesn't execute scripts.
 *
 * @param html - The HTML string to parse into a DOM element.
 * @returns The first element child from the template, cast to the specified type.
 * @throws {Error} If the HTML template is invalid or empty.
 */
export const createElementFromHTML = <T extends HTMLElement = HTMLElement>(html: string): T => {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  const el = tpl.content.firstElementChild as T;
  if (!el) throw new Error('Invalid HTML template');
  return el as T;
};

/**
 * Waits for the next browser repaint cycle using requestAnimationFrame.
 * Useful for ensuring DOM updates are rendered before proceeding.
 * Falls back to an immediately resolved promise in non-browser environments.
 *
 * @returns A promise that resolves after the next browser repaint cycle.
 */
export function nextTick(): Promise<void> {
  if (typeof requestAnimationFrame === 'undefined') return Promise.resolve();
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

/**
 * Builds a URL-encoded query string from an object of parameters.
 * Filters out undefined and null values, and properly encodes all keys and values.
 *
 * @param params - An object containing key-value pairs to convert to a query string.
 * @returns A URL-encoded query string (e.g., "key1=value1&key2=value2").
 */
export function buildQueryString(params: QueryParams = {}): string {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(String(value)))
    .join('&');
}

/**
 * Constructs a complete URL by appending query parameters to a base URL.
 * Automatically builds the query string from the provided parameters object.
 *
 * @param url - The base URL to append query parameters to.
 * @param params - An object containing key-value pairs to convert to query parameters.
 * @returns The complete URL with query string appended.
 */
export const buildQueryUrl = (url: string, params: QueryParams = {}): string => {
  const queryString = buildQueryString(params);
  return `${url}?${queryString}`;
};

/**
 * Handles fetch errors by consuming the response body (required to prevent memory leaks)
 * and creating a descriptive error message.
 * The response body must be consumed to prevent memory leaks in browsers.
 *
 * @param res - The failed Response object from a fetch request.
 * @returns An Error object containing HTTP status code and status text.
 */
export const handleFetchError = async (res: Response): Promise<Error> => {
  // Consume the response body to prevent memory leaks (Response body must be read)
  try {
    await res.text();
  } catch {
    /* silently fail if body is already consumed or unavailable */
  }
  const error = new Error(`HTTP ${res.status} – ${res.statusText}`);
  console.error(error);
  return error;
};

/**
 * Fetches JSON data from a URL and handles errors gracefully.
 * Returns either the parsed data or an error object, never throwing.
 * Automatically sets the Accept header to request JSON content.
 *
 * @param url - The URL to fetch JSON data from.
 * @returns A promise that resolves to an object containing either:
 *   - `data`: The parsed JSON response (when successful)
 *   - `error`: An Error object with HTTP status information (when failed)
 */
export async function fetchJson<T>(url: string): Promise<{ data?: T; error?: Error }> {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  return !res.ok ? { error: await handleFetchError(res) } : { data: (await res.json()) as T };
}
