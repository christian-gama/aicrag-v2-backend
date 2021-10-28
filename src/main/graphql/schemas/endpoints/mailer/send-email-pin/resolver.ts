/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeSendEmailPinController } from '@/factories/controllers/mailer'

export const resolver: Resolvers = {
  Mutation: {
    sendEmailPin: async (_, args, context) => await resolverAdapter(makeSendEmailPinController(), args, context)
  }
}
