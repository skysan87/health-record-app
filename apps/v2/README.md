# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Install

```bash
# at root directory
pnpm install -D tailwindcss postcss@latest -F @health-record/web
pnpm install @fortawesome/vue-fontawesome@latest-3 -F @health-record/web
pnpm install @fortawesome/fontawesome-svg-core -F @health-record/web
pnpm install @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons -F @health-record/web
pnpm install -D @nuxt/types -F @health-record/web
pnpm install v-calendar@next @popperjs/core -F @health-record/web
pnpm install -D @kevinmarrec/nuxt-pwa -F @health-record/web

# at this directory
pnpm tailwindcss init tailwind.config.js
```

## Type check

```bash
pnpm nuxi typecheck
```

## Clear Cache

```bash
pnpm nuxi cleanup
```

## Setup

Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`

```bash
pnpm run dev
```

## Production

Build the application for production:

```bash
pnpm run build
```

Locally preview production build:

```bash
pnpm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## NOTE

* `#app`のエイリアスが解決されないため、`@nuxt/types`を導入し一時回避