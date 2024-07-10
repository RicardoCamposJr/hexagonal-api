import Task from "../../entity/Task"
import ITaskRepository from "../../port/ITaskRepository"
import TaskRepository from "../../port/ITaskRepository"

export default class FindAllTasksMediumUseCase {
  constructor(readonly taskRepository: ITaskRepository) {}

  async execute(callback: (err: Error | null, tasks?: Task[]) => void): Promise<void> {
    await this.taskRepository.findAllTasksMedium(callback)
  }
}