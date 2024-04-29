import type { ITransactionScope } from "@health-record/core/repository"
import type { UserId } from "@health-record/core/value-object"

export abstract class AbstractStorage implements ITransactionScope {
  constructor(private _userId: UserId) { }

  public get userId(): UserId {
    return this._userId
  }

  abstract get(key: string): any

  abstract save(key: string, data: any): void

  abstract delete(key: string): void
}