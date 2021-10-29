import { getRegexTaskId } from '@/infra/database/helpers/get-regex-task-id'

describe('getRegexTaskId', () => {
  it('should return { $ne: false } if taskId is --', () => {
    const taskId = '--'
    const result = getRegexTaskId(taskId)

    expect(result).toStrictEqual({ $ne: false })
  })

  it('should return { $ne: false } if there is no taskId', () => {
    const taskId = undefined
    const result = getRegexTaskId(taskId)

    expect(result).toStrictEqual({ $ne: false })
  })

  it('should return { $regex: valid_task_id } if there is a valid taskId', () => {
    const taskId = 'valid_task_id'

    const result = getRegexTaskId(taskId)

    expect(result).toStrictEqual({ $regex: /valid_task_id/g })
  })
})
