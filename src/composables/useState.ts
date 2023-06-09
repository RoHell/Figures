import { reactive } from 'vue'

const state = reactive<Record<string, any>>({
  isStartingGame: false
})

export default () => {
  const setState = (name: string, value: any): any => state[name] = value
  const getState = (name: string): any => state[name]

  return {
    ...state,
    setState,
    getState
  }
}