import Task from "../entity/Task";
import TaskRepository from "../port/TaskRepository";

export default class DeleteTaskUseCase {
  constructor(readonly taskRepository: TaskRepository) {}

  async execute(id: number, callback: (err: Error | null) => void): Promise<void> {
    await this.taskRepository.delete(id, callback)
  }
}