import { Todo } from "@/app"
import AsyncStorage from "@react-native-async-storage/async-storage"

const key = "Todo"

let cachedData: Todo[] = []

export async function storeTodo(todo: Todo) {
  try {
    cachedData = [...cachedData, todo]
    AsyncStorage.setItem(key, JSON.stringify(cachedData))
  } catch (e) {
    return "error"
  }
}

export function deleteTodo(id: string) {
  try {
    const res = cachedData.filter((todo: Todo) => {
      if (todo.id === id) return false
      return true
    })
    cachedData = res
    AsyncStorage.setItem(key, JSON.stringify(res))
    return res
  } catch (e) {
    console.log(e)
    return "error"
  }
}

export async function getTodos() {
  return cachedData
}

export async function initialize() {
  try {
    const data = await AsyncStorage.getItem(key)
    if (data) {
      cachedData = JSON.parse(data)
      cachedData.map((todo) => {
        if(todo.completedAt) todo.completedAt = new Date(todo.completedAt)
        todo.createdAt = new Date(todo.createdAt)
        todo.finishBy = new Date(todo.finishBy)
        todo.updatedAt = new Date(todo.updatedAt)
      })
    } else cachedData = []
  } catch (err) {
    console.log("error ocurred")
    console.log(err)
    cachedData = []
  }
}

export async function toggleTask(id: string) {
  try {
    cachedData.map((todo) => {
      if (todo.id === id) {
        todo.status = !todo.status
      }
    })
    AsyncStorage.setItem(key, JSON.stringify(cachedData))
  } catch (e) {
    console.log(e)
  }
}

export async function dev_PRINT_DATA() {
  try {
    const data = JSON.parse((await AsyncStorage.getItem(key)) || "[]")
    console.log(data)
    console.log(cachedData)
    console.log(JSON.stringify(data) === JSON.stringify(cachedData))
  } catch (e) {
    console.log(e)
  }
}

export async function getTodoID(id: string) {
    const res = cachedData.find((todo: Todo)=>{
        return todo.id === id
    })
    return res
}

export async function updateTodoID(id: string, newTodo: Todo) {
    const index = cachedData.findIndex((todo: Todo) => todo.id === id)
    if (index !== -1) {
        cachedData[index] = newTodo
        await AsyncStorage.setItem(key, JSON.stringify(cachedData))
    }
}
