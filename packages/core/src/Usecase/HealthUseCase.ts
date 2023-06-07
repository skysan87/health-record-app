import { Health } from "@/Domain/Model/Health";
import { User } from "@/Domain/Model/User";
import { IHealthRepository } from "@/Domain/Repository/IHealthRepository";
import { IHealthlistRepository } from "@/Domain/Repository/IHealthlistRepository";
import { IUserRepository } from "@/Domain/Repository/IUserRepository";
import { ITransaction } from "@/Domain/Repository/ITransaction";
import { HealthGoalType, HealthType } from "@/Domain/ValueObject";
import { Healthlist } from "@/Domain/Model/Healthlist";

// NOTE: 小規模なソースコードなので、ドメイン知識単位にUseCaseをまとめる
export class HealthUseCase {

  constructor(
    private readonly healthRepo: IHealthRepository,
    private readonly healthlistRepo: IHealthlistRepository,
    private readonly userRepo: IUserRepository,
    private readonly transaction: ITransaction
  ) { }

  public async init(): Promise<Healthlist> {
    const user: User = await this.userRepo.get()
    let list = await this.healthlistRepo.get(user.id)
    if (!list) {
      list = await this.healthlistRepo.save(user.id)
    }
    return list
  }

  public async addRecord(helath: Health): Promise<Healthlist> {
    const result = await this.transaction.run(async scope => { // TODO: scope
      const user: User = await this.userRepo.get()
      const healthlist = await this.healthlistRepo.get(user.id)
      if (!healthlist) {
        throw new Error('health does not exist.')
      }
      healthlist.latest[helath.type as HealthType] = helath.value
      await this.healthlistRepo.update({ latest: healthlist.latest }, user.id)
      await this.healthRepo.save(helath, user.id)
    })
    return result as Healthlist
  }

  public async updateGoal(type: HealthGoalType, value: number): Promise<Healthlist> {
    const user: User = await this.userRepo.get()
    const list = await this.healthlistRepo.get(user.id)
    if (!list) {
      throw new Error('health does not exist.')
    }
    list.goal[type] = value
    await this.healthlistRepo.update({ goal: list.goal }, user.id)
    return list
  }

  public async getRecords(): Promise<Health[]> {
    // TODO: limit
    const user: User = await this.userRepo.get()
    return await this.healthRepo.get(user.id)
  }
}