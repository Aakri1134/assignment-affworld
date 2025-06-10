import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { deleteTodo, getTodoID, updateTodoID } from "@/utils/AsyncStorage"
import { Todo } from ".."
import ConfirmModal from "@/components/ConfirmModal"

const Edit = () => {
  const { id }: { id: string } = useLocalSearchParams()

  const [todo, setTodo] = useState<Todo>()
  const [name, setName] = useState<string>("")
  const [info, setInfo] = useState<string>("")
  const [date, setDate] = useState<Date>(todo?.finishBy ?? new Date())
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false)
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date")
  const [updateModal, setUpdateModal] = useState<boolean>(false)
  const [deleteModal, setDeleteModal] = useState<boolean>(false)

  const handleSave = async () => {
    if (!deleteModal) setUpdateModal(true)
  }

  const updateData = async () => {
    await updateTodoID(id as string, {
      id: id,
      name: name.trim(),
      info: info.trim(),
      createdAt: todo ? todo.createdAt : new Date(),
      updatedAt: new Date(),
      finishBy: date,
      completedAt: todo ? todo.completedAt : null,
      status: todo ? todo.status : false,
    })
    router.dismiss()
  }

  const navigation = useNavigation()
  const router = useRouter()

  const handelDelete = () => {
    if (!updateModal) setDeleteModal(true)
    else return
  }

  const deleteData = async () => {
    deleteTodo(id as string)
    router.dismiss()
  }

  useEffect(() => {
    setName(todo?.name ?? "")
    setInfo(todo?.info ?? "")
    setDate(todo?.finishBy ?? new Date())
  }, [todo])

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPressOut={handelDelete}>
          <Text style={{ color: "rgb(208, 0, 0)", fontWeight: "600" }}>
            Delete
          </Text>
        </Pressable>
      ),
    })

    fetchTodo()
  }, [])

  const fetchTodo = async () => {
    const data = await getTodoID(id as string)
    setTodo(data)
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    setShowTimePicker(false)
    if (event.type === "set" && selectedDate) {
      if (pickerMode === "date") {
        const newDate = new Date()
        newDate.setFullYear(selectedDate.getFullYear())
        newDate.setMonth(selectedDate.getMonth())
        newDate.setDate(selectedDate.getDate())
        setDate(newDate)
      } else if (pickerMode === "time") {
        const newDate = new Date()
        newDate.setHours(selectedDate.getHours())
        newDate.setMinutes(selectedDate.getMinutes())
        setDate(newDate)
      }
    }
  }

  const showDatePickerModal = () => {
    setPickerMode("date")
    setShowDatePicker(true)
  }

  const showTimePickerModal = () => {
    setPickerMode("time")
    setShowTimePicker(true)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      {todo ? (
        <View
          style={{
            flex: 1,
            padding: 10,
          }}
        >
          {updateModal && (
            <ConfirmModal
              message="Do you want to save changes?"
              callback={updateData}
              setVisible={setUpdateModal}
            />
          )}
          {deleteModal && (
            <ConfirmModal
              message="Do you want to delete this task?"
              callback={deleteData}
              setVisible={setDeleteModal}
            />
          )}
          <View>
            <Text style={style.inputLabel}>Title:</Text>
            <TextInput
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                elevation: 3,
                // iOS shadow
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
              }}
              placeholder={todo.name}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View>
            <Text style={style.inputLabel}>Description:</Text>
            <TextInput
              placeholder={todo.info}
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                elevation: 3,
                height: 100,
                paddingTop: 10,
                paddingBottom: 10,
                // iOS shadow
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
              }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              returnKeyType="done"
              value={info}
              onChangeText={setInfo}
            />
          </View>
          <View>
            <Text></Text>
            <View
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <Text style={style.inputLabel}>Complete By:</Text>
              <Pressable
                style={style.dateDisplayContainer}
                onPressOut={showDatePickerModal}
              >
                <Text style={style.dateLabel}>Date:</Text>
                <Text style={style.dateValue}>{formatDate(date)}</Text>
              </Pressable>

              <Pressable
                style={style.dateDisplayContainer}
                onPressOut={showTimePickerModal}
              >
                <Text style={style.dateLabel}>Time:</Text>
                <Text style={style.dateValue}>{formatTime(date)}</Text>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>
          </View>
          <Pressable style={style.submitButton} onPress={handleSave}>
            <Text style={style.submitButtonText}>Save Changes</Text>
          </Pressable>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </>
  )
}

export default Edit

const style = {
  inputField: {
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    elevation: 2,
    backgroundColor: "#fff",
    height: 45,
    paddingHorizontal: 10,
    borderColor: "#ddd",
  },
  multilineInput: {
    height: 100,
    paddingTop: 10,
    paddingBottom: 10,
  },
  inputBoxField: {
    borderWidth: 1,
    borderRadius: 5,
    elevation: 2,
    backgroundColor: "#fff",
    height: 50,
    width: 50,
    alignContent: "center" as "center",
    textAlign: "center" as "center",
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "600" as "600",
    color: "#333",
  },
  dateDisplayContainer: {
    flexDirection: "row" as "row",
    justifyContent: "space-between" as "space-between",
    alignItems: "center" as "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "500" as "500",
    color: "#666",
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "600" as "600",
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row" as "row",
    justifyContent: "space-between" as "space-between",
    gap: 10,
  },
  datePickerButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center" as "center",
  },
  halfWidthButton: {
    flex: 1,
  },
  datePickerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600" as "600",
  },
  submitButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center" as "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700" as "700",
  },
}
