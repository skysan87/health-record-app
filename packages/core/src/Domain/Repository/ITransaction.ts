export interface ITransactionScope {
  value: any
}

export interface ITransaction {
  // NOTE: 実装でITransactionScopeを指定するオブジェクトのフラグ管理をする
  run<T>(callback: () => {}): Promise<T>
}