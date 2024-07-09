import Task from "../entity/Task";
import TaskRepository from "../port/ITaskRepository";

export default class DeleteTaskUseCase {
  constructor(readonly taskRepository: TaskRepository) {}

  async execute(id: number, callback: (err: Error | null, isAproved?: boolean) => void): Promise<void> {
    await this.taskRepository.delete(id, callback)
  }
}