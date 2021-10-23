/* eslint-disable @typescript-eslint/no-var-requires */
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import fs from 'fs'
import glob from 'glob'
import { GraphQLSchema } from 'graphql'
import { typeDefs as scalarTypeDefs, resolvers as scalarResolvers } from 'graphql-scalars'
import path from 'path'

export const createGraphqlSchema = (): GraphQLSchema => {
  const srcPath = path.join(__dirname, '../../../')

  fs.writeFileSync('graphql-schema.txt', '', { encoding: 'utf8' })

  const graphqlTypes = glob
    .sync(`${srcPath}/**/*.graphql`)
    .map((content: any) => fs.readFileSync(content, { encoding: 'utf8' }))

  const graphqlResolvers = glob.sync(`${srcPath}/**/resolver.?s`).map((resolver: any) => require(resolver).resolver)

  const typeDefs = mergeTypeDefs(graphqlTypes)
  const resolvers = mergeResolvers(graphqlResolvers)

  return makeExecutableSchema({
    resolvers: { ...scalarResolvers, ...resolvers },
    typeDefs: [...scalarTypeDefs, typeDefs]
  })
}
