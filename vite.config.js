import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` is the GitHub Pages project sub-path in production
// (https://<user>.github.io/social-autowala-website.v2/), and root in dev so
// `npm run dev` stays at localhost:5173/. Asset <img src> references in JSX use
// import.meta.env.BASE_URL so they resolve correctly under this sub-path.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/social-autowala-website.v2/' : '/',
  plugins: [react()],
}))
