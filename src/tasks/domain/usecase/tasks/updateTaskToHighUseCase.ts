import Task from "../../entity/Task"
import ITaskRepository from "../../port/ITaskRepository"
import TaskRepository from "../../port/ITaskRepository"

export default class UpdateTaskToHighUseCase {
  constructor(readonly taskRepository: ITaskRepository) {}

  async execute(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
    await this.taskRepository.updateTaskToHigh(id, callback)
  }
}