/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { makeFindAllUserTasksController } from '@/main/factories/controllers/dashboard/users'
import { resolverAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Query: {
    findAllUserTasks: async (_, args, context) => await resolverAdapter(makeFindAllUserTasksController(), args, context)
  }
}
