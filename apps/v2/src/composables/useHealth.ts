import { Health, Healthlist } from "@health-record/core/model"
import type { HealthUseCase } from "@health-record/core/usecase"
import { dateFactory } from "@health-record/core/util/DateUtil"
import { HealthGoalType, HealthType } from "@health-record/core/value-object"

export const useHealth = () => {
  const { $health } = useNuxtApp()
  const usecase: HealthUseCase = $health()
  const healthlist = ref<Healthlist | null>(null)
  const BMI = ref<string>('')
  const isOutOfLineBMI = ref<boolean>(false)
  const notAchievedGoal = ref<boolean>(true)
  // TODO: ここで参照しない
  const { totalCalorie } = useActivity()

  const calcBMI = () => {
    // TODO: ロジックを別の場所に移動
    const weight = healthlist.value?.latest[HealthType.WEIGHT] // kg
    const height = healthlist.value?.latest[HealthType.HEIGHT] // cm
    if (!weight || !height) {
      return 0
    }
    return weight / Math.pow(height / 100, 2)
  }
  const _isOutOfLineBMI = (bmi) => bmi<= 18.5 || bmi >= 25.0

  watchEffect(() => {
    const bmiValue = calcBMI()
    BMI.value = bmiValue.toFixed(2)
    isOutOfLineBMI.value = _isOutOfLineBMI(bmiValue)
  })

  // FIXME: watchEffectを使用しない
  watchEffect(() => {
    const latest = totalCalorie.value ?? 0
    const goal = healthlist.value?.goal[HealthGoalType.ACTIVITY] ?? 0
    notAchievedGoal.value = latest < goal
  })

  return {
    latestData: computed(() => healthlist.value?.latest),
    BMI,
    isOutOfLineBMI,
    notAchievedGoal,
    goal: computed(() => healthlist.value.goal),
    initHealth: async() => { //TODO: useAsyncData
      healthlist.value = await usecase.init()
    },
    recordWeight: async (inputValue: number) => {
      if (!inputValue) {
        return true
      }
      const date = dateFactory()
      const health = new Health(''
        , date.get('year'), date.get('month'), date.get('date')
        , HealthType.WEIGHT, inputValue
      )
      const list: Healthlist = await usecase.addRecord(health)
      healthlist.value = list
      // TODO: エラーハンドリング
      return true
    },
    recordHeight: async (inputValue: number) => {
      if (!inputValue) {
        return true
      }
      const date = dateFactory()
      const health = new Health(''
        , date.get('year'), date.get('month'), date.get('date')
        , HealthType.HEIGHT, inputValue
      )
      const list: Healthlist = await usecase.addRecord(health)
      healthlist.value = list
      // TODO: エラーハンドリング
      return true
    },
    setGoalActivity: async (inputValue:number) => {
      if (!inputValue) {
        return true
      }
      const list: Healthlist = await usecase.updateGoal(HealthGoalType.ACTIVITY, inputValue)
      healthlist.value = list
      // TODO: エラーハンドリング
      return true
    },
    setGoalWeight: async (inputValue:number) => {
      if (!inputValue) {
        return true
      }
      const list: Healthlist = await usecase.updateGoal(HealthGoalType.WEIGHT, inputValue)
      healthlist.value = list
      // TODO: エラーハンドリング
      return true
    }
  }
}