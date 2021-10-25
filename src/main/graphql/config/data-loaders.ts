import { IUser } from '@/domain'

import { makeUserRepository } from '@/factories/repositories'

import DataLoader from 'dataloader'

export const makeUserDataLoader = (): DataLoader<string, IUser | null, string> => {
  return new DataLoader(async (ids: string[]) => {
    return await Promise.all(ids.map(async (id) => await makeUserRepository().findById(id)))
  })
}
