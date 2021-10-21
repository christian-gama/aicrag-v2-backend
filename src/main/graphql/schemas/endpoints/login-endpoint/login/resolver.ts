/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { apolloControllerAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeLoginController } from '@/factories/controllers/login'

export const resolver: Resolvers = {
  ActiveAccount: {
    __isTypeOf: (obj) => {
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
  Mutation: {
    login: async (_, args, context) => {
      const response = await apolloControllerAdapter(makeLoginController(), args, context)

      return response
    }
  }
}
