/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { apolloControllerAdapter, apolloErrorAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'

import { makeCreateTaskController } from '@/factories/controllers/task'

export const resolver: Resolvers = {
  Mutation: {
    createTask: async (_, args, context) => {
      if (context.isAuthenticated !== true) {
        throw apolloErrorAdapter(context.isAuthenticated, 401, 'UnauthorizedError')
      }

      const response = await apolloControllerAdapter(makeCreateTaskController(), args, context)

      return response
    }
  }
}
