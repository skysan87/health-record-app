import { type ITransactionScope } from "@health-record/core/repository"
import { type UserId } from "@health-record/core/value-object"
import { InMemoryStorage } from "../Storage/InMemoryStorage"

export class InMemoryStorageScope implements ITransactionScope {

  constructor(private _userId: UserId) { }

  get userId(): UserId {
    return this._userId
  }

  public async get(table: string): Promise<Array<any>> {
    return InMemoryStorage.get(table)
  }

  public async create(table: string, data: any): Promise<void> {
    await InMemoryStorage.create(table, data)
  }

  public async update(table: string, data: any, id: any): Promise<void> {
    await InMemoryStorage.update(table, data, id)
  }

  public async delete(table: string, id: any): Promise<void> {
    await InMemoryStorage.delete(table, id)
  }

  public static clear(): void {
    // for unit-test
    InMemoryStorage.clear()
  }
}