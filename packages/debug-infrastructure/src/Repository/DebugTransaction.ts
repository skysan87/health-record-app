import { ITransaction, ITransactionScope } from "@health-record/core/repository";

class DebugTransactionScope implements ITransactionScope {
  value: Object = {}
}

export class DebugTransaction implements ITransaction {
  async run<Object>(callback: (scope: ITransactionScope) => Promise<Object>): Promise<Object> {
    return await callback(new DebugTransactionScope())
  }
}