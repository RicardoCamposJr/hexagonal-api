import Task from "../../entity/Task"
import ITaskRepository from "../../port/ITaskRepository"
import TaskRepository from "../../port/ITaskRepository"

export default class RegisterTaskUseCase {
  constructor(readonly taskRepository: ITaskRepository) {}

  async execute(task: Task, callback: (err: Error | null, task?: Task) => void): Promise<void> {
    await this.taskRepository.save(task, callback)
  }
}