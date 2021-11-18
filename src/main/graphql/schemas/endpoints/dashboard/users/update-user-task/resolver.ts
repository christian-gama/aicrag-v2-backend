/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeUpdateUserTaskController } from '@/main/factories/controllers/dashboard/users'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Mutation: {
    updateUserTask: async (_, args, context) => await resolverAdapter(makeUpdateUserTaskController(), args, context)
  }
}
