/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { apolloControllerAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'
import { isProtected } from '@/main/graphql/utils'

import { makeGetAllInvoicesController } from '@/factories/controllers/invoice'

export const resolver: Resolvers = {
  Query: {
    getAllInvoices: async (_, args, context) => {
      isProtected(context)

      const response = await apolloControllerAdapter(makeGetAllInvoicesController(), args, context)

      return response
    }
  }
}
