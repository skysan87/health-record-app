import { DisplayName, UserId, Mail } from "@/Domain/ValueObject"

export class User {
  constructor(
    public id: UserId,
    public email: Mail,
    public displayName: DisplayName
  ) { }
}