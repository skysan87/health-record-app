import { Health } from "../Domain/Model/Health";
import { User } from "../Domain/Model/User";
import { IHealthRepository } from "../Domain/Repository/IHealthRepository";
import { IHealthlistRepository } from "../Domain/Repository/IHealthlistRepository";
import { IUserRepository } from "../Domain/Repository/IUserRepository";
import { ITransaction } from "../Domain/Repository/ITransaction";
import { GoalWeightRange, HealthGoalType, HealthType } from "../Domain/ValueObject";
import { Healthlist } from "../Domain/Model/Healthlist";
import { HealthService } from "../Domain/Logic/HealthService";

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

  public async addRecord(health: Health): Promise<Healthlist> {
    const result = await this.transaction.run(async scope => { // TODO: scope
      const user: User = await this.userRepo.get()
      const healthlist = await this.healthlistRepo.get(user.id)
      if (!healthlist) {
        throw new Error('health does not exist.')
      }
      const updateData = new HealthService(healthlist).updateLatest(health.type as HealthType, health.value ?? 0)
      await this.healthlistRepo.update({ latest: updateData.latest }, user.id)
      await this.healthRepo.save(health, user.id)
      return updateData
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

  public async updateGoalWeightRange(startDate: Date, endDate: Date): Promise<Healthlist> {
    const result = await this.transaction.run(async scope => { // TODO: scope
      const user: User = await this.userRepo.get()
      const healthlist = await this.healthlistRepo.get(user.id)
      if (!healthlist) {
        throw new Error('health does not exist.')
      }
      if (!Object.hasOwn(healthlist.goal, HealthGoalType.WEIGHT) ||
        !Object.hasOwn(healthlist.latest, HealthType.WEIGHT)) {
        throw new Error('goal.weight and latest.weight must be set.')
      }
      healthlist.goalWeightRange = new GoalWeightRange(
        healthlist.latest[HealthType.WEIGHT] ?? 0,
        healthlist.goal[HealthGoalType.WEIGHT] ?? 0,
        startDate,
        endDate
      )
      const updateData = await this.healthlistRepo.update({ goalWeightRange: healthlist.goalWeightRange }, user.id)
      return updateData
    })
    return result as Healthlist
  }

  public async getRecords(): Promise<Health[]> {
    // TODO: limit
    const user: User = await this.userRepo.get()
    return await this.healthRepo.get(user.id)
  }
}