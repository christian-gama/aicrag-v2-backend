import { IUser } from '..'

/**
 * @description Interface that contains the necessary data to create a task.
 */
export interface ITaskData {
  commentary: string | null
  date: Date
  duration: number
  status: 'in_progress' | 'completed'
  taskId: string | null
  type: 'QA' | 'TX'
  user: IUser
}
