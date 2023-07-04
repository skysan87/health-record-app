import type { Health } from "@health-record/core/model"
import type { HealthUseCase } from "@health-record/core/usecase"
import { HealthType } from "@health-record/core/value-object"
import TimelineChart from '~/components/Chart/TimelineChart.vue'
import { dateFactory } from '@health-record/core/util/DateUtil'
import type { SeriesObject, SeriesPrimitiveValue } from 'chartist'

type Point = {
  x: Date
  y: number
}

const DEFAULT_PER_PAGE = 30

export const useChart = () => {
  const { $health } = useNuxtApp()
  const usecase: HealthUseCase = $health()
  const records = ref<Point[]>([])

  const currentPage = ref<number>(0)
  const chart = ref<InstanceType<typeof TimelineChart>>()
  const selectedRange = ref(DEFAULT_PER_PAGE)

  const goal = computed(() => { return { weight: 0 } })

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

  const getRangeData = (): Point[] => {
    const { start, end } = getPageRange()
    const targets: Point[] = records.value.filter((v: Point) => {
      return v.x.getTime() > start.getTime() && v.x.getTime() < end.getTime()
    })
    // NOTE:
    //  データがないと、メモリが初期化される
    //  また、表示範囲の日付のデータがないと、メモリが表示されない
    targets.unshift({ x: start, y: null })
    targets.push({ x: end, y: null })
    return targets
  }

  const updateData = (): void => {
    const { start, end } = getPageRange()
    const series: SeriesObject<SeriesPrimitiveValue>[] = [
      {
        name: 'weight',
        data: getRangeData()
      },
      {
        name: 'weight-goal', // 目標値
        data: [
          { x: start, y: goal.value.weight ?? null },
          { x: end, y: goal.value.weight ?? null }
        ]
      }
    ]
    chart.value.update(series)
  }

  return {
    chart,
    selectedRange,
    init: async () => {
      await loadRecords()
      const { start, end } = getPageRange()
      const series: SeriesObject<SeriesPrimitiveValue>[] = [
        {
          name: 'weight',
          data: getRangeData()
        },
        {
          name: 'weight-goal', // 目標値
          data: [
            { x: start, y: goal.value.weight ?? null },
            { x: end, y: goal.value.weight ?? null }
          ]
        }
      ]
      chart.value.init(series)
      // TODO: エラーハンドリング
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