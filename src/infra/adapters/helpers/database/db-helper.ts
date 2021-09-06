import { MongoClient } from 'mongodb'
import { DbHelperProtocol } from './protocols/db-helper-protocol'

export class DbHelper implements DbHelperProtocol {
  private client: MongoClient | null

  async connect (url: string): Promise<void> {
    this.client = this.client ?? (await MongoClient.connect(url))
  }

  async disconnect (): Promise<void> {
    await this.client?.close()

    this.client = null
  }
}
