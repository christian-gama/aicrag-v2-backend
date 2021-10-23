import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { CollectionsName } from '@/infra/database/protocols'

const createIndex = async (asc: 0 | 1, collection: CollectionsName, field: string): Promise<void> => {
  await MongoAdapter.client
    .db()
    .collection(collection)
    .createIndex({ [field]: asc }, { unique: true })
}

export const createIndexes = async (): Promise<void> => {
  await createIndex(1, 'tasks', 'id')
  await createIndex(1, 'users', 'personal.email')
  await createIndex(1, 'users', 'personal.id')
}
