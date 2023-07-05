import { Activity, Activitylist, Health, Healthlist } from "@health-record/core/model";

export const useActivity = () => useState<Activity>('activity', () => null)
export const useActivitylist = () => useState<Activitylist>('activitylist', () => null)
export const useHealth = () => useState<Health>('health', () => null)
export const useHealthlist = () => useState<Healthlist>('healthlist', () => null)