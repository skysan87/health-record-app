export interface ITransactionScope {
  value: Object
}

export interface ITransaction {
  // NOTE: 実装でITransactionScopeを指定するオブジェクトのフラグ管理をする
  run(callback: (scope: ITransactionScope) => {}): Promise<Object>
}