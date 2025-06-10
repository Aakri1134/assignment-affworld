import Modal from "@/components/Modal"
import { dev_PRINT_DATA, getTodos, initialize, toggleTask } from "@/utils/AsyncStorage"
import { useCallback, useEffect, useState } from "react"
import { Pressable, ScrollView, Text, View } from "react-native"
import TodoBox from "@/components/TodoBox";
import { useFocusEffect } from "expo-router";

export type Todo = {
  id: string
  name: string
  info: string
  createdAt: Date
  updatedAt: Date
  finishBy: Date
  completedAt: Date | null
  status : boolean
}

export default function Index() {
  const [todo, setTodo] = useState<Todo[]>([])
  const [visible, setVisible] = useState<boolean>(false)

  const fetchData = useCallback(async () => {
    try {
      const data = await getTodos()
      setTodo(data)
    } catch (e) {
      setTodo([])
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [])

  useFocusEffect(() => {
    refresh()
  })

  const refresh =useCallback( async () => {
    await initialize()
    await fetchData()
  }, [])

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
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}>
          {todo && todo.length > 0 ? (
            todo.map((e: Todo) => {
              return (
                <TodoBox todo={e} key={e.id} refresh={refresh}/>
              )
            })
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
