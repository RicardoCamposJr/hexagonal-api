import Task from "../entity/Task"
import TaskRepository from "../port/ITaskRepository"

export default class FindByTaskIdTasksUseCase {
  constructor(readonly taskRepository: TaskRepository) {}

  async execute(id: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
    await this.taskRepository.findById(id, callback)
  }
}