/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeLogoutController } from '@/factories/controllers/account'

export const resolver: Resolvers = {
  Mutation: {
    logout: async (_, args, context) => await resolverAdapter(makeLogoutController(), args, context)
  }
}
