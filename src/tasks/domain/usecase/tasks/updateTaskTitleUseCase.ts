import Task from "../../entity/Task"
import ITaskRepository from "../../port/ITaskRepository"
import TaskRepository from "../../port/ITaskRepository"

export default class UpdateTaskTitleUseCase {
  constructor(readonly taskRepository: ITaskRepository) {}

  async execute(id: number, title: string, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
    await this.taskRepository.updateTaskTitle(id, title, callback)
  }
}