import Task from "../entity/Task"
import TaskRepository from "../port/ITaskRepository"

export default class FindAllTasksHighUseCase {
  constructor(readonly taskRepository: TaskRepository) {}

  async execute(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void> {
    await this.taskRepository.findAllTasksHigh(callback)
  }
}