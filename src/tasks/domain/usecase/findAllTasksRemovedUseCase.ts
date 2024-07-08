import Task from "../entity/Task"
import TaskRepository from "../port/TaskRepository"

export default class FindAllTasksRemovedUseCase {
  constructor(readonly taskRepository: TaskRepository) {}

  async execute(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void> {
    await this.taskRepository.findAllTasksRemoved(callback)
  }
}