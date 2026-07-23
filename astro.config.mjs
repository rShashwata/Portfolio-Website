// @ts-check
import { defineConfig } from 'astro/config';

// One-page portfolio. All motion is client-side (GSAP + Lenis),
// so there's no integration needed here yet — kept minimal on purpose.
export default defineConfig({
  // Deployed origin — used for canonical/OG meta.
  site: 'https://www.shashwataroy.com',
});
