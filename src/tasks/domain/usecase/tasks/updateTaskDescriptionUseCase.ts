import Task from "../../entity/Task"
import ITaskRepository from "../../port/repository/ITaskRepository"

export default class UpdateTaskDescriptionUseCase {
  constructor(readonly taskRepository: ITaskRepository) {}

  async execute(id: number, description: string, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
    await this.taskRepository.updateTaskDescription(id, description, callback)
  }
}