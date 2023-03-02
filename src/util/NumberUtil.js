/**
 * 小数点以下第2位まで表示
 *
 * @param {String | Number} value
 * @param {Number} defaultValue
 * @returns {Number} 小数点以下第2位まで
 */
export function fixFloat (value, defaultValue = 0) {
  if (!value) {
    return defaultValue
  }
  // NOTE: Number.isFiniteと異なり、文字列型を数値に変換する
  if (!isFinite(value)) {
    return defaultValue
  }
  // TODO: 指数表記`1e+32`などに未対応
  return parseFloat(parseFloat(value).toFixed(2))
}
