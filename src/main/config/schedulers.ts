import { makeClearUserDatabase } from '../factories/schedulers/clear-user-database-factory'

export default (): void => {
  if (process.env.NODE_ENV !== 'test') {
    const clearUserDatabase = makeClearUserDatabase()

    setInterval(async () => {
      await clearUserDatabase.deleteInactiveUsers()
    }, 12 * 60 * 60 * 1000)
  }
}
