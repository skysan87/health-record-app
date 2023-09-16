import dayjs from 'dayjs'

/**
 * 指定した期間のループ処理(昇順)
 * @param {Date} startDate 開始日
 * @param {Date} endDate 終了日
 * @param {Function} _callback コールバック
 */
export function forDayEach (startDate, endDate, _callback) {
  const start = dayjs(startDate)
  const end = dayjs(endDate)

  for (let date = start; date <= end; date = date.add(1, 'day')) {
    const cancel = _callback(date.toDate())
    if (cancel) {
      break
    }
  }
}

/**
 * 指定した期間のループ処理(降順)
 * @param {Date} startDate 開始日
 * @param {Date} endDate 終了日
 * @param {Function} _callback コールバック
 */
export function forDayReverseEach (startDate, endDate, _callback) {
  const start = dayjs(startDate)
  const end = dayjs(endDate)

  for (let date = end; start <= date; date = date.subtract(1, 'day')) {
    const cancel = _callback(date.toDate())
    if (cancel) {
      break
    }
  }
}
