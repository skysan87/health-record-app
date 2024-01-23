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
        gutter,
        label: { text: 'MMM', position: 'top', textAlign: 'start' }
      },
      subDomain: { type: 'ghDay', radius: 2, width: cellSize, height: cellSize, gutter, label: 'D' },
      date: {
        start: dateFactory().subtract(11, 'month').toDate()
      },
      verticalOrientation: false,
      data: {
        source: data.map(a => ({ date: dateFactory(a.id).format('YYYY-MM-DD'), value: a.records?.length ?? 0 })).filter(v => v.value > 0),
        x: 'date',
        y: 'value'
      },
      scale: {
        // 重みづけ
        color: {
          type: 'threshold',
          range: ['#b0f5e5', '#35f2c6', '#0fbdb4', '#077485'],
          domain: [2, 4, 6]
        }
      }
    },
    [
      [
        Tooltip,
        {
          text: function (_date: any, value: any, _dayjsDate: any) {
            return dateFactory(_date).format('YYYY/MM/DD(ddd)') +  (value ? `: ${value}回` : '')
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
  <!-- TODO: 横スクロール -->
  <div id="cal-heatmap"></div>
</template>
