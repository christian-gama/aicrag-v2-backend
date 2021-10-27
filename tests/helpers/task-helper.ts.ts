import { ITask, IUser } from '@/domain'

import { ICollectionMethods } from '@/infra/database/protocols'

import { makeFakeTask } from '../__mocks__'

export const taskHelper = {
  insertTask: async (
    collection: ICollectionMethods,
    user: IUser,
    taskProperty: Record<string, any>
  ): Promise<ITask> => {
    const fakeTask = makeFakeTask(user, taskProperty)
    await collection.insertOne(fakeTask)

    return fakeTask
  }
}
