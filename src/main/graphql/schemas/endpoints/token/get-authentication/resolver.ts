/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeGetAuthenticationController } from '@/main/factories/controllers/token/get-authentication-controller-factory'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Query: {
    getAuthentication: async (_, args, context) =>
      await resolverAdapter(makeGetAuthenticationController(), args, context)
  }
}
