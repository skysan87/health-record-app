export class Healthlist {
  static GOAL_WEIGHT = 'weight'
  static GOAL_ACTIVITY = 'activity'

  constructor (id, params) {
    this.id = id
    this.latest = params.latest ?? {}
    this.goal = params.goal ?? {}
    this.createdAt = params.createdAt ?? null
    this.updatedAt = params.updatedAt ?? null
  }

  getData () {
    return {
      latest: this.latest,
      goal: this.goal,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
