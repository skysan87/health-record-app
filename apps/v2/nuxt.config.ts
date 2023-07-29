import packageInfo from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  ssr: false,
  // NOTE: .envで上書き可能
  runtimeConfig:{
    public: {
      appVersion: packageInfo.version,
      rootPath: 'healthcare'
    }
  },
  app: {
    head: {
      title: 'health-record-app',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'robots', name: 'robots', content: 'noindex' }
      ],
      link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },

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
    '@/assets/css/dialog.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  typescript: {
    strict: false
  }
})
