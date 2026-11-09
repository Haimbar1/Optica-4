import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';
import {BRANCHES, Branch, SITE_URL, BRAND_NAME, ALL_BRANCH_NAMES, branchJsonLd} from './src/data/branches';

const HOME_TITLE = `${BRAND_NAME} | בדיקת ראייה ומשקפיים ב-150 ₪ – ${ALL_BRANCH_NAMES}`;
const HOME_DESCRIPTION = `מיזם אופטיקה חברתית: בדיקת ראייה חינם, משקפי ראייה מלאים ב-150 ₪ ועדשות מולטיפוקל מ-800 ₪. סניפים ב${ALL_BRANCH_NAMES}. קביעת תור ביומן.`;

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// The head of a page: title, description, canonical, Open Graph and Google's structured data
function withHead(html: string, title: string, description: string, url: string, jsonLd: unknown, noscript: string): string {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/<p>האופטיקה החברתית · [^<]*<\/p>/, `<p>${esc(noscript)}</p>`)
    .replace('</head>', `    <script type="application/ld+json" id="branch-jsonld">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>\n  </head>`);
}

const branchNoscript = (b: Branch) =>
  `${BRAND_NAME} – סניף ${b.name} · ${b.address || b.areaNote} · בדיקת ראייה ומשקפיים ב-150 ₪ · מגיעים מ${b.nearby.join(', ')}`;

// Every branch gets its own page file (dist/pardes-hanna.html …, served at /pardes-hanna by
// Vercel's cleanUrls) with its own head — Facebook / WhatsApp previews and Google read it without
// running the page. The app itself then shows that branch (App.tsx reads the path).
function branchPages(): Plugin {
  let outDir = 'dist';
  return {
    name: 'branch-pages',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml(html) {
      return withHead(html, HOME_TITLE, HOME_DESCRIPTION, `${SITE_URL}/`, BRANCHES.map(branchJsonLd),
        `${BRAND_NAME} · סניפים ב${ALL_BRANCH_NAMES} · 055-250-2584`);
    },
    writeBundle() {
      const home = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8').replace(/\s*<script type="application\/ld\+json" id="branch-jsonld">[\s\S]*?<\/script>/, '');
      for (const b of BRANCHES) {
        fs.writeFileSync(
          path.join(outDir, `${b.slug}.html`),
          withHead(home, b.seoTitle, b.seoDescription, `${SITE_URL}/${b.slug}`, branchJsonLd(b), branchNoscript(b)),
        );
      }
      const today = new Date().toISOString().slice(0, 10);
      const urls = ['/', ...BRANCHES.map((b) => `/${b.slug}`)];
      fs.writeFileSync(
        path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((u) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today}</lastmod></url>`)
          .join('\n')}\n</urlset>\n`,
      );
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), branchPages()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      allowedHosts: true as const,
      port: 3000,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
