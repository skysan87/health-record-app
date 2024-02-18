<script setup lang="ts">

interface Props {
  value?: string // YYYY/MM/DD
}

const props = withDefaults(defineProps<Props>(), {
  value: ''
})

const year = ref('')
const month = ref('')
const date = ref('')

const initRange = () => {
  const tmp = props.value ?? ''
  const [y, m, d] = tmp.split('/')
  year.value = y ?? ''
  month.value = m ?? ''
  date.value = d ?? ''
}

// NOTE: propsはtoRefsでリアクティブにする
const { value: dateString } = toRefs(props)

watch(dateString, () => {
  initRange()
})
</script>

<template>
  <div class="daily-calendar inline-block">
    <div class="year">
      {{ year }}
    </div>
    <div class="wrapper">
      <div class="month">
        {{ month }}月
      </div>
      <div class="date">
        {{ date }}
      </div>
    </div>
    <div class="text">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.daily-calendar {
  width: 54px;
  height: 83px;
  box-sizing: border-box;
  text-align: center;
}

.year {
  width: 100%;
  height: 15px;
  color: #00f;
  background-color: #fff;
  font-size: 10px;
}

.wrapper {
  width: 100%;
  border: 1px solid #00f;
}

.month {
  width: 100%;
  height: 18px;
  color: #fff;
  background-color: #00f;
  font-size: 12px;
  font-weight: bold;
  line-height: normal;
}

.date {
  width: 100%;
  height: 33px;
  color: #606060;
  background-color: #fff;
  font-size: 28px;
  line-height: normal;
}

.text {
  width: 100%;
  height: 15px;
  color: black;
  background-color: #fff;
  font-size: 10px;
}
</style>
