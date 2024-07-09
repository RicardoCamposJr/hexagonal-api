import Task from "../entity/Task"
import TaskRepository from "../port/ITaskRepository"

export default class FindAllTasksUseCase {
  constructor(readonly taskRepository: TaskRepository) {}

  async execute(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void> {
    await this.taskRepository.findAll(callback)
  }
}