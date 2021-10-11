import { InvoiceRepository } from '@/infra/database/repositories'

import { makeMongoDb } from '../database/mongo-db-factory'

export const makeInvoiceRepository = (): InvoiceRepository => {
  const database = makeMongoDb()

  return new InvoiceRepository(database)
}
