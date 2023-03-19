/* eslint-disable */
import { Healthlist } from '@/model/Healthlist'
import { Health } from '@/model/Health'
import { dateFactory } from '@/util/DateFactory'

export class HealthDaoBase {

  async getList(userId) {
    return new Healthlist(userId, {})
  }

  async createList(userId) {
    return new Healthlist(userId, {})
  }

  async addAndUpdateLatest(params, userId) {
    const list = new Healthlist(userId, {})
    list.latest[params.type] = params.value
    return list.latest
  }

  async updateGoal(goal, userId) {}

  async getRecords (userId) {
    const dummyTotal = 70
    const result = {}
    Array.from({ length: 100 }, (_, index) => index)
      .forEach(index => {
        result[dateFactory().subtract(index, 'day').toDate()] = dummyTotal + index * 0.1
      })
    return result
  }
}
