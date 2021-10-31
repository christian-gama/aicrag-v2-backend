import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  Task: {
    __isTypeOf: (obj) => {
      return obj.id !== undefined
    },
    commentary: ({ commentary }) => {
      return commentary
    },
    date: ({ date }) => {
      return date
    },
    duration: ({ duration }) => {
      return duration
    },
    id: ({ id }) => {
      return id
    },
    logs: ({ logs }) => {
      return logs
    },
    status: ({ status }) => {
      return status
    },
    taskId: ({ taskId }) => {
      return taskId
    },
    type: ({ type }) => {
      return type
    },
    usd: ({ usd }) => {
      return usd
    },
    user: async ({ user }, _, { userDataLoader }) => {
      const loadedUser = await userDataLoader.load(user as any)

      return {
        __typename: 'PublicUser',
        personal: {
          email: loadedUser.personal.email,
          id: loadedUser.personal.id,
          name: loadedUser.personal.name
        },
        settings: {
          currency: loadedUser.settings.currency
        }
      }
    }
  }
}
