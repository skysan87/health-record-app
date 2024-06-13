import type { Result, ITransactionScope } from "@health-record/core/repository"
import { type UserId } from "@health-record/core/value-object"
import { InMemoryStorage } from "../Storage/InMemoryStorage"

export class InMemoryStorageScope implements ITransactionScope {

  private records: Array<Result> = []

  constructor(private _userId: UserId) { }

  get results(): Result[] {
    return structuredClone(this.records)
  }

  get userId(): UserId {
    return this._userId
  }

  public async get(table: string): Promise<Array<any>> {
    return InMemoryStorage.get(table)
  }

  public async create(table: string, data: any): Promise<void> {
    await InMemoryStorage.create(table, data)

    this.records.push({
      command: "CREATE",
      table: table,
      id: data.id,
      data: { ...data }
    } as Result)
  }

  public async update(table: string, data: any, id: any): Promise<void> {
    await InMemoryStorage.update(table, data, id)

    this.records.push({
      command: "UPDATE",
      table: table,
      id: data.id,
      data: { ...data }
    } as Result)
  }

  public async delete(table: string, id: any): Promise<void> {
    await InMemoryStorage.delete(table, id)

    this.records.push({
      command: "DELETE",
      table: table,
      id: id
    } as Result)
  }

  public static clear(): void {
    // for unit-test
    InMemoryStorage.clear()
  }
}