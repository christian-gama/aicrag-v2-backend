/* eslint-disable @typescript-eslint/no-var-requires */
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import fs from 'fs'
import glob from 'glob'
import { GraphQLSchema } from 'graphql'
import path from 'path'

export const createGraphqlSchema = (): GraphQLSchema => {
  const srcPath = path.join(__dirname, '../../../')

  const graphqlTypes = glob
    .sync(`${srcPath}/**/*.graphql`)
    .map((x: any) => fs.readFileSync(x, { encoding: 'utf8' }))

  const _resolvers = glob
    .sync(`${srcPath}/**/resolver.?s`)
    .map((resolver: any) => require(resolver).resolver)

  const typeDefs = mergeTypeDefs(graphqlTypes)
  const resolvers = mergeResolvers(_resolvers)

  return makeExecutableSchema({
    resolvers,
    typeDefs
  })
}
