import { Stack } from "expo-router"

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "My Tasks",
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="todo/[id]"
        options={{
          headerTitle: "Edit Todo",
        }}
      />
    </Stack>
  )
}
