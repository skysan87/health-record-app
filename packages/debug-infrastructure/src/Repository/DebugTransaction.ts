import type { ITransaction, ITransactionScope, ILocalStore } from "@health-record/core/repository"
import type { UserId } from "@health-record/core/value-object"
import { InMemoryStorage } from "../Storage/InMemoryStorage"
import { InMemoryStorageScope } from "./InMemoryStorageScope"
import { SessionStorageScope } from "./SessionStorageScope"

export class SessionStorageTransaction implements ITransaction {

  constructor(private localStore?: ILocalStore) { }

  public async run(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    const scope = new SessionStorageScope(userId)
    await callback(scope)
    this.localStore?.sync(scope.results)
  }
}

export class InMemoryTransaction implements ITransaction {

  constructor(private localStore?: ILocalStore) { }

  public async run(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    const scope = new InMemoryStorageScope(userId)
    await callback(scope)
    this.localStore?.sync(scope.results)
  }

  public static reset() {
    // for unit-test
    InMemoryStorage.clear()
  }
}