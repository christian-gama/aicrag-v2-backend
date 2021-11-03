/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeSendWelcomeEmailController } from '@/main/factories/controllers/mailer'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Mutation: {
    sendWelcomeEmail: async (_, args, context) => await resolverAdapter(makeSendWelcomeEmailController(), args, context)
  }
}
