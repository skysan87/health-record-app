<script setup lang="ts">
import 'chartist/dist/index.css'
import { FixedScaleAxis, Interpolation, LineChart, type AllSeriesTypes, type SeriesObject, type SeriesPrimitiveValue } from 'chartist'
import { dateFactory } from '@health-record/core/util/DateUtil'

let chart: LineChart | null = null

const init = (series: SeriesObject<SeriesPrimitiveValue>[]) => {
  const serirsOptions: any = {}
  series.forEach((s: any) => {
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

const update = (series: AllSeriesTypes) => {
  chart?.update({ series })
}

defineExpose({
  init, update
})
</script>

<template>
  <div id="chart" class="w-full" />
</template>

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