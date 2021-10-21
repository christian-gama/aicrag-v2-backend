/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { apolloControllerAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'
import { isPartialProtected } from '@/main/graphql/utils/is-partial-protected'

import { makeResetPasswordController } from '@/factories/controllers/login'

export const resolver: Resolvers = {
  Mutation: {
    resetPassword: async (_, args, context) => {
      isPartialProtected(context)

      const response = await apolloControllerAdapter(makeResetPasswordController(), args, context)

      return response
    }
  }
}
