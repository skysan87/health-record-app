<script setup lang="ts">
import type { Activity } from '@health-record/core/model'
import { dateFactory } from '@health-record/core/util/DateUtil'
import CalHeatmap from 'cal-heatmap'
import Tooltip from 'cal-heatmap/plugins/Tooltip'
import 'cal-heatmap/cal-heatmap.css'

const cellSize = 17
const gutter = 2
const heatmap = new CalHeatmap()

const init = (data: Activity[]) => {
  heatmap.paint(
    {
      itemSelector: '#cal-heatmap',
      domain: {
        type: 'month',
        sort: 'desc',
        padding: [0, 5, 0, 0],
        gutter,
        label: { text: 'YYYY/M', position: 'top', textAlign: 'start' }
      },
      subDomain: { type: 'day', radius: 2, width: cellSize, height: cellSize, gutter, label: 'D' },
      date: {
        start: dateFactory().subtract(11, 'month').toDate()
      },
      verticalOrientation: false,
      data: {
        source: data.filter(a => a.total > 0).map(a => ({ date: dateFactory(a.id).format('YYYY-MM-DD'), value: a.total ?? 0 })),
        x: 'date',
        y: 'value'
      },
      scale: {
        // 重みづけ
        color: {
          type: 'threshold',
          scheme: 'oranges',
          domain: [1, 200, 400, 600, 800, 1000] // kcal
        }
      }
    },
    [
      [
        Tooltip,
        {
          text: function (_date: any, value: any, _dayjsDate: any) {
            return value ? `${value} kcal` : ''
          }
        }
      ]
    ]
  )
}

defineExpose({
  init
})
</script>

<template>
  <div id="cal-heatmap" class="overflow-auto"></div>
</template>
