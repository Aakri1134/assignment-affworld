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
  isScrolling,
}: {
  todo: Todo
  refresh: () => Promise<void>
  isScrolling: boolean
}) => {
  const [status, setStatus] = useState<boolean>(todo.status)

  const isLongPressing = useRef<boolean>(false)
  const router = useRouter()

  const handlePress = async () => {
    if (!isLongPressing.current) {
      const id = todo.id
      toggleTask(id)
      setStatus((x) => !x)
      refresh()
    }
    isLongPressing.current = false
  }

  const handleUpdate = async (e: any) => {
    router.push({ pathname: "/todo/[id]", params: { id: todo.id } })
    isLongPressing.current = true
  }

  return (
    <Pressable
      disabled={isScrolling}
      onPress={handlePress}
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
        minHeight: 100,
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
          flex: 1,
          flexDirection: "row",
          alignItems: "stretch",
          gap: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {status ? (
            <Ionicons name="checkbox" size={24} color="rgb(42, 181, 4)" />
          ) : (
            <Ionicons name="checkbox-outline" size={24} color="black" />
          )}
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              fontSize: 18,
              color: "rgb(41, 41, 41)",
              textDecorationLine: todo.status ? "line-through" : "none",
            }}
          >
            <Text
              style={{
                backgroundColor:
                  todo.priority === "high"
                    ? "rgb(193, 0, 0)"
                    : todo.priority === "medium"
                    ? "rgb(222, 229, 0)"
                    : "rgb(17, 173, 0)",
                color: "#fff",
                borderColor: "#000",
              }}
            >
              {" "}{todo.priority.toLocaleUpperCase()}{" "}
            </Text>{" "}{todo.name}
            
          </Text>

          {!todo.status && todo.info && (
            <Text
              style={{
                fontSize: 13,
                color: "rgb(97, 97, 97)",
              }}
            >
              {todo.info.length > 30
                ? todo.info.substring(0, 30) + "..."
                : todo.info}
            </Text>
          )}
          {!todo.status && (
            <Text
              style={{
                fontSize: 10,
                color: "rgb(151, 151, 151)",
              }}
            >
              {todo.finishBy.toLocaleString("default", { timeStyle: "short" })},{" "}
              {todo.finishBy.toLocaleString("default", { dateStyle: "long" })}
            </Text>
          )}
        </View>
      </View>
      <Pressable
        style={{
          width: 30,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={handleUpdate}
      >
        <FontAwesome6 name="edit" size={18} color="black" />
      </Pressable>
    </Pressable>
  )
}

export default TodoBox
