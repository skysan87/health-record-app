/* eslint-disable */
import { Healthlist, GoalWeightRange } from '@/model/Healthlist'
import { Health } from '@/model/Health'
import { dateFactory } from '@/util/DateFactory'

export class HealthDaoBase {
  constructor() {
    this.memory = null
  }

  async getList(userId) {
    return this.memory
  }

  async createList(userId) {
    this.memory = new Healthlist(userId, {})
    return this.memory
  }

  async addAndUpdateLatest(params, userId) {
    this.memory.latest[params.type] = params.value
    return this.memory.latest
  }

  async updateGoal(goal, userId) {
    this.memory.goal = { ...goal }
  }

  async updateGoalWeightRange ({ start, end }, userId) {
    if (!Object.hasOwn(this.memory.goal, Healthlist.GOAL_WEIGHT) ||
        !Object.hasOwn(this.memory.latest, Health.TYPE_WEIGHT)) {
      throw new Error('goal.weight and latest.weight must be set.')
    }
    const data =  new GoalWeightRange({
      startDate: start,
      endDate: end,
      startWeight: this.memory.latest[Health.TYPE_WEIGHT] ?? 0,
      endWeight: this.memory.goal[Healthlist.GOAL_WEIGHT] ?? 0
    })
    this.memory.goalWeightRange = { ...data }
    return data
  }

  async getRecords (userId) {
    const dummyTotal = 70
    const result = []
    Array.from({ length: 100 }, (_, index) => index)
      .forEach(index => {
        result.push({
          x: dateFactory().subtract(index, 'day').toDate(),
          y: dummyTotal + Math.random() + index * 0.1
        })
      })
    return result.reverse()
  }
}
