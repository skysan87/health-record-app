<template>
  <div id="chart" />
</template>

<script>
import 'chartist/dist/index.css'
import { LineChart, FixedScaleAxis, Interpolation } from 'chartist'
import { dateFactory } from '@health-record/core/util/DateUtil'

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
