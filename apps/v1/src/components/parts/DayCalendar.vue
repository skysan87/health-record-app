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
  </div>
</template>

<script>
export default {
  name: 'DayCalendar',
  props: {
    /**
     * YYYY/MM/DD
     */
    value: {
      type: String,
      require: true,
      default: ''
    }
  },

  data () {
    return {
      year: '',
      month: '',
      date: ''
    }
  },

  watch: {
    value () {
      this.init()
    }
  },

  methods: {
    init () {
      const tmp = this.value ?? ''
      const [y, m, d] = tmp.split('/')
      this.year = y ?? ''
      this.month = m ?? ''
      this.date = d ?? ''
    }
  }
}
</script>

<style scoped>
.daily-calendar {
  width: 54px;
  height: 68px;
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
</style>
