import { Healthlist } from "../Model/Healthlist";
import { UserId } from "../ValueObject";
import { IRepositoryBase } from "./IRepositoryBase";

export interface IHealthlistRepository extends IRepositoryBase {
  get(userId: UserId): Promise<Healthlist>
  save(userId: UserId): Promise<Healthlist>
  update(params: {}, userId: UserId): Promise<Healthlist>
}