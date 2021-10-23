/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeSendForgotPasswordEmailController } from '@/factories/controllers/mailer'

export const resolver: Resolvers = {
  Mutation: {
    sendForgotPasswordEmail: async (_, args, context) =>
      await resolverAdapter(makeSendForgotPasswordEmailController(), args, context)
  }
}
