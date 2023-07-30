<script setup lang="ts">
import { useChart } from '@/composables/useChart'
import { LayoutKey } from '~~/.nuxt/types/layouts'

const { chart, selectedRange, init, viewReset, viewPreview, viewNext } = useChart()

const range: Array<{ label: string, value: number }> = [
  { label: '2週', value: 14 },
  { label: '1ヶ月', value: 30 },
  { label: '2ヶ月', value: 60 },
  { label: '3ヶ月', value: 90 },
  { label: '6ヶ月', value: 180 }
]

watch(selectedRange, viewReset)

onMounted(async () => await init())

definePageMeta({
  layout: computed<LayoutKey>(() => {
    const { isMobile } = useDevice()
    return isMobile ? 'board-mobile' : 'board'
  })
})
</script>

<template>
  <div>
    <header class="border-b flex">
      <div class="cursor-pointer py-2 pl-4 inline-block text-gray-600" @click="viewPreview">
        <fa :icon="['fas', 'arrow-left']" size="lg" ontouchend="" />
      </div>
      <div class="cursor-pointer py-2 pl-4 inline-block text-gray-600" @click="viewReset">
        <fa :icon="['fas', 'house']" size="lg" ontouchend="" />
      </div>
      <div class="cursor-pointer py-2 pl-4 inline-block text-gray-600" @click="viewNext">
        <fa :icon="['fas', 'arrow-right']" size="lg" ontouchend="" />
      </div>
      <div class="ml-auto py-2 px-4">
        <select v-model="selectedRange" class="input-text">
          <option v-for="r in range" :key="r.value" :value="r.value">
            {{ r.label }}
          </option>
        </select>
      </div>
    </header>
    <ChartTimelineChart ref="chart" />
  </div>
</template>