import { Todo } from "@/app"
import { toggleTask } from "@/utils/AsyncStorage"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useRef, useState } from "react"
import { Pressable, Text, View } from "react-native"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import { useRouter } from "expo-router"

const TodoBox = ({
  todo,
  refresh,
}: {
  todo: Todo
  refresh: () => Promise<void>
}) => {
  const [status, setStatus] = useState<boolean>(todo.status)

  const isLongPressing = useRef<boolean>(false)
  const router = useRouter()

  const handlePress = async () => {
    if (!isLongPressing.current) {
      const id = todo.id
      toggleTask(id)
      setStatus((x) => !x)
    }
    isLongPressing.current = false
  }

  const handleUpdate = async (e: any) => {
    router.push({ pathname: "/todo/[id]", params: { id: todo.id } })
    isLongPressing.current = true
  }

  return (
    <Pressable
      onPressOut={handlePress}
      onLongPress={handleUpdate}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "stretch",
        backgroundColor: "#fff",
        margin: 8,
        // borderWidth : 1,
        borderRadius: 10,
        height: 80,
        padding: 10,

        // android shadow
        elevation: 5,

        //ios shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        {status ? (
          <Ionicons name="checkbox" size={24} color="black" />
        ) : (
          <Ionicons name="checkbox-outline" size={24} color="black" />
        )}
        <View>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 18,
              color: "rgb(41, 41, 41)",
            }}
          >
            {todo.name}
          </Text>
          <Text
            style={{
              fontSize: 10,
              paddingLeft: 5,
              color: "rgb(151, 151, 151)",
            }}
          >
            {todo.finishBy.toLocaleString("default", { timeStyle: "short" })},{" "}
            {todo.finishBy.toLocaleString("default", { dateStyle: "long" })}
          </Text>
        </View>
      </View>
      <Pressable
        style={{
          width: 30,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ddd",
        }}
        onPressOut={handleUpdate}
      >
        <FontAwesome6 name="edit" size={18} color="black" />
      </Pressable>
    </Pressable>
  )
}

export default TodoBox
