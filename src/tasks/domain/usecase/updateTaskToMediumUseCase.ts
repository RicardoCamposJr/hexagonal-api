import Task from "../entity/Task"
import TaskRepository from "../port/TaskRepository"

export default class UpdateTaskToMediumUseCase {
  constructor(readonly taskRepository: TaskRepository) {}

  async execute(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
    await this.taskRepository.updateTaskToMedium(id, callback)
  }
}