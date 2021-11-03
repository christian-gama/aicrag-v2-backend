/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeDeleteTaskController } from '@/main/factories/controllers/task'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Mutation: {
    deleteTask: async (_, args, context) => await resolverAdapter(makeDeleteTaskController(), args, context)
  }
}
