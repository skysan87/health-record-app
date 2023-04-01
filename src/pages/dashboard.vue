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

    <!-- <apex-chart ref="chart" type="line" height="400" :options="chartOptions" :series="series" /> -->
  </div>
</template>

<script>
// import { dateFactory } from '@/util/DateFactory'

const DEFAULT_PER_PAGE = 60

export default {

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
      chartOptions: {
        chart: {
          animations: {
            enabled: false
          },
          type: 'line',
          zoom: {
            enabled: false
          },
          toolbar: {
            tools: {
              download: false,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight',
          width: 1
        },
        title: {
          text: '体重',
          align: 'center'
        },
        markers: {
          size: 2
        },
        xaxis: {
          type: 'datetime',
          categories: [], // X軸データ
          labels: {
            format: 'MM/dd',
            showDuplicates: false,
            hideOverlappingLabels: true,
            datetimeUTC: false
          },
          range: 60 * 60 * 24 * 1000 * DEFAULT_PER_PAGE, // 日(ミリ秒)
          tooltip: {
            // X軸のtooltip表示
            enabled: false
          }
        },
        grid: {
          padding: {
            right: 20,
            left: 20
          },
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          }
        },
        tooltip: {
          x: {
            format: 'yyyy/MM/dd hh:mm'
          }
        }
      },
      series: [{
        name: '',
        data: [] // Y軸データ
      }],
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
    selectedRange (n, _) {
      this.setRange(n)
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    init () {
      this.$store.dispatch('Health/loadRecords')
        .then(() => {
          const records = this.$store.getters['Health/getRecords']
          this.updateData(records)
        })
        .catch((error) => {
          console.error(error)
          this.$toast.error('取得に失敗しました')
        })
    },

    viewPreview () {
      this.currentPage--
      // const start = dateFactory().addDay((this.currentPage - 1) * this.selectedRange).toDate()
      // const end = dateFactory().addDay(this.currentPage * this.selectedRange).toDate()
      // this.$refs.chart.zoomX(start.getTime(), end.getTime())
    },

    viewNext () {
      this.currentPage++
      // const start = dateFactory().addDay((this.currentPage - 1) * this.selectedRange).toDate()
      // const end = dateFactory().addDay(this.currentPage * this.selectedRange).toDate()
      // this.$refs.chart.zoomX(start.getTime(), end.getTime())
    },

    viewReset () {
      this.currentPage = 0
      // this.$refs.chart.resetSeries()
    },

    updateData (records) {
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          xaxis: {
            categories: Object.keys(records)
          },
          annotations: {
            yaxis: [{
              y: this.goal.weight ?? null, // 目標値
              borderColor: 'red'
            }]
          }
        }
      }
      this.series = [{
        name: 'kg',
        data: Object.values(records)
      }]
    },

    setRange (value) {
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          xaxis: {
            range: 60 * 60 * 24 * 1000 * value
          }
        }
      }
    }
  }
}
</script>
