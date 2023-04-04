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
      series: [],
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
          this.series = [{
            name: 'weight',
            data: this.getRangeData()
          }]
          this.$refs.chart.init(this.series)
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

    getRangeData () {
      const start = dateFactory().addDay((this.currentPage - 1) * this.selectedRange).toDate()
      const end = dateFactory().addDay(this.currentPage * this.selectedRange).toDate()
      if (start && end) {
        const targets = this.records.filter((v) => {
          return v.x.getTime() > start.getTime() && v.x.getTime() < end.getTime()
        })
        // NOTE:
        //  データがないと、メモリが初期化される
        //  また、表示範囲の日付のデータがないと、メモリが表示されない
        targets.unshift({ x: start, y: null })
        targets.push({ x: end, y: null })
        return targets
      } else {
        return this.records
      }
    },

    /**
     * @param {Array} records
     * @param {Date} start
     * @param {Date} end
     */
    updateData (start = null, end = null) {
      this.series = [{
        name: 'weight',
        data: this.getRangeData(start, end)
      }]
      this.$refs.chart.update(this.series)
    }
  }
}
</script>
