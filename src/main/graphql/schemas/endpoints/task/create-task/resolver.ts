/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { apolloControllerAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'
import { isProtected } from '@/main/graphql/utils'

import { makeUpdateTaskController } from '@/factories/controllers/task'

export const resolver: Resolvers = {
  Mutation: {
    updateTask: async (_, args, context) => {
      isProtected(context)

      const response = await apolloControllerAdapter(makeUpdateTaskController(), args, context)

      return response
    }
  }
}
