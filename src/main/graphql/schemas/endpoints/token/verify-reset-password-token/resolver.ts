/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeVerifyResetPasswordTokenController } from '@/main/factories/controllers/token'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Query: {
    verifyResetPasswordToken: async (_, args, context) =>
      await resolverAdapter(makeVerifyResetPasswordTokenController(), args, context)
  }
}
