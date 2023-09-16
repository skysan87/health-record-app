import { DocumentData, DocumentSnapshot, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import { Activitylist } from "@health-record/core/model"
import { IActivitylistRepository } from "@health-record/core/repository"
import { UserId } from "@health-record/core/value-object"
import { ActivitylistEntity } from "../Entity/ActivitylistEntity"
import { firestore } from "../AppSetting"
import { scope } from "./Transaction"

export class ActivitylistRepository implements IActivitylistRepository {

  rootRef = collection(firestore, 'activity')

  public async get(userId: UserId): Promise<Activitylist | null> {
    const docRef = doc(this.rootRef, userId)
    let activityDoc: DocumentSnapshot

    if (scope.hasTransaction) {
      activityDoc = await scope.value!.get(docRef)
    } else {
      activityDoc = await getDoc(docRef)
    }

    if (!activityDoc.exists()) {
      return null
    }

    return this.convert(userId, activityDoc.data())
  }

  public async save(userId: UserId, data: Partial<Activitylist>): Promise<void> {
    const docRef = doc(this.rootRef, userId)
    const newData: ActivitylistEntity = {
      menu: data.menu,
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

  public async update(param: Partial<Activitylist>, userId: UserId): Promise<void> {
    const docRef = doc(this.rootRef, userId)
    const newData: ActivitylistEntity = {
      menu: param.menu ?? undefined,
      createdAt: serverTimestamp(),
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

  private convert(userId: UserId, data: DocumentData): Activitylist {
    const activitylist = { ...data, id: userId } as Activitylist
    // timestampをDateに変換
    activitylist.createdAt = data.createdAt?.toDate() ?? null
    activitylist.updatedAt = data.updatedAt?.toDate() ?? null
    return activitylist
  }
}