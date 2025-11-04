import { describe, it, expect } from 'vitest';
import { createElementFromHTML } from '../index';

describe('utils', () => {
  describe('createElementFromHTML', () => {
    it('creates a root element from HTML string', () => {
      const el = createElementFromHTML<HTMLDivElement>('<div class="x">Hello</div>');
      expect(el.tagName).toBe('DIV');
      expect(el.className).toBe('x');
      expect(el.textContent).toBe('Hello');
    });

    it('throws on empty/invalid HTML', () => {
      expect(() => createElementFromHTML('')).toThrow('Invalid HTML template');
    });
  });
});
