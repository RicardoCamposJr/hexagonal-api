import Task from "../entity/Task"
import TaskRepository from "../port/ITaskRepository"

export default class RegisterTaskUseCase {
  constructor(readonly taskRepository: TaskRepository) {}

  async execute(task: Task, callback: (err: Error | null, task?: Task) => void): Promise<void> {
    await this.taskRepository.save(task, callback)
  }
}