import { Health } from "../Model/Health";
import { UserId } from "../ValueObject";
import { IRepositoryBase } from "./IRepositoryBase";

export interface IHealthRepository extends IRepositoryBase {
  get(userId: UserId): Promise<Health[]>
  save(params: Health, userId:UserId): Promise<Health>
}