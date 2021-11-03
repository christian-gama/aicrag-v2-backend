/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeLogoutController } from '@/main/factories/controllers/account'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Mutation: {
    logout: async (_, args, context) => await resolverAdapter(makeLogoutController(), args, context)
  }
}
