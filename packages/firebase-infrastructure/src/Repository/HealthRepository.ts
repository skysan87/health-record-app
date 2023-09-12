import { CollectionReference, DocumentData, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { Health } from "@health-record/core/model";
import { IHealthRepository } from "@health-record/core/repository";
import { UserId } from "@health-record/core/value-object";
import { HealthEntity } from "../Entity/HealthEntity";
import { firestore } from "../AppSetting"
import { scope } from "./Transaction";

export class HealthRepository implements IHealthRepository {

  private getRef(userId: UserId): CollectionReference {
    return collection(firestore, 'health', userId, 'records')
  }

  public async get(userId: UserId): Promise<Health[]> {
    // NOTE: where句がある場合、indexが必要になるため全て取得する
    const q = query(this.getRef(userId)
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

  async save(params: Partial<Health>, userId: UserId): Promise<void> {
    const newData: HealthEntity = {
      year: params.year,
      month: params.month,
      date: params.date,
      type: params.type,
      value: params.value,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = doc(this.getRef(userId))
    if (scope.hasTransaction) {
      scope.value?.set(docRef, newData)
    } else {
      await setDoc(docRef, newData)
    }
  }

  private convert(id: string, data: DocumentData): Health {
    const health = { ...data, id } as Health
    // timestampをDateに変換
    health.createdAt = data.createdAt?.toDate() ?? null
    health.updatedAt = data.updatedAt?.toDate() ?? null
    return health
  }

}