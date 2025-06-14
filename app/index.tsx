import Modal from "@/components/Modal"
import TodoBox from "@/components/TodoBox"
import { getTodos, initialize } from "@/utils/AsyncStorage"
import {
  registerForPushNotificationAsync,
  scheduleTodoNotification,
} from "@/utils/NotificationHandler"
import { usePathname } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { Pressable, ScrollView, Text, View } from "react-native"

export type Todo = {
  id: string
  name: string
  info: string
  createdAt: Date
  updatedAt: Date
  finishBy: Date
  completedAt: Date | null
  status: boolean
  priority: "high" | "medium" | "low"
  notificationId: string | null
}

/*
  Type definition
  
  id : unique for each todo,
  name : Title for the todo,
  info : Description for the todo,
  createdAt: Date at which the todo was created at,
  updatedAt: Date at which the todo was last updated at,
  finishBy: Completion date set for the todo,
  completedAt: Date at which the todo was completed at,
  status: Shows whether the todo is completed or not,
  priority: Stores the priority of the todo,
  notificationId: stored to cancel the notifications if required
*/

export default function Index() {
  const [todo, setTodo] = useState<Todo[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [isScrolling, setIsScrolling] = useState<boolean>(false)

  const pathname = usePathname()

  const fetchData = useCallback(async () => {
    try {
      const data = await getTodos()
      setTodo(data)
    } catch (e) {
      setTodo([])
    }
  }, [])

  // to reload/refresh page everytime another page is opened
  useEffect(() => {
    refresh()
  }, [pathname])

  // reloads the home page
  const refresh = useCallback(async () => {
    await initialize()
    await fetchData()
    await registerForPushNotificationAsync()
  }, [])

  // Updates the page when a new task might have been added
  useEffect(() => {
    fetchData()
  }, [visible, fetchData])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "stretch",
        padding: 10,
      }}
    >
      {visible && <Modal setVisible={setVisible} />}
      <ScrollView
        onScrollBeginDrag={() => {
          setIsScrolling(true)
        }}
        onScrollEndDrag={() => {
          setIsScrolling(false)
        }}
        onMomentumScrollEnd={() => {
          setIsScrolling(false)
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {todo && todo.length > 0 ? (
          [
            ...["high", "medium", "low"].map((priority) =>
              todo
                .filter((e: Todo) => !e.status && e.priority === priority)
                .map((e: Todo) => (
                  <TodoBox
                    todo={e}
                    key={e.id}
                    refresh={refresh}
                    isScrolling={isScrolling}
                  />
                ))
            ),
            ...["high", "medium", "low"].map((priority) =>
              todo
                .filter((e: Todo) => e.status && e.priority === priority)
                .map((e: Todo) => (
                  <TodoBox
                    todo={e}
                    key={e.id}
                    refresh={refresh}
                    isScrolling={isScrolling}
                  />
                ))
            ),
          ]
        ) : (
          <Text>No Todos Found</Text>
        )}
      </ScrollView>

      {!visible && (
        <Pressable
          style={{
            width: 70,
            height: 70,
            backgroundColor: "rgb(0, 53, 198)",
            borderRadius: 40,
            position: "absolute",
            right: 20,
            bottom: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // ios
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            // android
            elevation: 3,
          }}
          onPressOut={() => {
            setVisible((x) => !x)
          }}
        >
          <Text
            style={{
              fontSize: 35,
              fontWeight: "400",
              color: "rgb(255, 255, 255)",
            }}
          >
            +
          </Text>
        </Pressable>
      )}
    </View>
  )
}
