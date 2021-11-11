/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeFindAllUsersController } from '@/main/factories/controllers/dashboard/users'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Query: {
    findAllUsers: async (_, args, context) => await resolverAdapter(makeFindAllUsersController(), args, context)
  }
}
