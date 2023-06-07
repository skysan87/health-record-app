import { Activity } from "../src/Domain/Model/Activity"

// Sample
const activity = new Activity(
  '123'
)
console.log(activity)
const updateParams = {
  total: 1
}

const data = { ...activity, ...updateParams } as Activity
console.log(data)
