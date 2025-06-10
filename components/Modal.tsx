import { Todo } from '@/app'
import { storeTodo } from '@/utils/AsyncStorage'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useRef, useState } from "react"
import { Alert, Pressable, Text, TextInput, View } from "react-native"


type ModalProps = {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Modal({ setVisible }: ModalProps) {
  const nameInput = useRef<TextInput>(null)
  const infoInput = useRef<TextInput>(null)

  const [name, setName] = useState<string>("")
  const [info, setInfo] = useState<string>("")
  const [date, setDate] = useState<Date>(new Date())
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false)
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date')

  const handleSubmit = async () => {
    if(name === ""){
      Alert.alert("Title cannot be empty!")
      return;
    }
    if(date < new Date(Number(new Date()) - 10*60*1000)){
      Alert.alert("Invalid Date")
      return;
    }
    const data : Todo = {
      id: name + date.toString(),
      name,
      info : info.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      finishBy: new Date(date),
      completedAt: null,
      status: false
    }
    const res = await storeTodo(data)
    if(res === "error"){
      Alert.alert("Error ocurred while saving")
    }
    else setVisible(false)
    return;
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    setShowTimePicker(false)
    if (event.type === 'set' && selectedDate) {
      if (pickerMode === 'date') {
        const newDate = new Date(date)
        newDate.setFullYear(selectedDate.getFullYear())
        newDate.setMonth(selectedDate.getMonth())
        newDate.setDate(selectedDate.getDate())
        setDate(newDate)
      } else if (pickerMode === 'time') {
        const newDate = new Date(date)
        newDate.setHours(selectedDate.getHours())
        newDate.setMinutes(selectedDate.getMinutes())
        setDate(newDate)
      }
    }
  }

  const showDatePickerModal = () => {
    setPickerMode('date')
    setShowDatePicker(true)
  }

  const showTimePickerModal = () => {
    setPickerMode('time')
    setShowTimePicker(true)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Pressable
      style={{
        inset: 0,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "absolute",
        zIndex: 10,
      }}
      onPressOut={() => {
        setVisible(false)
      }}
    >
      <Pressable
        style={{
          backgroundColor: "rgb(255, 255, 255)",
          width: 350,
          borderWidth: 1,
          marginBottom: 60,
          borderRadius: 10,
          display: "flex",
          padding: 20,
          justifyContent: "flex-start",
          alignItems: "stretch",
          gap: 15,
        }}
        onPressOut={(e) => {
          e.stopPropagation()
        }}
      >
        <View
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <Text style={style.inputLabel}>Title</Text>
          <TextInput
            ref={nameInput}
            placeholder="Enter title"
            style={style.inputField}
            returnKeyType="next"
            value={name}
            onChangeText={setName}
            onSubmitEditing={() => {
              infoInput.current?.focus()
            }}
          />
        </View>
        <View
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <Text style={style.inputLabel}>Info</Text>
          <TextInput
            ref={infoInput}
            placeholder="Enter detailed information..."
            style={[style.inputField, style.multilineInput]}
            returnKeyType="done"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            value={info}
            onChangeText={setInfo}
          />
        </View>
        <View
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <Text style={style.inputLabel}>Date & Time</Text>
          <Pressable style={style.dateDisplayContainer} onPressOut={showDatePickerModal}>
            <Text style={style.dateLabel}>Date:</Text>
            <Text style={style.dateValue}>{formatDate(date)}</Text>
          </Pressable>
          
          <Pressable style={style.dateDisplayContainer} onPressOut={showTimePickerModal}>
            <Text style={style.dateLabel}>Time:</Text>
            <Text style={style.dateValue}>{formatTime(date)}</Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              testID="datePicker"
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={date}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>

        <Pressable
          style={style.submitButton}
          onPress={handleSubmit}
        >
          <Text style={style.submitButtonText}>Submit</Text>
        </Pressable>
      </Pressable>
    </Pressable>
  )
}

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
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
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