import schedulers from '@/main/config/schedulers'
import setupApolloServer from '@/main/graphql/config/apollo-server'
import engine from './engine'
import middlewares from './middlewares'
import routes from './routes'
import express, { Express } from 'express'

class App {
  private static instance: App
  private cache: any

  private constructor () {}

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

  static getInstance (): App {
    if (!App.instance) {
      App.instance = new App()
    }

    return App.instance
  }
}

export default App.getInstance()
