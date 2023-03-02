/* eslint-disable */
import { Healthlist } from '@/model/Healthlist'
import { Health } from '@/model/Health'

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
}
