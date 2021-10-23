/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeDeleteTaskController } from '@/factories/controllers/task'

export const resolver: Resolvers = {
  Mutation: {
    deleteTask: async (_, args, context) => await resolverAdapter(makeDeleteTaskController(), args, context)
  }
}
