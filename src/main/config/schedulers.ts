import { makeClearUserDatabase } from '../factories/schedulers/clear-user-database-factory'

export default (): void => {
  const clearUserDatabase = makeClearUserDatabase()

  setInterval(async () => {
    await clearUserDatabase.deleteInactiveUsers()
  }, 3000)
}
