import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { IDatabase } from '@/infra/database/protocols'

import { makeMongoQueries } from './mongo-queries-factory'

export const makeMongoDb = (): IDatabase => {
  const mongoQueries = makeMongoQueries()

  return new MongoAdapter(mongoQueries)
}
