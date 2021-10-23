/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeGetInvoiceByMonthController } from '@/factories/controllers/invoice'

export const resolver: Resolvers = {
  Query: {
    getInvoiceByMonth: async (_, args, context) =>
      await resolverAdapter(makeGetInvoiceByMonthController(), args, context)
  }
}
