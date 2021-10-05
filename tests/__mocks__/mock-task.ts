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

export const makeFakeTask = (fakeUser: IUser): ITask => {
  const date = new Date(Date.now())

  return {
    commentary: faker.lorem.words(10),
    date: {
      day: date.getDate(),
      full: date,
      hours: date.toLocaleTimeString(),
      month: date.getMonth(),
      year: date.getFullYear()
    },
    duration: 30,
    id: faker.datatype.uuid(),
    logs: {
      createdAt: date,
      updatedAt: null
    },
    status: 'completed',
    taskId: faker.datatype.uuid(),
    type: 'TX',
    usd: (30 / 60) * 65 * fakeUser.settings.handicap,
    userId: fakeUser.personal.id
  }
}
