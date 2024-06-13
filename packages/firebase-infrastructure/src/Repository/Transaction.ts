import { firestore } from "../AppSetting"
import type { ILocalStore, ITransaction, ITransactionScope, Result } from "@health-record/core/repository"
import type { UserId } from "@health-record/core/value-object"
import { DocumentReference, DocumentSnapshot, Transaction, WriteBatch, deleteDoc, getDoc, runTransaction, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'

export class FirestoreTransactoinScope implements ITransactionScope {
  private _value: Transaction | null = null
  private _userId: UserId
  private records: Array<Result> = []

  constructor(userId: UserId) {
    this._userId = userId
  }

  get results(): Result[] {
    return structuredClone(this.records)
  }

  get userId(): UserId {
    return this._userId
  }

  public setTransaction(value: Transaction) {
    if (this._value !== null) {
      throw new Error('TransactionScope is locked.')
    }
    this._value = value
  }

  public releaseTransaction() {
    this._value = null
  }

  public async get(docRef: DocumentReference<any>): Promise<DocumentSnapshot> {
    if (this._value instanceof Transaction) {
      return this._value.get(docRef)
    } else {
      return getDoc(docRef)
    }
  }

  public async create(docRef: DocumentReference<any>, data: any) {
    data.createdAt = serverTimestamp()
    data.updatedAt = serverTimestamp()

    if (this._value instanceof Transaction) {
      this._value.set(docRef, data)
    } else {
      await setDoc(docRef, data)
    }

    this.records.push({
      command: "CREATE",
      table: this.getTableName(docRef),
      id: data.id,
      data: { ...data }
    } as Result)
  }

  public async update(docRef: DocumentReference<any>, data: any) {
    data.updatedAt = serverTimestamp()

    // 更新する項目のみ
    const updateProps: any = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined))

    if (this._value instanceof Transaction) {
      this._value.update(docRef, updateProps)
    } else {
      await updateDoc(docRef, updateProps)
    }

    this.records.push({
      command: "UPDATE",
      table: this.getTableName(docRef),
      id: data.id,
      data: { ...data }
    } as Result)
  }

  public async delete(docRef: DocumentReference<any>) {
    if (this._value instanceof Transaction) {
      this._value.delete(docRef)
    } else {
      await deleteDoc(docRef)
    }

    this.records.push({
      command: "DELETE",
      table: this.getTableName(docRef),
      id: docRef.id
    } as Result)
  }

  private getTableName(docRef: DocumentReference<any>): string {
    const path = docRef.path
    if (/^(health)\/([a-zA-Z0-9]+)$/.test(path)) {
      return 'healthlist'
    } else if (/^(health)\/([a-zA-Z0-9]+)(?:\/records\/([a-zA-Z0-9]+))?$/.test(path)) {
      return 'health'
    } else if (/^(activity)\/([a-zA-Z0-9]+)$/.test(path)) {
      return 'activitylist'
    } else if (/^(activity)\/([a-zA-Z0-9]+)(?:\/records\/([a-zA-Z0-9]+))?$/.test(path)) {
      return 'activity'
    } else {
      throw new Error('table does not exist')
    }
  }
}

export class FirestoreTransaction implements ITransaction {

  constructor(private localStore?: ILocalStore) { }

  public async run(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    await runTransaction(firestore, async transaction => {
      const scope = new FirestoreTransactoinScope(userId)
      try {
        scope.setTransaction(transaction)
        await callback(scope)
        this.localStore?.sync(scope.results)
      } catch (error) {
        // TODO: errorでrollbackするか確認
        throw error
      } finally {
        scope.releaseTransaction()
      }
    })
  }
}