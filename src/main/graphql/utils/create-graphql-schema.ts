/* eslint-disable @typescript-eslint/no-var-requires */
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import fs from 'fs'
import glob from 'glob'
import { GraphQLSchema } from 'graphql'
import path from 'path'

export const createGraphqlSchema = (): GraphQLSchema => {
  const srcPath = path.join(__dirname, '../../../')

  fs.writeFileSync('graphql-schema.txt', '', { encoding: 'utf8' })

  const graphqlTypes = glob.sync(`${srcPath}/**/*.graphql`).map((x: any) => {
    const content = fs.readFileSync(x, { encoding: 'utf8' })

    fs.appendFileSync('graphql-schema.txt', content, { encoding: 'utf8' })

    return content
  })

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
