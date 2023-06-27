import { ITransaction, ITransactionScope } from "@health-record/core/repository";

class DebugTransactionScope implements ITransactionScope {
  value: Object = {}
}

export class DebugTransaction implements ITransaction {
  run(callback: (scope: ITransactionScope) => {}): Promise<Object> {
    return new Promise((resolve) => {
      const result = callback(new DebugTransactionScope())
      resolve(result)
    })
  }
}