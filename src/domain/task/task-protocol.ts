/**
 * @description Interface for a task.
 */
export interface ITask {
  commentary: string
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
  status: 'in_progress' | 'completed'
  taskId: string
  type: 'QA' | 'TX'
  usd: number
  userId: string
}
