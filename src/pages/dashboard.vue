<template>
  <!-- TODO: ハンバーガーメニュー表示時にかぶるので、非表示にする -->
  <div>
    <apex-chart
      type="line"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
export default {

  // TODO: 表示するデータ数
  // TODO: ラジオボタンでデータ切り替え

  layout: ctx => ctx.$device.isMobile ? 'board_mobile' : 'board',

  data () {
    return {
      chartOptions: {
        chart: {
          type: 'line',
          id: 'yt',
          zoom: {
            enabled: false
          },
          toolbar: {
            tools: {
              download: false
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        markers: {
          size: 6
        },
        xaxis: {
          type: 'datetime',
          // TODO: データ
          categories: [
            '2021-10-04T03:50:03+09:00',
            '2021-10-05T03:50:03+09:00',
            '2021-10-05T09:50:03+09:00'
          ],
          labels: {
            format: 'MM/dd',
            showDuplicates: false,
            hideOverlappingLabels: true,
            datetimeUTC: false
          },
          tooltip: {
            // X軸のtooltip表示
            enabled: false
          }
        },
        tooltip: {
          x: {
            format: 'yyyy/MM/dd hh:mm'
          }
        }
      },
      series: [
        {
          name: '',
          // TODO: データ
          data: [157, 135, 135]
        }
      ]
    }
  }
}
</script>
