/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { apolloControllerAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeVerifyResetPasswordTokenController } from '@/factories/controllers/token'

export const resolver: Resolvers = {
  Mutation: {
    verifyResetPasswordToken: async (_, args, context) => {
      const response = await apolloControllerAdapter(makeVerifyResetPasswordTokenController(), args, context)

      return response
    }
  }
}
