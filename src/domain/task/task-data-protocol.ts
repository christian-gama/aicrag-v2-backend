import { IUser } from '..'

export interface ITaskData {
  commentary: string | null
  date: Date
  duration: number
  status: 'in_progress' | 'completed'
  taskId: string | null
  type: 'QA' | 'TX'
  user: IUser
}
