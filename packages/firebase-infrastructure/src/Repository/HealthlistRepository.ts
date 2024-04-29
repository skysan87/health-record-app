import { collection, doc, DocumentSnapshot, type DocumentData } from 'firebase/firestore'
import type { Healthlist } from "@health-record/core/model"
import type { IHealthlistRepository } from "@health-record/core/repository"
import type { UserId } from "@health-record/core/value-object"
import type { HealthlistEntity } from "../Entity/HealthlistEntity"
import { firestore } from "../AppSetting"
import { FirestoreTransactoinScope as Scope } from "../Repository/Transaction"

export class HealthlistRepository implements IHealthlistRepository {

  rootRef = collection(firestore, 'health')

  public async get(scope: Scope): Promise<Healthlist | null> {
    const docRef = doc(this.rootRef, scope.userId)
    let snapshot: DocumentSnapshot = await scope.get(docRef)

    if (!snapshot.exists()) {
      return null
    }

    return this.convert(scope.userId, snapshot.data())
  }

  public async save(scope: Scope, data: Partial<Healthlist>): Promise<void> {
    const docRef = doc(this.rootRef, scope.userId)
    const newData: HealthlistEntity = {
      latest: data.latest,
      goal: data.goal,
      goalWeightRange: data.goalWeightRange
    }
    await scope.save(docRef, newData)
  }

  public async update(scope: Scope, params: Partial<Healthlist>): Promise<void> {
    const docRef = doc(this.rootRef, scope.userId)
    const newData: HealthlistEntity = {
      latest: params.latest ?? undefined,
      goal: params.goal ?? undefined,
      goalWeightRange: params.goalWeightRange ?? undefined
    }
    await scope.update(docRef, newData)
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