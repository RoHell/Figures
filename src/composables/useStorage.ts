import { LocalStorageEnum } from '../types'

export default () => {
  const setStoredItem = (key: LocalStorageEnum, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
  }

  const getStoredItem = (key: LocalStorageEnum) => {
    const storedItem = localStorage.getItem(key)
    if (storedItem) {
      return JSON.parse(storedItem)
    }
  }

  const removeStoredItem = (key: LocalStorageEnum) => {
    localStorage.removeItem(key)
  }

  const clearStorage = () => {
    localStorage.clear()
  }

  return {
    setStoredItem,
    getStoredItem,
    removeStoredItem,
    clearStorage
  }
}
