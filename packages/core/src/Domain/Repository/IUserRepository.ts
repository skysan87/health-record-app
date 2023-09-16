import { User } from "../Model/User";
import { IRepositoryBase } from "./IRepositoryBase";

export interface IUserRepository extends IRepositoryBase {
  authenticated(): Promise<boolean>
  get(): Promise<User>
  login(): Promise<User>
  logout(): Promise<void>
}