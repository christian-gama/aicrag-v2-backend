/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeSendEmailPinController } from '@/main/factories/controllers/mailer'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Mutation: {
    sendEmailPin: async (_, args, context) => await resolverAdapter(makeSendEmailPinController(), args, context)
  }
}
