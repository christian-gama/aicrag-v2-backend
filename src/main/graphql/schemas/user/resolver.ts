/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Resolvers } from '@/main/graphql/generated'

export const resolver: Resolvers = {
  FullUser: {
    __isTypeOf: (obj) => {
      return typeof obj.user.logs !== 'undefined'
    },
    user: ({ user }) => {
      return user
    }
  },
  FullUserProps: {
    __isTypeOf: (obj) => {
      return typeof obj.logs !== 'undefined'
    },
    logs: ({ logs }) => {
      return logs
    },
    personal: ({ personal }) => {
      return personal
    },
    settings: ({ settings }) => {
      return settings
    },
    temporary: ({ temporary }) => {
      return temporary
    },
    tokenVersion: ({ tokenVersion }) => {
      return tokenVersion
    }
  },
  PublicUser: {
    __isTypeOf: (obj) => {
      return typeof (obj as any).user.logs === 'undefined'
    },
    user: ({ user }) => {
      return user
    }
  },
  PublicUserProps: {
    __isTypeOf: (obj) => {
      return typeof (obj as any).logs === 'undefined'
    },
    personal: ({ personal }) => {
      return personal
    },
    settings: ({ settings }) => {
      return settings
    }
  }
}
