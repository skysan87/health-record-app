import type { Record } from "@health-record/core/value-object"
import type { FieldValue } from "firebase/firestore"

export type ActivityEntity = {
  total?: number
  records?: Record[] | FieldValue
  createdAt?: FieldValue
  updatedAt?: FieldValue
}