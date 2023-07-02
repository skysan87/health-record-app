import type { Activity, Activitylist } from "@health-record/core/model"
import type { ActivityUseCase } from "@health-record/core/usecase"
import { Menu, Record } from "@health-record/core/value-object"

type ActivityMenu = {
  label: string
  value: number
  unit: string
}

type Input = {
  selectedActivity: ActivityMenu
  valueKcal: number
  valueUnit: number
  otherMenuLabel: string
}

export const useActivity = () => {
  const { $activity } = useNuxtApp()

  const activity = useState<Activity>('activity', () => null)
  const activitylist = useState<Activitylist>('activitylist', () => null)

  const usecase: ActivityUseCase = $activity()
  const input = reactive<Input>({
    selectedActivity: null,
    valueKcal: null,
    valueUnit: null,
    otherMenuLabel: null
  })
  const _menulist = ref<Menu[]>([])

  const activityOther = { label: 'その他', value: 1, unit: '' }

  const clearInput = () => {
    input.selectedActivity = null
    input.valueKcal = null
    input.valueUnit = null
    input.otherMenuLabel = null
  }

  return {
    activity: readonly(activity),
    activitylist: readonly(activitylist),
    activityOther: readonly(activityOther),
    menulist: readonly(_menulist),
    input,
    totalCalorie: computed(() => {
      // TODO: 反映されない
      const total = activity.value ? activity.value.total : 0
      return parseFloat(total.toFixed(2))
    }),
    initActivity: async() => { // TODO: useAsyncData
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
      nextTick(() => {})
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
