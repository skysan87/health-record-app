import { User } from "../Model/User";
import { IRepositoryBase } from "./IRepositoryBase";

export interface IUserRepository extends IRepositoryBase {
  get(): Promise<User>
}