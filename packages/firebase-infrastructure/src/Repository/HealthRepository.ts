import { CollectionReference, type DocumentData, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore"
import type { Health } from "@health-record/core/model"
import type { IHealthRepository } from "@health-record/core/repository"
import type { UserId } from "@health-record/core/value-object"
import type { HealthEntity } from "../Entity/HealthEntity"
import { firestore } from "../AppSetting"
import { FirestoreTransactoinScope as Scope } from "../Repository/Transaction"

export class HealthRepository implements IHealthRepository {

  private getRef(userId: UserId): CollectionReference {
    return collection(firestore, 'health', userId, 'records')
  }

  public async get(scope: Scope): Promise<Health[]> {
    // NOTE: where句がある場合、indexが必要になるため全て取得する
    const q = query(this.getRef(scope.userId)
      , orderBy('createdAt', 'desc')
      , limit(100)
    )

    const querySnapshot = await getDocs(q)
    const result: Health[] = []
    querySnapshot.docs.forEach(doc => {
      result.push(this.convert(doc.id, doc.data()))
    })

    return result.reverse()
  }

  async save(scope: Scope, params: Partial<Health>): Promise<void> {
    const docRef = doc(this.getRef(scope.userId))
    const newData: HealthEntity = {
      year: params.year,
      month: params.month,
      date: params.date,
      type: params.type,
      value: params.value
    }
    await scope.save(docRef, newData)
  }

  private convert(id: string, data: DocumentData): Health {
    const health = { ...data, id } as Health
    // timestampをDateに変換
    health.createdAt = data.createdAt?.toDate() ?? null
    health.updatedAt = data.updatedAt?.toDate() ?? null
    return health
  }

}