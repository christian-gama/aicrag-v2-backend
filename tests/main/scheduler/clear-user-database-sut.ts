import { ClearUserDatabase } from '@/main/scheduler/clear-user-database'

interface SutTypes {
  sut: ClearUserDatabase
}

export const makeSut = (): SutTypes => {
  const sut = new ClearUserDatabase()

  return { sut }
}
