# health-record-app

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```


## firebase hostingの設定

既存のプロジェクトに別のサイトを追加する方式を利用

* Webコンソールでサイトを作成する
* 認証が必要なサイトの場合、Authentication>Settings>承認済みドメインに追加

```bash
$ npx firebase init

? Which Firebase features do you want to set up for this directory? Press Space to select features,
then Enter to confirm your choices. Hosting: Configure files for Firebase Hosting and (optionally) s
et up GitHub Action deploys

=== Project Setup

First, let\'s associate this project directory with a Firebase project.
You can create multiple project aliases by running firebase use --add,
but for now we\'ll just set up a default project.

? Please select an option: Use an existing project
? Select a default Firebase project for this directory: ***

=== Hosting Setup

Your public directory is the folder (relative to your project directory) that
will contain Hosting assets to be uploaded with firebase deploy. If you
have a build process for your assets, use your build\'s output directory.

? What do you want to use as your public directory? dist
? Configure as a single-page app (rewrite all urls to /index.html)? Yes
? Set up automatic builds and deploys with GitHub? No
✔  Wrote dist/index.html

i  Writing configuration info to firebase.json...
i  Writing project information to .firebaserc...

✔  Firebase initialization complete!

$ npx firebase target:apply hosting default <作成したサイトのID>

Updated: default (作成したサイトのID)
```

* `firebase.json`に`target`を設定

* デプロイ

```bash
$ npx firebase deploy --only hosting:default
```


## データ構造(firestore)

* health
  * id = userId
  * latest: { weight: number, height: number }
  * goal: { weight: number, activity: number }
  * createdAt: Date
  * updatedAt: Date
  * コレクション(records)
    * id: ランダム生成
    * year: number
    * month: number
    * date: number
    * type: string
    * value: number
    * createdAt: Date
    * updatedAt: Date

* activity
  * id = userId
  * menu: [{ label: string, value: number, unit: string }]
  * createdAt: Date
  * updatedAt: Date
  * コレクション(records)
    * id = YYYYMMDD
    * total: number
    * records: [{ timestamp, name: string, value: number }]
    * createdAt: Date
    * updatedAt: Date
