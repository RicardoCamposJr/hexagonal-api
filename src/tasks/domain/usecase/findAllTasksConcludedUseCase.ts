import Task from "../entity/Task"
import TaskRepository from "../port/TaskRepository"

export default class FindAllTasksConcludedUseCase {
  constructor(readonly taskRepository: TaskRepository) {}

  async execute(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void> {
    await this.taskRepository.findAllTasksConcluded(callback)
  }
}