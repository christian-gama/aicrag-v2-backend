/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { apolloControllerAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'
import { isProtected } from '@/main/graphql/utils'

import { makeUpdateEmailByCodeController } from '@/factories/controllers/account'

export const resolver: Resolvers = {
  Mutation: {
    updateEmailByCode: async (_, args, context) => {
      isProtected(context)

      const response = await apolloControllerAdapter(
        makeUpdateEmailByCodeController(),
        args,
        context
      )

      return response
    }
  }
}
