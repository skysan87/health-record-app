import {
  CollectionReference, DocumentData, DocumentSnapshot, arrayUnion, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc
  , query, limit, getDocs, orderBy
} from "firebase/firestore"
import { Activity } from "@health-record/core/model"
import { IActivityRepository } from "@health-record/core/repository"
import { UserId, DateNumber, Record } from "@health-record/core/value-object"
import { ActivityEntity } from "../Entity/ActivityEntity"
import { firestore } from "../AppSetting"
import { scope } from "./Transaction"

export class ActivityRepository implements IActivityRepository {

  private getRef(userId: UserId): CollectionReference {
    return collection(firestore, 'activity', userId, 'records')
  }

  public async get(userId: UserId, dateNumber: DateNumber): Promise<Activity | null> {
    const docRef = doc(this.getRef(userId), dateNumber)
    let activityDoc: DocumentSnapshot

    if (scope.hasTransaction) {
      activityDoc = await scope.value!.get(docRef)
    } else {
      activityDoc = await getDoc(docRef)
    }

    if (!activityDoc.exists()) {
      return null
    }

    return this.convert(dateNumber, activityDoc.data())
  }

  public async getList(userId: UserId): Promise<Activity[]> {
    // Tips: documentIdで降順ソートはできない
    const q = query(this.getRef(userId)
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

  public async save(userId: UserId, dateNumber: DateNumber, data: Partial<Activity>): Promise<void> {
    const docRef = doc(this.getRef(userId), dateNumber)

    const newData: ActivityEntity = {
      total: data.total,
      records: data.records,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    if (scope.hasTransaction) {
      // NOTE: promiseはない
      scope.value?.set(docRef, newData)
    } else {
      await setDoc(docRef, newData)
    }
  }

  public async update(params: Partial<Activity>, userId: UserId, dateNumber: DateNumber): Promise<void> {
    const docRef = doc(this.getRef(userId), dateNumber)

    const newData: ActivityEntity = {
      total: params.total ?? undefined,
      records: params.records ?? undefined,
      updatedAt: serverTimestamp()
    }

    const updateParams = Object.fromEntries(Object.entries(newData).filter(([, v]) => v !== undefined))

    if (scope.hasTransaction) {
      // NOTE: promiseはない
      scope.value?.update(docRef, updateParams)
    } else {
      await updateDoc(docRef, updateParams)
    }
  }

  public async addRecord(params: Partial<Activity>, record: Record, userId: UserId, dateNumber: DateNumber): Promise<void> {
    const docRef = doc(this.getRef(userId), dateNumber)

    const updateData: ActivityEntity = {
      total: params.total,
      records: arrayUnion(record),
      updatedAt: serverTimestamp()
    }

    if (scope.hasTransaction) {
      // NOTE: promiseはない
      scope.value?.update(docRef, updateData)
    } else {
      await updateDoc(docRef, updateData)
    }
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