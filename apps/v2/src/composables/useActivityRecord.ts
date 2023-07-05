import type { Activity, Activitylist } from "@health-record/core/model"
import type { ActivityUseCase } from "@health-record/core/usecase"
import { Menu, Record } from "@health-record/core/value-object"
import { useActivity, useActivitylist } from './states'

type Input = {
  selectedActivity: Menu
  valueKcal: number
  valueUnit: number
  otherMenuLabel: string
}

export const useActivityRecord = () => {
  const { $activity } = useNuxtApp()

  const activity = useActivity()
  const activitylist = useActivitylist()

  const usecase: ActivityUseCase = $activity()
  const input = reactive<Input>({
    selectedActivity: null,
    valueKcal: null,
    valueUnit: null,
    otherMenuLabel: null
  })
  const _menulist = ref<Menu[]>([])

  const activityOther: Menu = { label: 'その他', value: 1, unit: '' } as Menu

  const clearInput = () => {
    input.selectedActivity = null
    input.valueKcal = null
    input.valueUnit = null
    input.otherMenuLabel = null
  }

  return {
    activityOther: readonly(activityOther),
    menulist: readonly(_menulist),
    records: computed(() => activity.value?.records ?? []),
    input,
    initActivity: async () => { // TODO: useAsyncData
      const [firstActivitylist, firstActivity] = await usecase.init()
      activity.value = firstActivity
      activitylist.value = firstActivitylist
      _menulist.value = firstActivitylist.menu
    },
    updateMenu: async (menulist: Menu[]) => {
      activitylist.value = await usecase.updateMenu(menulist)
      _menulist.value = menulist
    },
    recordActivity: async () => {
      if (!input.selectedActivity) {
        return
      }
      const label = input.selectedActivity.label === activityOther.label
        ? input.otherMenuLabel
        : input.selectedActivity.label

      const record = new Record(new Date(), label, input.valueKcal)
      // TODO: バリデーションエラー
      // record.validate()
      activity.value = await usecase.addRecord(record)
      // TODO: エラーハンドリング
      clearInput()
    },
    onChangeActivity: () => {
      if (!input.selectedActivity) {
        return
      }
      input.valueUnit = null
      input.valueKcal = null
    },
    calcKcal: () => {
      if (!input.selectedActivity) {
        return
      }
      const data = input.valueUnit * input.selectedActivity.value
      input.valueKcal = parseFloat(data.toFixed(2))
    }
  }
}
