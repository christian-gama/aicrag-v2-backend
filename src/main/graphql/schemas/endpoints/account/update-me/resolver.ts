/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeUpdateMeController } from '@/main/factories/controllers/account'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Mutation: {
    updateMe: async (_, args, context) => await resolverAdapter(makeUpdateMeController(), args, context)
  },
  UpdateMeHasChanges: {
    __isTypeOf: (obj) => {
      return obj.user !== undefined
    }
  },
  UpdateMeNoChanges: {
    __isTypeOf: (obj) => {
      return obj.message !== undefined
    }
  }
}
