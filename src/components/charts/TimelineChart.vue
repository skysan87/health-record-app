<template>
  <div id="chart" />
</template>

<script>
import 'chartist/dist/index.css'
import { LineChart, FixedScaleAxis } from 'chartist'

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
              new Date(value).toLocaleString(undefined, {
                year: '2-digit',
                month: 'short',
                day: 'numeric'
              })
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
