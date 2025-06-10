import { Pressable, View, Text } from "react-native"

const Dropdown = ({ id }: { id: string }) => {
  return (
    <View 
    style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    }}>
      <View
        style={{
          width: 140,
          backgroundColor: "#fff",
          borderWidth: 1,
          borderRadius: 10,
          right: 0,
          top: 20,
          zIndex: 100,
        }}
      >
        <Pressable>
          <Text>Mark as Done</Text>
        </Pressable>
        <Pressable>
          <Text>Delete</Text>
        </Pressable>
        <Pressable>
          <Text>Update</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Dropdown
