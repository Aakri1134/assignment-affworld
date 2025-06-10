import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useEffect } from "react"
import { Pressable, Text, View } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { deleteTodo } from "@/utils/AsyncStorage"

const Edit = () => {
  const { id } = useLocalSearchParams()

  const navigation = useNavigation()
  const router = useRouter()

  const handelDelete = async () => {
    deleteTodo(id as string)
    router.dismiss()
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPressOut={handelDelete}>
          <MaterialIcons name="delete" size={24} color="rgb(208, 0, 0)" />
        </Pressable>
      ),
    })
  }, [])

  return (
    <View>
      <Text>{id}</Text>
    </View>
  )
}

export default Edit
