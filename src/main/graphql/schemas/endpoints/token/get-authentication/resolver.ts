/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeGetAuthenticationController } from '@/main/factories/controllers/token'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  GetAuthenticationNone: {
    __isTypeOf: (obj) => {
      return (
        typeof (obj as any).authentication !== 'undefined' &&
        typeof (obj as any).accessToken === 'undefined' &&
        typeof (obj as any).refreshToken === 'undefined'
      )
    },
    authentication: ({ authentication }) => {
      return authentication
    }
  },

  GetAuthenticationPartial: {
    __isTypeOf: (obj) => {
      return (
        typeof obj.authentication !== 'undefined' &&
        typeof obj.accessToken !== 'undefined' &&
        typeof (obj as any).refreshToken === 'undefined'
      )
    },
    accessToken: ({ accessToken }) => {
      return accessToken
    },
    authentication: ({ authentication }) => {
      return authentication
    }
  },

  GetAuthenticationProtected: {
    __isTypeOf: (obj) => {
      return (
        typeof obj.user !== 'undefined' &&
        typeof obj.refreshToken !== 'undefined' &&
        typeof obj.accessToken !== 'undefined'
      )
    },
    accessToken: ({ accessToken }) => {
      return accessToken
    },
    authentication: ({ authentication }) => {
      return authentication
    },
    refreshToken: ({ refreshToken }) => {
      return refreshToken
    },
    user: ({ user }) => {
      return user
    }
  },

  Query: {
    getAuthentication: async (_, args, context) =>
      await resolverAdapter(makeGetAuthenticationController(), args, context)
  }
}
