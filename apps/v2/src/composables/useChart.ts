import type { Health, Healthlist } from "@health-record/core/model"
import type { HealthUseCase } from "@health-record/core/usecase"
import { HealthType } from "@health-record/core/value-object"
import TimelineChart from '~/components/Chart/TimelineChart.vue'
import { dateFactory } from '@health-record/core/util/DateUtil'
import type { SeriesObject, SeriesPrimitiveValue } from 'chartist'

type Point = {
  x: Date
  y: number | null
}

const DEFAULT_PER_PAGE = 30

export const useChart = () => {
  const { $health, $toast } = useNuxtApp()
  const usecase: HealthUseCase = $health()
  let _healthlist: Healthlist

  const records = ref<Point[]>([])
  const currentPage = ref<number>(0)
  const chart = ref<InstanceType<typeof TimelineChart>>()
  const selectedRange = ref(DEFAULT_PER_PAGE)

  const loadRecords = async () => {
    records.value = (await usecase.getRecords())
      .filter((v: Health) => v.type === HealthType.WEIGHT)
      .map((v: Health) => ({ x: v.createdAt, y: v.value } as Point))
  }

  const getPageRange = (): { start: Date, end: Date } => {
    return {
      start: dateFactory().addDay((currentPage.value - 1) * selectedRange.value).toDate(),
      end: dateFactory().addDay(currentPage.value * selectedRange.value).toDate()
    }
  }

  const getVisibleData = (): Point[] => {
    const { start, end } = getPageRange()
    const targets: Point[] = records.value.filter((v: Point) => {
      return v.x.getTime() > start.getTime() && v.x.getTime() < end.getTime()
    })

    // グラフの末端に表示範囲の前後のデータを表示する
    let startWeight: number | null = null
    let endWeight: number | null = null
    if (targets.length >= 2) {
      const firstIndex = records.value.findIndex(v => v.x === targets[0].x)
      if (firstIndex > 0) {
        startWeight = records.value[firstIndex - 1].y
      }
      const lastIndex = records.value.findIndex(v => v.x === targets[targets.length - 1].x)
      if (lastIndex < targets.length - 1) {
        endWeight = records.value[lastIndex + 1].y
      }
    }

    // NOTE:
    //  データがないと、メモリが初期化される
    //  また、表示範囲の日付のデータがないと、メモリが表示されない
    targets.unshift({ x: start, y: startWeight })
    targets.push({ x: end, y: endWeight })
    return targets
  }

  const updateData = (): void => {
    chart.value.update(calcSeries())
  }

  /**
   * 目標設定の値の表示
   * @param visibleStart グラフの表示開始日
   * @param visibleEnd グラフの表示終了日
   * @returns
   */
  const calcGoalWeightSeries = (visibleStart: Date, visibleEnd: Date) => {
    type result = {
      startWeight: number | null
      endWeight: number | null,
      startDate: Date | null,
      endDate: Date | null
    }

    const result: result = {
      startWeight: null,
      endWeight: null,
      startDate: null,
      endDate: null
    }

    const { startDate, endDate, startWeight, endWeight } = _healthlist.goalWeightRange

    // 未設定ならば、目標体重を設定
    if (!startDate || !endDate) {
      result.startWeight = _healthlist.goal.weight ?? null
      result.endWeight = _healthlist.goal.weight ?? null
      result.startDate = visibleStart
      result.endDate = visibleEnd
      return result
    }

    // 範囲外は表示しない
    if (endDate.getTime() < visibleStart.getTime() || startDate.getTime() > visibleEnd.getTime()) {
      result.startWeight = null
      result.endWeight = null
      result.startDate = visibleStart
      result.endDate = visibleEnd
      return result
    }

    // 期間が設定されている場合、目標値の値を計算して表示する
    const startDateObj = dateFactory(startDate)
    const endDateObj = dateFactory(endDate)

    // 係数
    const wpd = (startWeight - endWeight) / startDateObj.diff(endDateObj, 'day')

    // 減量予想を表す一次関数式
    const f = (x: number) => wpd * x + startWeight

    // 正の値: 始点がグラフの表示範囲内
    const startDiff = dateFactory(visibleStart).diff(startDateObj, 'day')
    // 表示する最初の体重
    result.startWeight = startDiff > 0 ? f(startDiff) : startWeight

    // 正の値: 終点がグラフの表示範囲内
    const endDiff = dateFactory(visibleEnd).diff(startDateObj, 'day')
    // 表示する最後の体重
    result.endWeight = endDiff > 0 ? f(endDiff) : endWeight

    // グラフの表示範囲かチェックする
    const withinRange = (x: Date) => x.getTime() > visibleStart.getTime() && x.getTime() < visibleEnd.getTime()
    result.startDate = withinRange(startDate) ? startDate : visibleStart
    result.endDate = withinRange(endDate) ? endDate : visibleEnd

    return result
  }

  const calcSeries = (): SeriesObject<SeriesPrimitiveValue>[] => {
    const { start, end } = getPageRange()
    const { startWeight, endWeight, startDate, endDate } = calcGoalWeightSeries(start, end)
    const series: SeriesObject<SeriesPrimitiveValue>[] = [
      {
        name: 'weight',
        data: getVisibleData()
      },
      {
        // 目標値
        name: 'weight-goal',
        data: [
          { x: startDate, y: startWeight },
          { x: endDate, y: endWeight }
        ]
      }
    ]
    return series
  }

  return {
    chart,
    selectedRange,
    init: async (healthlist: Healthlist) => {
      _healthlist = healthlist
      try {
        await loadRecords()
        chart.value.init(calcSeries())
      } catch (error) {
        console.error(error)
        $toast.error('読み込みに失敗しました')
      }
    },
    viewPreview: () => {
      currentPage.value--
      updateData()
    },
    viewNext: () => {
      currentPage.value++
      updateData()
    },
    viewReset: () => {
      currentPage.value = 0
      updateData()
    }
  }
}