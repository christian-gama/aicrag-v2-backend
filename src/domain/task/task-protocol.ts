import { IUser } from '..'

export interface TaskProtocol {
  commentary: string | null
  date: {
    day: string
    full: Date
    hours: string
    month: string
    year: string
  }
  duration: number
  id: string
  taskId: string | null
  type: 'QA' | 'TX'
  user: IUser
}
