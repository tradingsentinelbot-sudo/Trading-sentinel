/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // unoptimized: evita di dover configurare un loader Cloudflare Images.
    // Compatibile sia con `next dev`/`next build` sia con l'adapter
    // @opennextjs/cloudflare (deploy su Cloudflare Workers).
    unoptimized: true,
  },
};

module.exports = nextConfig;
