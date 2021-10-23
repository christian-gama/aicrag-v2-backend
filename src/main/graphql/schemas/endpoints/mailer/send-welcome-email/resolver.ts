/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeSendWelcomeEmailController } from '@/factories/controllers/mailer'

export const resolver: Resolvers = {
  Mutation: {
    sendWelcomeEmail: async (_, args, context) =>
      await resolverAdapter(makeSendWelcomeEmailController(), args, context)
  }
}
