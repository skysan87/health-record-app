<template>
  <div id="chart" />
</template>

<script>
import 'chartist/dist/index.css'
import { LineChart, FixedScaleAxis, Interpolation } from 'chartist'
import { dateFactory } from '@/util/DateFactory'

export default {
  name: 'TimelineChart',

  data () {
    return {
      chart: null
    }
  },

  mounted () {
  },

  methods: {
    init (series) {
      const serirsOptions = {}
      series.forEach((s) => {
        serirsOptions[`${s.name}`] = {
          lineSmooth: Interpolation.cardinal({ tension: 0.1 }),
          showPoint: false
        }
      })

      this.chart = new LineChart(
        '#chart',
        {
          series
        },
        {
          axisX: {
            type: FixedScaleAxis,
            divisor: 5,
            labelInterpolationFnc: value =>
              dateFactory(value).format('YY/MM/DD')
          },
          series: {
            ...serirsOptions
          }
        }
      )
    },

    update (series) {
      this.chart.update({ series })
    }
  }
}
</script>

<style>
/*
 * - LineChartの上書き(a,b,c...と利用する線の分だけ設定が必要)
 * - `scoped`を設定すると反映されない
 * @see https://gionkunz.github.io/chartist-js/getting-started.html#customizing-the-default-css
 */
.ct-series-a .ct-line {
  stroke: #00a79d;
}

.ct-series-b .ct-line {
  stroke: #1c75bc;
}
</style>
