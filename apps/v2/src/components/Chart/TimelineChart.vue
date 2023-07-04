<script setup lang="ts">
import 'chartist/dist/index.css'
import { LineChart, FixedScaleAxis, Interpolation } from 'chartist'
import { dateFactory } from '@health-record/core/util/DateUtil'

let chart: LineChart = null

const init = (series) => {
  const serirsOptions = {}
  series.forEach((s) => {
    serirsOptions[`${s.name}`] = {
      lineSmooth: Interpolation.cardinal({ tension: 0.1 }),
      showPoint: false
    }
  })

  chart = new LineChart(
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
}

const update = (series) => {
  chart.update({ series })
}

defineExpose({
  init, update
})
</script>

<template>
  <div id="chart" />
</template>