import { collection, getDoc, setDoc, updateDoc, doc, serverTimestamp, DocumentSnapshot, DocumentData } from 'firebase/firestore'
import type { Healthlist } from "@health-record/core/model"
import { IHealthlistRepository } from "@health-record/core/repository"
import { UserId } from "@health-record/core/value-object"
import { HealthlistEntity } from "../Entity/HealthlistEntity"
import { firestore } from "../AppSetting"
import { scope } from "./Transaction"

export class HealthlistRepository implements IHealthlistRepository {

  rootRef = collection(firestore, 'health')

  public async get(userId: UserId): Promise<Healthlist | null> {
    const docRef = doc(this.rootRef, userId)
    let healthDoc: DocumentSnapshot

    if (scope.hasTransaction) {
      healthDoc = await scope.value!.get(docRef)
    } else {
      healthDoc = await getDoc(docRef)
    }

    if (!healthDoc.exists()) {
      return null
    }

    return this.convert(userId, healthDoc.data())
  }

  public async save(userId: UserId, data: Partial<Healthlist>): Promise<void> {
    const docRef = doc(this.rootRef, userId)
    const newData: HealthlistEntity = {
      latest: data.latest,
      goal: data.goal,
      goalWeightRange: data.goalWeightRange,
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

  public async update(params: Partial<Healthlist>, userId: UserId): Promise<void> {
    const docRef = doc(this.rootRef, userId)
    const newData: HealthlistEntity = {
      latest: params.latest ?? undefined,
      goal: params.goal ?? undefined,
      goalWeightRange: params.goalWeightRange ?? undefined,
      updatedAt: serverTimestamp()
    }

    // undefinedな項目を削除し、更新したい項目のみ取得
    const updateParams = Object.fromEntries(Object.entries(newData).filter(([, v]) => v !== undefined))

    if (scope.hasTransaction) {
      // NOTE: promiseはない
      scope.value?.update(docRef, updateParams)
    } else {
      await updateDoc(docRef, updateParams)
    }
  }

  private convert(userId: UserId, data: DocumentData): Healthlist {
    const healthlist = { ...data, id: userId } as Healthlist
    // timestampをDateに変換
    healthlist.createdAt = data.createdAt?.toDate() ?? null
    healthlist.updatedAt = data.updatedAt?.toDate() ?? null
    // NOTE: Date型はtimestampに変換されている
    healthlist.goalWeightRange.startDate = data.goalWeightRange?.startDate?.toDate() ?? null
    healthlist.goalWeightRange.endDate = data.goalWeightRange?.endDate?.toDate() ?? null
    return healthlist
  }
}