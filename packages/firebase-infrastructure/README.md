## Install

```bash
# at root directory
pnpm install firebase -F @health-record/firebase-infrastructure
pnpm install -D firebase-tools -F @health-record/firebase-infrastructure
pnpm install -D ts-node -F @health-record/firebase-infrastructure
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
