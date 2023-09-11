import { HealthType } from "@health-record/core/value-object"
import { FieldValue } from "firebase/firestore"

export type HealthEntity = {
  year?: number
  month?: number
  date?: number
  type?: HealthType
  value?: number
  createdAt?: FieldValue
  updatedAt?: FieldValue
}