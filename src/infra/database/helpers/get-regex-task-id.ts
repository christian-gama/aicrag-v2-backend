import { replaceQuerySpecials } from './replace-query-specials'

export const getRegexTaskId = (taskId: string | undefined): Record<string, any> | null => {
  if (taskId) {
    if (taskId === '--') return { $ne: false }

    const regex = new RegExp(replaceQuerySpecials(taskId), 'g')
    return { $regex: regex }
  }

  return { $ne: false }
}
