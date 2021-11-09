import { makeUserDataLoader } from './data-loaders'

export const context = async ({ req, res }): Promise<Record<string, any>> => {
  const userDataLoader = makeUserDataLoader()
  console.log('CONTEXT')

  return { req, res, userDataLoader }
}
