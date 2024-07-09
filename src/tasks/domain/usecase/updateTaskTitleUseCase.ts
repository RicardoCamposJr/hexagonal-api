import Task from "../entity/Task"
import TaskRepository from "../port/ITaskRepository"

export default class UpdateTaskTitleUseCase {
  constructor(readonly taskRepository: TaskRepository) {}

  async execute(id: number, title: string, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
    await this.taskRepository.updateTaskTitle(id, title, callback)
  }
}