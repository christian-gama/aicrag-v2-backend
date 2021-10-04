import { ITask, ITaskData } from '@/domain'

import { makeFakeUser } from '.'

import faker from 'faker'

export const makeFakeTaskData = (): ITaskData => {
  return {
    commentary: faker.lorem.words(10),
    date: new Date(Date.now()),
    duration: 30,
    status: 'completed',
    taskId: faker.datatype.uuid(),
    type: 'TX',
    user: makeFakeUser()
  }
}

export const makeFakeTask = (): ITask => {
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
    user: makeFakeUser()
  }
}
