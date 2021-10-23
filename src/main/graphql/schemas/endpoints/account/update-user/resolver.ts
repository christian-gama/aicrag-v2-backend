/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeUpdateUserController } from '@/factories/controllers/account'

export const resolver: Resolvers = {
  Mutation: {
    updateUser: async (_, args, context) =>
      await resolverAdapter(makeUpdateUserController(), args, context)
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
