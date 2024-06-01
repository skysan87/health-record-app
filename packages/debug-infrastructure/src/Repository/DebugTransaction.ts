import type { ITransaction, ITransactionScope } from "@health-record/core/repository"
import type { UserId } from "@health-record/core/value-object"
import { InMemoryStorage } from "../Storage/InMemoryStorage"
import { InMemoryStorageScope } from "./InMemoryStorageScope"
import { SessionStorageScope } from "./SessionStorageScope"

export class SessionStorageTransaction implements ITransaction {
  public async run(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    const scope = new SessionStorageScope(userId)
    await callback(scope)
  }
}

export class InMemoryTransaction implements ITransaction {
  public async run(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    await callback(new InMemoryStorageScope(userId))
  }

  public static reset() {
    // for unit-test
    InMemoryStorage.clear()
  }
}