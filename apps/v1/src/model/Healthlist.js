export class Healthlist {
  static GOAL_WEIGHT = 'weight'
  static GOAL_ACTIVITY = 'activity'

  constructor (id, params) {
    this.id = id
    this.latest = params.latest ?? {}
    this.goal = params.goal ?? {}
    this.goalWeightRange = new GoalWeightRange(params.goalWeightRange ?? {})
    this.createdAt = params.createdAt ?? null
    this.updatedAt = params.updatedAt ?? null
  }

  getData () {
    return {
      latest: this.latest,
      goal: this.goal,
      goalWeightRange: this.goalWeightRange,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}

/**
 * { startWeight: number, endWeight: number, startDate: Date, endDate: Date }
 */
export class GoalWeightRange {
  constructor (params) {
    this.startWeight = params.startWeight ?? 0
    this.endWeight = params.endWeight ?? 0
    this.startDate = params.startDate ?? null
    this.endDate = params.endDate ?? null
  }
}
