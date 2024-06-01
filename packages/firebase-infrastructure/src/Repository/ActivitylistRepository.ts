import { type DocumentData, DocumentSnapshot, collection, doc } from "firebase/firestore"
import type { Activitylist } from "@health-record/core/model"
import type { IActivitylistRepository } from "@health-record/core/repository"
import type { UserId } from "@health-record/core/value-object"
import type { ActivitylistEntity } from "../Entity/ActivitylistEntity"
import { firestore } from "../AppSetting"
import { FirestoreTransactoinScope as Scope } from "../Repository/Transaction"

export class ActivitylistRepository implements IActivitylistRepository {

  rootRef = collection(firestore, 'activity')

  public async get(scope: Scope): Promise<Activitylist | null> {
    const docRef = doc(this.rootRef, scope.userId)
    const snapshot: DocumentSnapshot = await scope.get(docRef)

    if (!snapshot.exists()) {
      return null
    }

    return this.convert(scope.userId, snapshot.data())
  }

  public async save(scope: Scope, data: Partial<Activitylist>): Promise<void> {
    const docRef = doc(this.rootRef, scope.userId)
    const newData: ActivitylistEntity = {
      menu: data.menu,
    }
    await scope.create(docRef, newData)
  }

  public async update(scope: Scope, param: Partial<Activitylist>): Promise<void> {
    const docRef = doc(this.rootRef, scope.userId)
    const newData: ActivitylistEntity = {
      menu: param.menu ?? undefined,
    }
    await scope.update(docRef, newData)
  }

  private convert(userId: UserId, data: DocumentData): Activitylist {
    const activitylist = { ...data, id: userId } as Activitylist
    // timestampをDateに変換
    activitylist.createdAt = data.createdAt?.toDate() ?? null
    activitylist.updatedAt = data.updatedAt?.toDate() ?? null
    return activitylist
  }
}