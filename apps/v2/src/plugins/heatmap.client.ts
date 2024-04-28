// @ts-nocheck
import CalHeatMap from 'cal-heatmap'
import Tooltip from 'cal-heatmap/plugins/Tooltip'
import 'cal-heatmap/cal-heatmap.css'

declare module '#app' {
  interface NuxtApp {
    $heatmap: CalHeatMap,
    $tooltip: Tooltip
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      heatmap: () => new CalHeatMap(),
      tooltip: Tooltip
    }
  }
})