/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { apolloControllerAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'
import { isProtected } from '@/main/graphql/utils'

import { makeUpdatePasswordController } from '@/factories/controllers/account'

export const resolver: Resolvers = {
  Mutation: {
    updatePassword: async (_, args, context) => {
      isProtected(context)

      const response = await apolloControllerAdapter(makeUpdatePasswordController(), args, context)

      return response
    }
  }
}
