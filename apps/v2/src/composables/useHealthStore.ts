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
    range: computed(() => healthlist.value?.goalWeightRange),
    initHealth: async () => { //TODO: useAsyncData
      healthlist.value = await usecase.init()
    },
    recordWeight: async (inputValue: number): Promise<void> => {
      if (!inputValue) {
        throw new Error('validation error')
      }
      const date = dateFactory()
      const health = new Health(''
        , date.get('year'), date.get('month'), date.get('date')
        , HealthType.WEIGHT, inputValue
      )
      healthlist.value = await usecase.addRecord(health)
    },
    recordHeight: async (inputValue: number): Promise<void> => {
      if (!inputValue) {
        throw new Error('validation error')
      }
      const date = dateFactory()
      const health = new Health(''
        , date.get('year'), date.get('month'), date.get('date')
        , HealthType.HEIGHT, inputValue
      )
      healthlist.value = await usecase.addRecord(health)
    },
    setGoalActivity: async (inputValue: number): Promise<void> => {
      if (!inputValue) {
        throw new Error('validation error')
      }
      healthlist.value = await usecase.updateGoal(HealthGoalType.ACTIVITY, inputValue)
    },
    setGoalWeight: async (inputValue: number): Promise<void> => {
      if (!inputValue) {
        throw new Error('validation error')
      }
      healthlist.value = await usecase.updateGoal(HealthGoalType.WEIGHT, inputValue)
    },
    setGoalWeightRange: async (inputValue: any): Promise<void> => {
      const start = inputValue?.start ?? null
      const end = inputValue?.end ?? null
      healthlist.value = await usecase.updateGoalWeightRange(start, end)
    }
  }
}