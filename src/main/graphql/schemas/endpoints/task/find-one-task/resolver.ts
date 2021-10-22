/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { apolloControllerAdapter } from '@/main/graphql/adapters'
import { Resolvers } from '@/main/graphql/generated'
import { isProtected } from '@/main/graphql/utils'

import { makeFindOneTaskController } from '@/factories/controllers/task'

export const resolver: Resolvers = {
  Query: {
    findOneTask: async (_, args, context) => {
      isProtected(context)

      const response = await apolloControllerAdapter(makeFindOneTaskController(), args, context)

      return response.data
    }
  }
}
