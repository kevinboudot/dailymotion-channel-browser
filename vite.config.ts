import { defineConfig, type Plugin } from 'vite';
import { minify as minifyHtml } from 'html-minifier-terser';
import { analyzer } from 'vite-bundle-analyzer';

const minifyRawHtml = (): Plugin => ({
  name: 'minify-raw-html-no-fs',
  apply: 'build',
  enforce: 'post',
  async transform(code, id) {
    if (!id.endsWith('.html?raw')) return null;
    const m = code.match(/export\s+default\s+(["'])([\s\S]*)\1;?\s*$/);
    if (!m) return null;
    const html = JSON.parse(m[1] + m[2] + m[1]);
    const out = await minifyHtml(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      minifyCSS: true,
      minifyJS: true,
      keepClosingSlash: true,
    });
    return {
      code: `export default ${JSON.stringify(out)};`,
      map: null,
    };
  },
});

const withAnalyze = process.argv.includes('--analyze') || process.env.ANALYZE === 'true';

export default defineConfig({
  plugins: [
    minifyRawHtml(),
    ...(withAnalyze ? [analyzer({ analyzerMode: 'static', openAnalyzer: true })] : []),
  ],
  resolve: {
    alias: { '@': '/src' },
  },
});
