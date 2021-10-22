/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { apolloControllerAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeSendWelcomeEmailController } from '@/factories/controllers/mailer'

export const resolver: Resolvers = {
  Mutation: {
    sendWelcomeEmail: async (_, args, context) => {
      const response = await apolloControllerAdapter(
        makeSendWelcomeEmailController(),
        args,
        context
      )

      return response
    }
  }
}
