/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { apolloControllerAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'
import { isProtected } from '@/main/graphql/utils'

import { makeUpdateUserController } from '@/factories/controllers/account'

export const resolver: Resolvers = {
  Mutation: {
    updateUser: async (_, args, context) => {
      isProtected(context)

      const response = await apolloControllerAdapter(makeUpdateUserController(), args, context)

      return response
    }
  },
  UpdateUserHasChanges: {
    __isTypeOf: (obj) => {
      return obj.user !== undefined
    }
  },
  UpdateUserNoChanges: {
    __isTypeOf: (obj) => {
      return obj.message !== undefined
    }
  }
}
