import { MongoQueries } from '@/infra/adapters/database/mongodb/mongo-queries'
import { QueryMethodsProtocol } from '@/infra/database/protocols/queries-protocol'

export const makeMongoQueries = (): QueryMethodsProtocol => {
  return new MongoQueries()
}
