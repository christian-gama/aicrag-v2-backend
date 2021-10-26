/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeSendRecoverPasswordEmailController } from '@/factories/controllers/mailer'

export const resolver: Resolvers = {
  Mutation: {
    sendRecoverPasswordEmail: async (_, args, context) =>
      await resolverAdapter(makeSendRecoverPasswordEmailController(), args, context)
  }
}
