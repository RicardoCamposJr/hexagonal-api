import Task from "../../entity/Task";
import ITaskRepository from "../../port/repository/ITaskRepository";

export default class DeleteTaskUseCase {
  constructor(readonly taskRepository: ITaskRepository) {}

  async execute(
    taskId: number,
    userId: number,
    callback: (err: Error | null, isAproved?: boolean) => void
  ): Promise<void> {
    await this.taskRepository.delete(taskId, userId, callback);
  }
}
