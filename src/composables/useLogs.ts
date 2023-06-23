import { ref } from 'vue'

import {
  LocalStorageEnum,
  QuestLogsEnum,
  type QuestLog,
  type QuestStorageType,
} from '../types'

import { getParsedProxy } from '../utils'

import { useStorage } from '.'

const logs = ref<QuestStorageType>({
  [QuestLogsEnum.KILLERS]: [],
  [QuestLogsEnum.FAILS]: [],
})

export default () => {
  const { setStoredItem, getStoredItem } = useStorage()

  const setLog = async(questLog: QuestLog) => {
    await fetchLogs()
    updateLogs(questLog)
    setStoredItem(LocalStorageEnum.QUEST_LOGS, logs.value)
  }

  const updateLogs = ({name, value}: QuestLog) => {
    const logsValues = getParsedProxy(logs.value)[name] || []
    const logValue = getParsedProxy(value)
    logs.value[name] = [...logsValues, logValue]
  }

  const fetchLogs = () => {
    logs.value = getStoredItem(LocalStorageEnum.QUEST_LOGS) || {}
  }
  return {
    setLog,
    fetchLogs,
    logs,
  }
}