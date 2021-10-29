import schedulers from '@/main/config/schedulers'
import setupApolloServer from '@/main/graphql/config/apollo-server'

import engine from './engine'
import middlewares from './middlewares'
import routes from './routes'

import express, { Express } from 'express'

class SetupApp {
  private static instance: SetupApp
  private cache: any

  private constructor () {}

  public static getInstance (): SetupApp {
    if (!SetupApp.instance) {
      SetupApp.instance = new SetupApp()
    }

    return SetupApp.instance
  }

  public async setup (): Promise<Express> {
    if (this.cache) return this.cache

    const app = express()

    middlewares(app)
    await setupApolloServer(app)
    engine(app)
    routes(app)
    schedulers()

    this.cache = app

    return app
  }
}

export const setupApp = SetupApp.getInstance().setup.bind(SetupApp)
