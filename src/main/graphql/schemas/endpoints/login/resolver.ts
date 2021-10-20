/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { apolloResponseAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeLoginController } from '@/factories/controllers/login'

export const resolver: Resolvers = {
  ActiveAccount: {
    __isTypeOf: (obj) => {
      console.log('ACTIVE', obj)
      return typeof obj.user !== 'undefined'
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
  InactiveAccount: {
    __isTypeOf: (obj) => {
      return typeof (obj as any).user === 'undefined'
    },
    accessToken: ({ accessToken }) => {
      return accessToken
    },
    message: ({ message }) => {
      return message
    }
  },
  Login: {
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
  Mutation: {
    login: async (_, { input }) => await apolloResponseAdapter(makeLoginController(), input)
  }
}
