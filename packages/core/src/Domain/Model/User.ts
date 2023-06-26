import { DisplayName, UserId, Mail } from "../ValueObject"

export class User {
  constructor(
    public id: UserId,
    public email: Mail,
    public displayName: DisplayName
  ) { }
}