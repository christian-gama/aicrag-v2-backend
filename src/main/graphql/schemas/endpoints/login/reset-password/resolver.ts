/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeResetPasswordController } from '@/factories/controllers/login'

export const resolver: Resolvers = {
  Mutation: {
    resetPassword: async (_, args, context) =>
      await resolverAdapter(makeResetPasswordController(), args, context)
  }
}
