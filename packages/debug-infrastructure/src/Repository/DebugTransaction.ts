import type { ITransaction, ITransactionScope } from "@health-record/core/repository"

class DebugTransactionScope implements ITransactionScope {
  value: Object = {}
}

export class DebugTransaction implements ITransaction {
  async run(callback: (scope: ITransactionScope) => Promise<void>): Promise<void> {
    await callback(new DebugTransactionScope())
  }
}