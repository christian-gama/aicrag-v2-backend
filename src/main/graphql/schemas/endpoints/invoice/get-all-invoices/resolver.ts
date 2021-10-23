/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeGetAllInvoicesController } from '@/factories/controllers/invoice'

export const resolver: Resolvers = {
  Query: {
    getAllInvoices: async (_, args, context) =>
      await resolverAdapter(makeGetAllInvoicesController(), args, context)
  }
}
