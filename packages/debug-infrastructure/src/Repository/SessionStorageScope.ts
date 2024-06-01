import { type ITransactionScope } from "@health-record/core/repository"
import { type UserId } from "@health-record/core/value-object"
import { SessionStorage } from "../Storage/SessionStorage"

export class SessionStorageScope implements ITransactionScope {

  constructor(private _userId: UserId) { }

  get userId(): UserId {
    return this._userId
  }

  public async get(table: string): Promise<Array<any>> {
    return SessionStorage.get(table)
  }

  public async create(table: string, data: any): Promise<void> {
    await SessionStorage.create(table, data)
  }

  public async update(table: string, data: any, id: any): Promise<void> {
    await SessionStorage.update(table, data, id)
  }

  public async delete(table: string, id: any): Promise<void> {
    await SessionStorage.delete(table, id)
  }
}