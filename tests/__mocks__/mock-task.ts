import { ITask, ITaskData, IUser } from '@/domain'
import faker from 'faker'

export const makeFakeTaskData = (fakeUser: IUser): ITaskData => {
  return {
    commentary: faker.lorem.words(10),
    date: new Date(Date.now()).toString(),
    duration: 30,
    status: 'completed',
    taskId: faker.datatype.uuid(),
    type: 'TX',
    user: fakeUser
  }
}

export const makeFakeTask = (fakeUser: IUser, taskProperty?: Record<string, any>): ITask => {
  const date = faker.date.recent(Math.random() * 27)
  const duration = Math.round(Math.random() * 30 * 100) / 100

  return {
    commentary: faker.lorem.words(10),
    date: {
      day: date.getUTCDate(),
      full: date,
      hours: date.toLocaleTimeString('pt-br', { timeZone: 'UTC' }),
      month: date.getUTCMonth(),
      year: date.getUTCFullYear()
    },
    duration,
    id: faker.datatype.uuid(),
    logs: {
      createdAt: date,
      updatedAt: null
    },
    status: 'completed',
    taskId: faker.datatype.uuid(),
    type: 'TX',
    usd: Math.round((duration / 60) * 65 * fakeUser.settings.handicap * 100) / 100,
    user: fakeUser.personal.id,
    ...taskProperty
  }
}
