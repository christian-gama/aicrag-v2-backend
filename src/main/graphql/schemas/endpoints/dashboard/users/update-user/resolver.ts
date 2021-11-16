/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeUpdateUserController } from '@/main/factories/controllers/dashboard/users'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Mutation: {
    updateUser: async (_, args, context) => await resolverAdapter(makeUpdateUserController(), args, context)
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
