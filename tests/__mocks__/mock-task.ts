import { ITaskData } from '@/domain'

import { makeFakeUser } from '.'

import faker from 'faker'

export const makeFakeTaskData = (): ITaskData => {
  return {
    commentary: faker.lorem.words(10),
    date: new Date(Date.now()),
    duration: 30,
    taskId: faker.datatype.uuid(),
    type: 'TX',
    user: makeFakeUser()
  }
}
