import Task from "../entity/Task"
import TaskRepository from "../port/ITaskRepository"

export default class UpdateTaskDescriptionUseCase {
  constructor(readonly taskRepository: TaskRepository) {}

  async execute(id: number, description: string, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
    await this.taskRepository.updateTaskDescription(id, description, callback)
  }
}