import { IUser } from '..'

export interface IPartialTask {
  commentary: string | null
  date: Date
  duration: number
  taskId: string | null
  type: 'QA' | 'TX'
  user: IUser
}
