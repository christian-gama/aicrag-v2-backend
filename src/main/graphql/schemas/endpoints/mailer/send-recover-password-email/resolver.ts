/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeSendRecoverPasswordEmailController } from '@/main/factories/controllers/mailer'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Mutation: {
    sendRecoverPasswordEmail: async (_, args, context) =>
      await resolverAdapter(makeSendRecoverPasswordEmailController(), args, context)
  }
}
