/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeUpdatePasswordController } from '@/main/factories/controllers/account'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Mutation: {
    updatePassword: async (_, args, context) => await resolverAdapter(makeUpdatePasswordController(), args, context)
  }
}
