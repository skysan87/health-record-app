<template>
  <div id="chart" />
</template>

<script>
import 'chartist/dist/index.css'
import { LineChart, FixedScaleAxis } from 'chartist'
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
