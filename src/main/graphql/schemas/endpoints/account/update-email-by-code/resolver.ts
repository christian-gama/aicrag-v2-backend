/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeUpdateEmailByCodeController } from '@/factories/controllers/account'

export const resolver: Resolvers = {
  Mutation: {
    updateEmailByCode: async (_, args, context) =>
      await resolverAdapter(makeUpdateEmailByCodeController(), args, context)
  }
}
