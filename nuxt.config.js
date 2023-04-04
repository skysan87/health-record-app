import packageInfo from './package.json'

export default {
  ssr: false,
  srcDir: 'src',
  target: 'static',

  env: {
    app_version: packageInfo.version,
    ROOT_PATH: '/healthcare'
  },

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
  },

  loading: { color: '#fff' },

  css: [
    '@/assets/css/tailwind.css',
    '@/assets/css/common.css'
  ],

  plugins: [
    { src: '@/plugins/fontawesome', ssr: false },
    { src: '@/plugins/v-calendar', ssr: false }
  ],

  buildModules: [
    // '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/device'
  ],
  modules: [
    ['@nuxtjs/dotenv',
      {
        filename: process.env.NODE_ENV === 'production'
          ? './config/.env.production'
          : './config/.env.develop'
      }
    ],
    '@nuxtjs/pwa',
    '@nuxtjs/toast'
    // '@nuxtjs/style-resources'
  ],

  router: {
    // middleware: 全てのページで有効になる
    middleware: ['authentication']
  },

  pwa: {
    manifest: {
      lang: 'ja',
      theme_color: 'indigo'
    }
  },

  build: {
    analyze: false
  },

  toast: {
    position: 'top-right',
    duration: 3000
  }
}
