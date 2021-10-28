/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeUpdateEmailByPinController } from '@/factories/controllers/account'

export const resolver: Resolvers = {
  Mutation: {
    updateEmailByPin: async (_, args, context) => await resolverAdapter(makeUpdateEmailByPinController(), args, context)
  }
}
