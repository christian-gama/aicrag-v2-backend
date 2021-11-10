import { MongoQueries } from '@/infra/adapters/database/mongodb/mongo-queries'
import { QueryMethodsProtocol } from '@/infra/database/protocols/queries.model'

export const makeMongoQueries = (): QueryMethodsProtocol => {
  return new MongoQueries()
}
