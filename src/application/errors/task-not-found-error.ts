export class TaskNotFoundError extends Error {
  constructor () {
    super('Não foi possível encontrar tarefas')
    this.name = 'TaskNotFoundError'
  }
}
