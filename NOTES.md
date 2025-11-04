# Project Notes

## 🧭 About this project

- Developed using Cursor App.
- Tested on macOS / Chrome (DevTools) — no extensive cross-browser or cross-device validation performed.
- Code comments are illustrative rather than exhaustive; see src/utils/index.ts for examples.
- Unit test coverage is intentionally minimal, focusing on core utilities (src/utils/**tests**/utils.test.ts).
- The project emphasizes clarity, maintainability, and architecture over completeness.

## 🧠 AI Usage

The usage of AI in this project was limited to productivity assistance — such as generating boilerplate code, refining documentation, and validating consistency.
All architectural, structural, and implementation decisions were reasoned and implemented manually, ensuring full technical ownership and understanding.

## 📝 Future Improvements

The following optimizations could be considered in future iterations:

- **Testing strategy**: Add unit, integration, and E2E tests to ensure full coverage of components and utilities.
- **Error boundaries**: Introduce graceful error handling and fallback UI states.
- **Request debouncing**: Debounce scroll events and API calls to avoid unnecessary requests.
- **Gallery usability**: Evaluate usability of infinite scroll versus a “more” button.
- **Accessibility**: Improve keyboard navigation, ARIA labels, and screen reader support.
- **Image optimization**: Use the existing CDN (CloudFront) to serve adaptive image formats (WebP, AVIF).
- **API Consistency**: Ensure consistent route naming and API endpoints.
- **Service Worker**: Add offline support and smarter caching for improved reliability.
- **Performance monitoring**: Add runtime metrics and logging for real-world performance tracking.
- **CSS Breakpoints**: Cover a wider range of breakpoints for responsive design.
- **PostCSS / custom media queries**: Use PostCSS for compatibility with older browsers & to define reusable responsive breakpoints.
- **SVG Icon Component**: Implement a consistent way to handle SVG icons.
- **Benchmark CSS performance**: Benchmark performance and identify bottlenecks (Background-filters, Box Shadow, Blur..).
- **CSS linting**: Introduce stylelint for consistent and maintainable styling rules.
- **HTML validation**: Add automated linting or pre-commit checks to ensure template consistency.
- **Virtual scrolling**: Implement virtualized rendering for large video grids to maintain smooth scrolling.
- **Adaptive Pagination**: Implement pagination strategies relative to landing/more and screen sizes.
