import type { Menu } from "@health-record/core/value-object"
import type { FieldValue } from "firebase/firestore"

export type ActivitylistEntity = {
  menu?: Menu[]
  createdAt?: FieldValue
  updatedAt?: FieldValue
}