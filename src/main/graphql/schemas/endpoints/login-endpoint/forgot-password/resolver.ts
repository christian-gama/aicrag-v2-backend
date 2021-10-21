/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { apolloControllerAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeForgotPasswordController } from '@/factories/controllers/login'

export const resolver: Resolvers = {
  Mutation: {
    forgotPassword: async (_, args, context) => {
      const response = await apolloControllerAdapter(makeForgotPasswordController(), args, context)

      return response
    }
  }
}
