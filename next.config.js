/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Esplicito (il default di Next.js è già false): nessuna sourcemap
  // client-side generata in build di produzione — un file .map/.ts non
  // dovrebbe mai poter derivare da qui.
  productionBrowserSourceMaps: false,
  images: {
    // unoptimized: evita di dover configurare un loader Cloudflare Images.
    // Compatibile sia con `next dev`/`next build` sia con l'adapter
    // @opennextjs/cloudflare (deploy su Cloudflare Workers).
    unoptimized: true,
  },
};

module.exports = nextConfig;
