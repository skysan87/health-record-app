import { Health, Healthlist } from "@health-record/core/model"
import type { HealthUseCase } from "@health-record/core/usecase"
import { dateFactory } from "@health-record/core/util/DateUtil"
import { HealthGoalType, HealthType } from "@health-record/core/value-object"

export type HealthStore = ReturnType<typeof useHealthStore>

export const useHealthStore = () => {
  const { $health } = useNuxtApp()
  const usecase: HealthUseCase = $health()
  const healthlist = ref<Healthlist>(null)

  return {
    healthlist: readonly(healthlist),
    latestData: computed(() => healthlist.value?.latest),
    goal: computed(() => healthlist.value?.goal),
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
      healthlist.value = await usecase.addRecord(health)
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
      healthlist.value = await usecase.addRecord(health)
      // TODO: エラーハンドリング
      return true
    },
    setGoalActivity: async (inputValue:number) => {
      if (!inputValue) {
        return true
      }
      healthlist.value = await usecase.updateGoal(HealthGoalType.ACTIVITY, inputValue)
      // TODO: エラーハンドリング
      return true
    },
    setGoalWeight: async (inputValue:number) => {
      if (!inputValue) {
        return true
      }
      healthlist.value = await usecase.updateGoal(HealthGoalType.WEIGHT, inputValue)
      // TODO: エラーハンドリング
      return true
    }
  }
}