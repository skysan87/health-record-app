import { Health } from "../Domain/Model/Health";
import { User } from "../Domain/Model/User";
import { IHealthRepository } from "../Domain/Repository/IHealthRepository";
import { IHealthlistRepository } from "../Domain/Repository/IHealthlistRepository";
import { IUserRepository } from "../Domain/Repository/IUserRepository";
import { ITransaction } from "../Domain/Repository/ITransaction";
import { GoalWeightRange, HealthGoalType, HealthType } from "../Domain/ValueObject";
import { Healthlist } from "../Domain/Model/Healthlist";
import { HealthService } from "../Domain/Logic/HealthService";
import { dateFactory } from "../Util/DateUtil";

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
    return this.format(list)
  }

  public async addRecord(type: HealthType, value: number): Promise<Healthlist> {
    const result = await this.transaction.run(async scope => { // TODO: scope
      const user: User = await this.userRepo.get()
      const healthlist = await this.healthlistRepo.get(user.id)
      if (!healthlist) {
        throw new Error('health does not exist.')
      }
      healthlist.latest[type] = value
      const updateData = await this.healthlistRepo.update({ latest: healthlist.latest }, user.id)

      const date = dateFactory()
      const health = new Health(''
        , date.get('year'), date.get('month'), date.get('date')
        , type, value
      )
      await this.healthRepo.save(health, user.id)

      return updateData
    })
    return this.format(result as Healthlist)
  }

  public async updateGoal(type: HealthGoalType, value: number): Promise<Healthlist> {
    const user: User = await this.userRepo.get()
    const list = await this.healthlistRepo.get(user.id)
    if (!list) {
      throw new Error('health does not exist.')
    }
    list.goal[type] = value
    const updateData = await this.healthlistRepo.update({ goal: list.goal }, user.id)
    return this.format(updateData)
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
    return this.format(result as Healthlist)
  }

  public async getRecords(): Promise<Health[]> {
    // TODO: limit
    const user: User = await this.userRepo.get()
    return await this.healthRepo.get(user.id)
  }

  private format(value: Healthlist): Healthlist {
    const service = new HealthService(value)
    service.calcBMI()
    return service.data()
  }
}