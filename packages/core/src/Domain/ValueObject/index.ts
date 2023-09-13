import { isEmpty } from "../../Util/StringUtil"

/**
 * 同一プロパティを持つ型定義の区別のために利用
 * @param U type名
 */
export type Nominal<T, U extends string> = T & { __brand: U }

interface ValueValidator {
  validate(): boolean
}

export class Record implements ValueValidator {

  constructor(
    public readonly timestamp: Date,
    public readonly name: string,
    public readonly value: number
  ) { }

  validate(): boolean {
    if (isEmpty(this.name)) {
      return false
    }
    if (!this.value || this.value < 0) {
      return false
    }
    return true
  }
}

export class Menu implements ValueValidator {

  constructor(
    public readonly label: string | null,
    public readonly value: number | null,
    public readonly unit: string | null
  ) { }

  validate(): boolean {
    return true
  }
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