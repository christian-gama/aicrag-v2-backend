/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeFindAllTasksController } from '@/factories/controllers/task'

export const resolver: Resolvers = {
  Query: {
    findAllTasks: async (_, args, context) =>
      await resolverAdapter(makeFindAllTasksController(), args, context)
  }
}
