/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeSendEmailCodeController } from '@/factories/controllers/mailer'

export const resolver: Resolvers = {
  Mutation: {
    sendEmailCode: async (_, args, context) =>
      await resolverAdapter(makeSendEmailCodeController(), args, context)
  }
}
