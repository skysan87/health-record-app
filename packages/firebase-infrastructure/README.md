## Install

```bash
# at root directory
pnpm install firebase -F @health-record/firebase-infrastructure
pnpm install -D firebase-tools -F @health-record/firebase-infrastructure
pnpm install -D ts-node -F @health-record/firebase-infrastructure
```

## firebase loacl emulator

```bash
# このディレクトリで実行する
$ pnpm firebase init

     ######## #### ########  ######## ########     ###     ######  ########
     ##        ##  ##     ## ##       ##     ##  ##   ##  ##       ##
     ######    ##  ########  ######   ########  #########  ######  ######
     ##        ##  ##    ##  ##       ##     ## ##     ##       ## ##
     ##       #### ##     ## ######## ########  ##     ##  ######  ########

You're about to initialize a Firebase project in this directory:

  ***/health-record-app/packages/firebase-infrastructure

? Which Firebase features do you want to set up for this directory? Press Space to select features, then Enter to confirm
your choices. Emulators: Set up local emulators for Firebase products

=== Project Setup

First, let's associate this project directory with a Firebase project.
You can create multiple project aliases by running firebase use --add,
but for now we'll just set up a default project.

? Please select an option: Use an existing project
? Select a default Firebase project for this directory: ***
i  Using project ***

=== Emulators Setup
? Which Firebase emulators do you want to set up? Press Space to select emulators, then Enter to confirm your choices.
Authentication Emulator, Firestore Emulator
? Which port do you want to use for the auth emulator? 9099
? Which port do you want to use for the firestore emulator? 8080
? Would you like to enable the Emulator UI? Yes
? Which port do you want to use for the Emulator UI (leave empty to use any available port)? 8081
? Would you like to download the emulators now? Yes
```

### エミュレータの起動

* コマンド: https://firebase.google.com/docs/emulator-suite/install_and_configure?hl=ja

```bash
$ pnpm firebase emulators:start --import=emulator_data --export-on-exit=emulator_data
```

## データ構造(firestore)

* health
  * id = userId
  * latest: { weight: number, height: number }
  * goal: { weight: number, activity: number }
  * goalWeightRange: { startWeight: number, endWeight: number, startDate: Date, endDate: Date }
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
