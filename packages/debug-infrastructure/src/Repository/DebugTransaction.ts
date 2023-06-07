import { ITransaction, ITransactionScope } from "@health-record/core/repository";

export class DebugTransaction implements ITransaction {
  run(callback: (scope: ITransactionScope) => void): Promise<Object> {
    return Promise.resolve(callback)
  }
}