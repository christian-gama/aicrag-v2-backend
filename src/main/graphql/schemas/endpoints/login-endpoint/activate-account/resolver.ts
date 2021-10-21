/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { apolloControllerAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeActivateAccountController } from '@/factories/controllers/login'

export const resolver: Resolvers = {
  ActivateAccount: {
    __isTypeOf: (obj) => {
      return typeof obj.data.user !== 'undefined'
    },
    data: ({ data }) => {
      return data
    },
    status: ({ status }) => {
      return status
    },
    statusCode: ({ statusCode }) => {
      return statusCode
    }
  },
  ActivateAccountData: {
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
    activateAccount: async (_, args, context) => await apolloControllerAdapter(makeActivateAccountController(), args, context)
  }
}
