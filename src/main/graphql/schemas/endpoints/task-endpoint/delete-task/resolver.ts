/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { apolloControllerAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'
import { isProtected } from '@/main/graphql/utils'

import { makeDeleteTaskController } from '@/factories/controllers/task'

export const resolver: Resolvers = {
  Mutation: {
    deleteTask: async (_, args, context) => {
      isProtected(context)

      const response = await apolloControllerAdapter(makeDeleteTaskController(), args, context)

      return response
    }
  }
}
