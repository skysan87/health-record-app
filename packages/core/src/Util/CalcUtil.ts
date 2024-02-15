// TODO
// カロリー計算などどこでも利用できるロジックを記載する
// 理由: アプリケーション層でも利用したいから

import { dateDiff } from "./DateUtil"

/**
 * 1日あたりの目標消費カロリーを計算する
 *
 * @param startWeight 開始時の体重
 * @param startDate 開始日
 * @param endWeight 終了時の目標体重
 * @param endDate 終了日
 */
export function calcGoalCaloriePerDay(startWeight: number, startDate: Date, endWeight: number, endDate: Date): number {
  // 1日あたりの消費目標重量(kg)
  const weightPerDay = (startWeight - endWeight) / dateDiff(startDate, endDate, 'day')
  // 脂肪1g=9kcal、脂肪細胞は内80%として計算
  return weightPerDay * 1000 * 9 * 0.8
}