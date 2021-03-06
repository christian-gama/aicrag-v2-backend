/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeActivateAccountController } from '@/main/factories/controllers/login'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

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
    activateAccount: async (_, args, context) => await resolverAdapter(makeActivateAccountController(), args, context)
  }
}
