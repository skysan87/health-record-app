import { isEmpty } from "../../Util/StringUtil"

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
    public readonly label: string,
    public readonly value: number,
    public readonly unit: string = ''
  ) { }

  validate(): boolean {
      return true
  }
}

export class UserId implements ValueValidator {

  constructor(public readonly value: string) { }

  validate(): boolean {
    return true
  }
}

export class Mail implements ValueValidator {

  constructor(public readonly value: string) { }

  validate(): boolean {
    return true
  }
}

export class DisplayName implements ValueValidator {

  constructor(public readonly value: string) { }

  validate(): boolean {
    return true
  }
}

export class DateNumber implements ValueValidator {

  private static readonly pattern: RegExp = new RegExp('[0-9]{8}')

  constructor(public readonly value: string) { }

  validate(): boolean {
    return  DateNumber.pattern.test(this.value)
  }
}

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
