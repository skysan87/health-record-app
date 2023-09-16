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
pnpm install -D firebase-tools -F @health-record/web

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

## Setting for Firebase Hosting

<details>

```bash
skysan@skysan-mbp-2017 v2 % pnpm firebase init

     ######## #### ########  ######## ########     ###     ######  ########
     ##        ##  ##     ## ##       ##     ##  ##   ##  ##       ##
     ######    ##  ########  ######   ########  #########  ######  ######
     ##        ##  ##    ##  ##       ##     ## ##     ##       ## ##
     ##       #### ##     ## ######## ########  ##     ##  ######  ########

You're about to initialize a Firebase project in this directory:

  /Users/skysan/Documents/github/health-record-app/apps/v2

? Which Firebase features do you want to set up for this directory? Press Space to select features, then Enter to confirm your choices. Hosting: Configure files for Firebase Hosting and (optionally) set
 up GitHub Action deploys

=== Project Setup

First, let's associate this project directory with a Firebase project.
You can create multiple project aliases by running firebase use --add,
but for now we'll just set up a default project.

? Please select an option: Use an existing project
? Select a default Firebase project for this directory: ******
i  Using project ******

=== Hosting Setup

Your public directory is the folder (relative to your project directory) that
will contain Hosting assets to be uploaded with firebase deploy. If you
have a build process for your assets, use your build's output directory.

? What do you want to use as your public directory? public
? Configure as a single-page app (rewrite all urls to /index.html)? Yes
? Set up automatic builds and deploys with GitHub? No
✔  Wrote public/index.html

i  Writing configuration info to firebase.json...
i  Writing project information to .firebaserc...

```

</details>


### Deploy as preview

```bash
# nuxt generate for SPA
pnpm run release-build

pnpm firebase hosting:channel:deploy <preview_name>
```

## NOTE

* `#app`のエイリアスが解決されないため、`@nuxt/types`を導入し一時回避