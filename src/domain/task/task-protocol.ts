import { IUser } from '..'

export interface ITask {
  commentary: string | null
  date: {
    day: number
    full: Date
    hours: string
    month: number
    year: number
  }
  duration: number
  id: string
  logs: {
    createdAt: Date
    updatedAt: Date | null
  }
  taskId: string | null
  type: 'QA' | 'TX'
  user: IUser
}
