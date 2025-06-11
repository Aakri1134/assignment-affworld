import { Pressable, View, Text } from "react-native"

/* This is a general use modal, which shows a message and gives to options, Confirm or Cancel
Cancel - Simply hides the modal
Confirm - hides the modal and calls the callback function sent as props
*/

const ConfirmModal = ({
  message,
  callback,
  setVisible,
}: {
  message: string
  callback: () => void | Promise<void>
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <Pressable
      style={{
        position: "absolute",
        inset: 0,
        flex: 1,
        zIndex: 100,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPressOut={() => {
        setVisible(false)
      }}
    >
      <Pressable
        onPressOut={(e) => {
          e.stopPropagation()
        }}
        style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          width: 350,
          height: 150,
          display: "flex",
          justifyContent: "space-between",
          padding: 15,
          marginBottom: 40,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "500",
          }}
        >
          {message}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 25,
          }}
        >
          <Pressable
            onPressIn={() => {
              setVisible(false)
            }}
            style={{}}
          >
            <Text style={{ fontWeight: "600", fontSize: 17, padding: 15 }}>
              Cancel
            </Text>
          </Pressable>
          <Pressable
            onPressIn={() => {
              setVisible(false)
              callback()
            }}
          >
            <Text style={{ fontWeight: "600", fontSize: 17, padding: 15 }}>
              Confirm
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Pressable>
  )
}

export default ConfirmModal
