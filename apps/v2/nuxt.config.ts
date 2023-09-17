import packageInfo from './package.json'

// NOTE:
//  Nuxt3では、NODE_ENVは、productionとdevelopmentの2種類しか取れない
//  APP_MODEを定義し環境を分類する
console.log('ENV: ', process.env.APP_MODE)

/**
 * process.env.APP_MODEを参照
 */
const coreEnv = {
  'dev-inmemory': '@/plugins/core/debug-infrastructure',
  'dev-emulator': '@/plugins/core/firebase-local-infrastructure',
  'production': '@/plugins/core/firebase-prod-infrastructure'
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  ssr: false,
  // NOTE: .envで上書き可能
  runtimeConfig: {
    public: {
      appVersion: packageInfo.version,
      rootPath: '/'
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

  plugins: [
    // @ts-ignore
    { src: coreEnv[process.env.APP_MODE], mode: 'client' }
  ],

  postcss: {
    plugins: {
      tailwindcss: {}
    }
  },
  modules: [
    '@nuxtjs/device',
    '@kevinmarrec/nuxt-pwa'
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
    strict: true
  },
  pwa: {
    meta: {
      // iOSでスプラッシュ画面表示
      mobileAppIOS: true,
      nativeUI: true
    },
    manifest: {
      name: 'health-record-app',
      short_name: 'health-record',
      lang: 'ja',
      theme_color: 'indigo'
    },
    workbox: {
      // local実行時にinstallを有効にする場合: true
      // キャッシュが残るので注意
      enabled: false
    }
  }
})
