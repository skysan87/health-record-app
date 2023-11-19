/**
 * 小数点以下第2位まで表示
 *
 * @param {String | Number} value
 * @param {Number} defaultValue
 * @returns {Number} 小数点以下第2位まで
 */
export function fixFloat(value: string | number, defaultValue: number = 0): number {
  if (!value) {
    return defaultValue
  }

  if (!isNumericPattern(String(value))) {
    return defaultValue
  }

  return parseFloat(parseFloat(value as string).toFixed(2))
}

export function isNumericPattern(value: string): boolean {
  // 10進数の整数か小数
  // 特殊記法などは許容しない
  return value.match(/^-?[0-9]+\.[0-9]+?$|^-?[0-9]+$/) ? true : false
}