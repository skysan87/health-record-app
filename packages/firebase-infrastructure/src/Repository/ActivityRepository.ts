import {
  CollectionReference, type DocumentData, DocumentSnapshot, arrayUnion, collection, doc
  , query, limit, getDocs, orderBy
} from "firebase/firestore"
import type { Activity } from "@health-record/core/model"
import type { IActivityRepository } from "@health-record/core/repository"
import type { UserId, DateNumber, Record } from "@health-record/core/value-object"
import type { ActivityEntity } from "../Entity/ActivityEntity"
import { firestore } from "../AppSetting"
import { FirestoreTransactoinScope as Scope } from "../Repository/Transaction"

export class ActivityRepository implements IActivityRepository {

  private getRef(userId: UserId): CollectionReference {
    return collection(firestore, 'activity', userId, 'records')
  }

  public async get(scope: Scope, dateNumber: DateNumber): Promise<Activity | null> {
    const docRef = doc(this.getRef(scope.userId), dateNumber)
    const snapshot: DocumentSnapshot = await scope.get(docRef)

    if (!snapshot.exists()) {
      return null
    }

    return this.convert(dateNumber, snapshot.data())
  }

  public async getList(scope: Scope): Promise<Activity[]> {
    // Tips: documentIdで降順ソートはできない
    const q = query(this.getRef(scope.userId)
      , orderBy('createdAt', 'desc')
      , limit(366) // 過去1年分取得(うるう年対応)
    )

    const querySnapshot = await getDocs(q)
    const result: Activity[] = []
    querySnapshot.docs.forEach(doc => {
      result.push(this.convert(doc.id as DateNumber, doc.data()))
    })
    return result
  }

  public async save(scope: Scope, dateNumber: DateNumber, data: Partial<Activity>): Promise<void> {
    const docRef = doc(this.getRef(scope.userId), dateNumber)
    const newData: ActivityEntity = {
      total: data.total,
      records: data.records,
    }
    await scope.create(docRef, newData)
  }

  public async update(scope: Scope, params: Partial<Activity>, dateNumber: DateNumber): Promise<void> {
    const docRef = doc(this.getRef(scope.userId), dateNumber)

    const newData: ActivityEntity = {
      total: params.total ?? undefined,
      records: params.records ?? undefined
    }
    await scope.update(docRef, newData)
  }

  public async addRecord(scope: Scope, params: Partial<Activity>, record: Record, dateNumber: DateNumber): Promise<void> {
    const docRef = doc(this.getRef(scope.userId), dateNumber)
    const updateData: ActivityEntity = {
      total: params.total,
      records: arrayUnion(record)
    }
    await scope.update(docRef, updateData)
  }

  private convert(dateNumber: DateNumber, data: DocumentData): Activity {
    const activity = { ...data, id: dateNumber } as Activity
    // timestampをDateに変換
    if (data.records?.length > 0) {
      activity.records = data.records.map((record: any) => {
        return {
          name: record.name,
          timestamp: record.timestamp?.toDate(),
          value: record.value
        } as Record
      })
    }
    activity.createdAt = data.createdAt?.toDate() ?? null
    activity.updatedAt = data.updatedAt?.toDate() ?? null
    return activity
  }
}