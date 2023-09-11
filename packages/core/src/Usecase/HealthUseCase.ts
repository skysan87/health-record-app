import { Health } from "../Domain/Model/Health";
import { User } from "../Domain/Model/User";
import { IHealthRepository } from "../Domain/Repository/IHealthRepository";
import { IHealthlistRepository } from "../Domain/Repository/IHealthlistRepository";
import { IUserRepository } from "../Domain/Repository/IUserRepository";
import { ITransaction } from "../Domain/Repository/ITransaction";
import { HealthGoalType, HealthType } from "../Domain/ValueObject";
import { Healthlist } from "../Domain/Model/Healthlist";
import { HealthlistBehavior } from "../Domain/Behavior/HealthlistBehavior";
import { HealthBehavior } from "../Domain/Behavior/HealthBehavior";
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

    let list: Healthlist | null = await this.healthlistRepo.get(user.id)
    if (!list) {
      list = new HealthlistBehavior({ id: user.id } as Healthlist).format()
      await this.healthlistRepo.save(user.id, list)
    }
    return new HealthlistBehavior(list).format()
  }

  public async addRecord(type: HealthType, value: number): Promise<Healthlist> {
    // 通信時間を考慮
    const date = dateFactory()

    return await this.transaction.run<Healthlist>(async () => {
      const user: User = await this.userRepo.get()
      const list = await this.healthlistRepo.get(user.id)
      if (!list) {
        throw new Error('health does not exist.')
      }
      return await new HealthlistBehavior(list).actionAsync(async behavior => {
        const latest = behavior.get('latest') ?? {}
        latest[type] = value
        await this.healthlistRepo.update({ latest }, user.id)
        behavior.update({ latest } as Healthlist)

        const healthBehavior = new HealthBehavior({
          year: date.get('year'),
          month: date.get('month'),
          date: date.get('date'),
          type,
          value
        } as Health)
        await this.healthRepo.save(healthBehavior.format(), user.id)
      })
    })
  }

  public async updateGoal(type: HealthGoalType, value: number): Promise<Healthlist> {
    const user: User = await this.userRepo.get()
    const list = await this.healthlistRepo.get(user.id)
    if (!list) {
      throw new Error('health does not exist.')
    }

    return await new HealthlistBehavior(list).actionAsync(async behavior => {
      const goal = behavior.get('goal') ?? {}
      goal[type] = value
      await this.healthlistRepo.update({ goal }, user.id)
      behavior.update({ goal } as Healthlist)
    })
  }

  public async updateGoalWeightRange(startDate: Date, endDate: Date): Promise<Healthlist> {
    return await this.transaction.run<Healthlist>(async () => {
      const user: User = await this.userRepo.get()
      const list = await this.healthlistRepo.get(user.id)
      if (!list) {
        throw new Error('health does not exist.')
      }

      return await new HealthlistBehavior(list).actionAsync(async behavior => {
        if (!behavior.validateGoalWeightRange()) {
          throw new Error('goal.weight and latest.weight must be set.')
        }
        behavior.setGoalWeightRange(startDate, endDate)
        await this.healthlistRepo.update({ goalWeightRange: behavior.get("goalWeightRange") }, user.id)
      })
    })
  }

  public async getRecords(): Promise<Health[]> {
    // TODO: limit
    const user: User = await this.userRepo.get()
    return await this.healthRepo.get(user.id)
  }
}