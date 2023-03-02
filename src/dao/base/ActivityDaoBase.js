/* eslint-disable */
import { Activitylist } from '@/model/Activitylist'
import { Activity } from '@/model/Activity'

export class ActivityDaoBase {

  async getList(userId) {
    return new Activitylist(userId, {})
  }

  async createList(userId) {
    return new Activitylist(userId, {})
  }

  async updateList(activitylist) {
  }

  async getActivity(userId, dateNumber) {
    new Activity(dateNumber, {})
  }

  async addRecord(params, userId, dateNumber) {
    const item = new Activity(dateNumber, {})
    item.addRecord(params)
    return item
  }

}
