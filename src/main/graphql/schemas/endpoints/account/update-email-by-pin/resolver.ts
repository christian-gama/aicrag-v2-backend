/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeUpdateEmailByPinController } from '@/main/factories/controllers/account'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Mutation: {
    updateEmailByPin: async (_, args, context) => await resolverAdapter(makeUpdateEmailByPinController(), args, context)
  }
}
