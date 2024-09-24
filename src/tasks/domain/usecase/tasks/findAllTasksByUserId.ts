import Task from "../../entity/Task";
import ITaskRepository from "../../port/repository/ITaskRepository";

export default class FindAllTasksByUserIdUseCase {
  constructor(readonly taskRepository: ITaskRepository) {}

  async execute(
    userId: number,
    callback: (err: Error | null, tasks?: Task[] | null) => void
  ): Promise<void> {
    await this.taskRepository.findAllTasksByUserId(userId, callback);
  }
}
