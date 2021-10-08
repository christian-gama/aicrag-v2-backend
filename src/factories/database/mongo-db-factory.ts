import { MongoAdapter } from '@/infra/adapters/database/mongodb'
import { DatabaseProtocol } from '@/infra/database/protocols'

import { makeMongoQueries } from './mongo-queries-factory'

export const makeMongoDb = (): DatabaseProtocol => {
  const mongoQueries = makeMongoQueries()

  return new MongoAdapter(mongoQueries)
}
