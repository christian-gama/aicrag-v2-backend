/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeCreateTaskController } from '@/factories/controllers/task'

export const resolver: Resolvers = {
  Mutation: {
    createTask: async (_, args, context) =>
      await resolverAdapter(makeCreateTaskController(), args, context)
  }
}
