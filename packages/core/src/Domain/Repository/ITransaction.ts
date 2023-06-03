export interface ITransactionScope {
  value: Object
}

export interface ITransaction {
  run(callback: (scope: ITransactionScope) => void): Promise<Object>
}