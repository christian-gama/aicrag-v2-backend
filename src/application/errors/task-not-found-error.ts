export class TaskNotFoundError extends Error {
  constructor () {
    super('No tasks were found')
    this.name = 'TaskNotFoundError'
  }
}
