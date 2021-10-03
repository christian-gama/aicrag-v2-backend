import { IUser } from '..'

export interface ITaskData {
  commentary: string | null
  date: Date
  duration: number
  taskId: string | null
  type: 'QA' | 'TX'
  user: IUser
}
