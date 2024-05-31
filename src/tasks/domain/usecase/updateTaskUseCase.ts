import Task from "../entity/Task"
import TaskRepository from "../port/TaskRepository"

export default class UpdateTaskUseCase {
  constructor(readonly taskRepository: TaskRepository) {}

  async execute(task: Task, callback: (err: Error | null, task?: Task) => void): Promise<void> {
    await this.taskRepository.update(task, callback)
  }
}