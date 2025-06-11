import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { Todo } from "@/app"

// initializes the notification system, by asking notification permission
export const registerForPushNotificationAsync = async () => {
  if (!Device.isDevice) return

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== "granted") {
    return
  }
}

// global handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

// Function to schedule new notification, called during update, status toggle, and creation of todo
export async function scheduleTodoNotification(todo: {
  finishBy: Date
  name: string
}) {
  const triggerDate = new Date(Number(todo.finishBy) - 7 * 60 * 1000)
  console.log("Notification schedules trigerred")

  console.log("Notification schedules at")
  console.log(triggerDate.toLocaleString("default", { timeStyle: "long" }))
  console.log("Current Time")
  console.log(new Date().toLocaleString("default", { timeStyle: "long" }))
  if (triggerDate <= new Date()) return null
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Todo Reminder",
      body: `⏰ ${todo.name} is due now!`,
      sound: true,
    },
    //@ts-ignore
    trigger: {
      type: "date",
      date: triggerDate,
    },
  })
  return id
}

// Function to cancel notification using ID
export async function cancelTodoNotification(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id)
}
