/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { apolloControllerAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'
import { isPartialProtected } from '@/main/graphql/utils/is-partial-protected'

import { makeActivateAccountController } from '@/factories/controllers/login'

export const resolver: Resolvers = {
  ActivateAccount: {
    __isTypeOf: (obj) => {
      return obj.user !== undefined
    },
    accessToken: ({ accessToken }) => {
      return accessToken
    },
    refreshToken: ({ refreshToken }) => {
      return refreshToken
    },
    user: ({ user }) => {
      return user
    }
  },
  Mutation: {
    activateAccount: async (_, args, context) => {
      isPartialProtected(context)

      const response = await apolloControllerAdapter(makeActivateAccountController(), args, context)

      return response
    }
  }
}
