<template>
  <div v-show="!isMenuExpanded">
    <header class="border-b flex">
      <div class="cursor-pointer py-2 pl-4 inline-block text-gray-600" @click="viewPreview">
        <fa :icon="['fas', 'arrow-left']" size="lg" ontouchend="" />
      </div>
      <div class="cursor-pointer py-2 pl-4 inline-block text-gray-600" @click="viewReset">
        <fa :icon="['fas', 'house']" size="lg" ontouchend="" />
      </div>
      <div class="cursor-pointer py-2 pl-4 inline-block text-gray-600" @click="viewNext">
        <fa :icon="['fas', 'arrow-right']" size="lg" ontouchend="" />
      </div>
      <div class="ml-auto py-2 px-4">
        <select v-model="selectedRange" class="input-text">
          <option v-for="r in range" :key="r.value" :value="r.value">
            {{ r.label }}
          </option>
        </select>
      </div>
    </header>

    <TimelineChart ref="chart" />
  </div>
</template>

<script>
import { dateFactory } from '@/util/DateFactory'
import TimelineChart from '@/components/charts/TimelineChart.vue'

const DEFAULT_PER_PAGE = 30

export default {
  components: {
    TimelineChart
  },

  layout: ctx => ctx.$device.isMobile ? 'board_mobile' : 'board',

  data () {
    return {
      selectedRange: DEFAULT_PER_PAGE,
      range: [
        { label: '2週', value: 14 },
        { label: '1ヶ月', value: 30 },
        { label: '2ヶ月', value: 60 },
        { label: '3ヶ月', value: 90 },
        { label: '6ヶ月', value: 180 }
      ],
      records: [],
      currentPage: 0
    }
  },

  computed: {
    isMenuExpanded: {
      get () {
        return this.$store.getters['View/isMenuExpanded']
      }
    },

    goal () {
      return this.$store.getters['Health/getGoal']
    }
  },

  watch: {
    selectedRange () {
      this.viewReset()
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    init () {
      this.$store.dispatch('Health/loadRecords')
        .then(() => {
          this.records = this.$store.getters['Health/getRecords']
          this.$refs.chart.init(this.calcSeries())
        })
        .catch((error) => {
          console.error(error)
          this.$toast.error('取得に失敗しました')
        })
    },

    viewPreview () {
      this.currentPage--
      this.updateData()
    },

    viewNext () {
      this.currentPage++
      this.updateData()
    },

    viewReset () {
      this.currentPage = 0
      this.updateData()
    },

    getPageRange () {
      return {
        start: dateFactory().addDay((this.currentPage - 1) * this.selectedRange).toDate(),
        end: dateFactory().addDay(this.currentPage * this.selectedRange).toDate()
      }
    },

    getVisibleData () {
      const { start, end } = this.getPageRange()
      const targets = this.records.filter((v) => {
        return v.x.getTime() > start.getTime() && v.x.getTime() < end.getTime()
      })
      // NOTE:
      //  データがないと、メモリが初期化される
      //  また、表示範囲の日付のデータがないと、メモリが表示されない
      targets.unshift({ x: start, y: null })
      targets.push({ x: end, y: null })
      return targets
    },

    /**
     * 目標設定の値の表示
     * @param {Date} visibleStart グラフの表示開始日
     * @param {Date} visibleEnd グラフの表示終了日
     */
    calcGoalWeightSeries (visibleStart, visibleEnd) {
      const result = {
        startWeight: null,
        endWeight: null,
        startDate: null,
        endDate: null
      }

      const { startDate, endDate, startWeight, endWeight } = this.$store.getters['Health/getGoalWeightRange']

      // 未設定ならば、目標体重を設定
      if (!startDate || !endDate) {
        result.startWeight = this.goal.weight ?? null
        result.endWeight = this.goal.weight ?? null
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
      const f = x => wpd * x + startWeight

      // 正の値: 始点がグラフの表示範囲内
      const startDiff = dateFactory(visibleStart).diff(startDateObj, 'day')
      // 表示する最初の体重
      result.startWeight = startDiff > 0 ? f(startDiff) : startWeight

      // 正の値: 終点がグラフの表示範囲内
      const endDiff = dateFactory(visibleEnd).diff(startDateObj, 'day')
      // 表示する最後の体重
      result.endWeight = endDiff > 0 ? f(endDiff) : endWeight

      // グラフの表示範囲かチェックする
      const withinRange = x => x.getTime() > visibleStart.getTime() && x.getTime() < visibleEnd.getTime()
      result.startDate = withinRange(startDate) ? startDate : visibleStart
      result.endDate = withinRange(endDate) ? endDate : visibleEnd

      return result
    },

    calcSeries () {
      const range = this.getPageRange()
      const { startWeight, endWeight, startDate, endDate } = this.calcGoalWeightSeries(range.start, range.end)

      return [
        {
          name: 'weight',
          data: this.getVisibleData()
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
    },

    updateData () {
      this.$refs.chart.update(this.calcSeries())
    }
  }
}
</script>
