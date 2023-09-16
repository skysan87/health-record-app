import { Menu } from "@health-record/core/value-object"
import { FieldValue } from "firebase/firestore"

export type ActivitylistEntity = {
  menu?: Menu[]
  createdAt?: FieldValue
  updatedAt?: FieldValue
}