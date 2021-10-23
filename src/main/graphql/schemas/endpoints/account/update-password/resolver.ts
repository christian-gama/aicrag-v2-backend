/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeUpdatePasswordController } from '@/factories/controllers/account'

export const resolver: Resolvers = {
  Mutation: {
    updatePassword: async (_, args, context) =>
      await resolverAdapter(makeUpdatePasswordController(), args, context)
  }
}
