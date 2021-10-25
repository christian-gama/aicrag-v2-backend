import { replaceQuerySpecials } from './replace-query-specials'

export const getRegexTaskId = (taskId: string | undefined): Record<string, any> | null => {
  let result: any = { $ne: false }

  if (taskId) {
    if (taskId === '--') {
      result = { $ne: false }
    } else {
      const regex = new RegExp(replaceQuerySpecials(taskId), 'g')

      result = { $regex: regex }
    }
  }

  return result
}
