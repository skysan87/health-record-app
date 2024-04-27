import { type Healthlist } from "@health-record/core/model"
import type { HealthUseCase } from "@health-record/core/usecase"
import { HealthGoalType, HealthType } from "@health-record/core/value-object"

export type HealthStore = ReturnType<typeof useHealthStore>

export const useHealthStore = () => {
  const { $health } = useNuxtApp()
  const usecase: HealthUseCase = $health()
  const healthlist = ref<Healthlist>()

  return {
    healthlist: readonly(healthlist),
    latestData: computed(() => healthlist.value?.latest),
    goal: computed(() => healthlist.value!.goal),
    range: computed(() => healthlist.value!.goalWeightRange),
    initHealth: async () => { //TODO: useAsyncData
      healthlist.value = await usecase.init()
    },
    recordWeight: async (inputValue: number): Promise<void> => {
      if (!inputValue) {
        throw new Error('validation error')
      }
      healthlist.value = await usecase.addRecord(HealthType.WEIGHT, inputValue)
    },
    recordHeight: async (inputValue: number): Promise<void> => {
      if (!inputValue) {
        throw new Error('validation error')
      }
      healthlist.value = await usecase.addRecord(HealthType.HEIGHT, inputValue)
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