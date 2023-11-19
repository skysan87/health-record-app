import { isEmpty } from "../../Util/StringUtil"
import { isNumericPattern } from "../../Util/NumberUtil"

/**
 * 同一プロパティを持つ型定義の区別のために利用
 * @param U type名
 */
export type Nominal<T, U extends string> = T & { __brand: U }

export type Record = {
  timestamp: Date
  name: string
  value: number
}

export function validRecord(data: Record): boolean {
  if (isEmpty(data.name)) return false
  if (!isNumericPattern(String(data.value))) return false
  return true
}

export type Menu = {
  label: string | null
  value: number | null
  unit: string | null
}

export function validMenu(data: Menu): boolean {
  return !isEmpty(data.label ?? '')
}

// TODO: implement assert-function
export type UserId = Nominal<string, 'UserId'>

// TODO: implement assert-function
export type Mail = Nominal<string, 'Mail'>

// TODO: implement assert-function
export type DisplayName = Nominal<string, 'DisplayName'>

// TODO: implement assert-function: new RegExp('[0-9]{8}')
export type DateNumber = Nominal<string, 'DateNumber'>

export const HealthType = {
  WEIGHT: 'weight',
  HEIGHT: 'height'
} as const

export type HealthType = typeof HealthType[keyof typeof HealthType]

export const HealthGoalType = {
  WEIGHT: 'weight',
  ACTIVITY: 'activity'
} as const

export type HealthGoalType = typeof HealthGoalType[keyof typeof HealthGoalType]

export type GoalWeightRange = {
  startWeight: number
  endWeight: number
  startDate: Date | null
  endDate: Date | null
}