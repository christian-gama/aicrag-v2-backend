/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeDeleteUserController } from '@/main/factories/controllers/dashboard/users/delete-user-controller-factory'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Mutation: {
    deleteUser: async (_, args, context) => await resolverAdapter(makeDeleteUserController(), args, context)
  }
}
