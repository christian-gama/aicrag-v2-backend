import { ITask } from '@/domain'

type Logs<T extends keyof ITask> = {
  [Property in keyof Partial<ITask['logs']> as `${T}.${Property}`]: ITask['logs'][Property]
}

type Date<T extends keyof ITask> = {
  [Property in keyof Partial<ITask['date']> as `${T}.${Property}`]: ITask['date'][Property]
}

export type TaskDbFilter = Logs<'logs'> | Date<'date'> | Partial<ITask>
