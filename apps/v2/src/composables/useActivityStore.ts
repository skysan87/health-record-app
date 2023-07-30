import type { Activity, Activitylist } from "@health-record/core/model"
import type { ActivityUseCase } from "@health-record/core/usecase"
import { dateFactory } from "@health-record/core/util/DateUtil"
import { Menu, Record } from "@health-record/core/value-object"

type Input = {
  selectedActivity: Menu
  valueKcal: number
  valueUnit: number
  otherMenuLabel: string
}

export type ActivityStore = ReturnType<typeof useActivityStore>

export const useActivityStore = () => {
  const { $activity, $toast } = useNuxtApp()

  const activity = ref<Activity>(null)
  const activitylist = ref<Activitylist>(null)
  const total = ref(0)
  const records = ref<Record[]>([])

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
    activitylist: readonly(activitylist),
    activity: readonly(activity),
    totalCalorie: readonly(total),
    activityOther: readonly(activityOther),
    menulist: readonly(_menulist),
    records: computed(() => records.value.map(r => {
      return {
        id: r.timestamp.getTime(),
        time: dateFactory(r.timestamp).format('HH:mm'),
        name: r.name,
        value: r.value
      }
    })),
    input,
    clearInput,
    initActivity: async () => { // TODO: useAsyncData
      const [firstActivitylist, firstActivity] = await usecase.init()
      activity.value = firstActivity
      activitylist.value = firstActivitylist
      _menulist.value = firstActivitylist.menu
    },
    updateMenu: async (menulist: Menu[]) => {
      try {
        activitylist.value = await usecase.updateMenu(menulist)
        _menulist.value = menulist
      } catch (error) {
        console.error(error)
        $toast.error('更新に失敗しました')
      }
    },
    recordActivity: async (): Promise<void> => {
      if (!input.selectedActivity) {
        return
      }
      const label = input.selectedActivity.label === activityOther.label
        ? input.otherMenuLabel
        : input.selectedActivity.label

      const record = new Record(new Date(), label, input.valueKcal)
      if (!record.validate()) {
        return
      }
      try {
        activity.value = await usecase.addRecord(record)
        total.value = activity.value?.total ?? 0
        records.value = [...activity.value?.records ?? []]
        clearInput()
      } catch (error) {
        console.error(error)
        $toast.error('登録に失敗しました')
      }
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
