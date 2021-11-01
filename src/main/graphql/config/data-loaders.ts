import { IUser } from '@/domain'

import { makeUserRepository } from '@/factories/repositories'

import DataLoader from 'dataloader'

const userBatch = async (ids): Promise<IUser[]> => {
  const users = (await makeUserRepository().findAllById(ids, {})).documents

  const map = ids.map((id) => users.find((user) => user.personal.id === id))

  return map
}

export const makeUserDataLoader = (): DataLoader<string, IUser | null, string> => {
  return new DataLoader(userBatch)
}
