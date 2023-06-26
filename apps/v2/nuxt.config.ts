// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  ssr: false,
  postcss: {
    plugins: {
      tailwindcss: {}
    }
  },
  modules: [
  ],
  dir: {
    layouts: "layouts",
    pages: "pages",
    assets: "assets",
    public: "public",
    static: "public",
    middleware: "middleware",
    modules: "modules",
    plugins: "plugins",
  },
  css: [
    '@/assets/css/tailwind.css',
    '@/assets/css/common.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  typescript: {
    strict: false
  }
})
