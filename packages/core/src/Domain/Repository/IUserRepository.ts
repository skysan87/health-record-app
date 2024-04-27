import type { User } from "../Model/User"
import type { IRepositoryBase } from "./IRepositoryBase"

export interface IUserRepository extends IRepositoryBase {
  authenticated(): Promise<boolean>
  get(): Promise<User>
  login(): Promise<User>
  logout(): Promise<void>
}