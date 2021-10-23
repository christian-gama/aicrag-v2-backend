/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeVerifyResetPasswordTokenController } from '@/factories/controllers/token'

export const resolver: Resolvers = {
  Mutation: {
    verifyResetPasswordToken: async (_, args, context) =>
      await resolverAdapter(makeVerifyResetPasswordTokenController(), args, context)
  }
}
