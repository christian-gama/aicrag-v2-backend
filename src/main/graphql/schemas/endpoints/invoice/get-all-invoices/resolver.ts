/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeGetAllInvoicesController } from '@/main/factories/controllers/invoice'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Query: {
    getAllInvoices: async (_, args, context) => await resolverAdapter(makeGetAllInvoicesController(), args, context)
  }
}
