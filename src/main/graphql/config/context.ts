import { makeUserDataLoader } from './data-loaders'

export const context = async ({ req, res }): Promise<Record<string, any>> => {
  const userDataLoader = makeUserDataLoader()

  return { req, res, userDataLoader }
}
