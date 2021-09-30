import { MongoAdapter } from '@/infra/adapters/database'
import { DatabaseProtocol } from '@/infra/database/protocols'

export const makeMongoDb = (): DatabaseProtocol => {
  return new MongoAdapter()
}
