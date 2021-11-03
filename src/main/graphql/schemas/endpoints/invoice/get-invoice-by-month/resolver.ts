/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeGetInvoiceByMonthController } from '@/main/factories/controllers/invoice'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Query: {
    getInvoiceByMonth: async (_, args, context) =>
      await resolverAdapter(makeGetInvoiceByMonthController(), args, context)
  }
}
