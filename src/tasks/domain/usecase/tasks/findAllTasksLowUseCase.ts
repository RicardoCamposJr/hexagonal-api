import Task from "../../entity/Task"
import ITaskRepository from "../../port/ITaskRepository"
import TaskRepository from "../../port/ITaskRepository"

export default class FindAllTasksLowUseCase {
  constructor(readonly taskRepository: ITaskRepository) {}

  async execute(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void> {
    await this.taskRepository.findAllTasksLow(callback)
  }
}