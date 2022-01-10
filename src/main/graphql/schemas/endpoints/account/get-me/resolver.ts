/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeGetMeController } from '@/main/factories/controllers/account/get-me-controller-factory'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Query: {
    getMe: async (_, args, context) => await resolverAdapter(makeGetMeController(), args, context)
  }
}
