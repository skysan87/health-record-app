import type { Activity, Healthlist } from "@health-record/core/model"
import { HealthGoalType, HealthType } from "@health-record/core/value-object"
import { useActivity, useHealthlist } from "./states"

export const useCurrentStatus = () => {
  const activity: Ref<Activity> = useActivity()
  const healthlist: Ref<Healthlist> = useHealthlist()

  const _calorie = computed(() => {
    return activity.value?.total ?? 0
  })

  const _BMI = computed(() => {
    const weight = healthlist.value?.latest[HealthType.WEIGHT] // kg
    const height = healthlist.value?.latest[HealthType.HEIGHT] // cm
    if (!weight || !height) {
      return 0
    }
    return weight / Math.pow(height / 100, 2)
  })

  return {
    totalCalorie: computed(() => parseFloat(_calorie.value.toFixed(2))),
    isOutOfLineBMI: computed(() => _BMI.value <= 18.5 || _BMI.value >= 25.0),
    BMI: computed(() => _BMI.value.toFixed(2)),
    notAchievedGoal: computed(() => {
      const goal = healthlist.value?.goal[HealthGoalType.ACTIVITY] ?? 0
      return _calorie.value < goal
    })
  }
}