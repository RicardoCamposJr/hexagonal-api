import Task from "../../entity/Task";
import ITaskRepository from "../../port/repository/ITaskRepository";

export default class UpdateTaskToConcludedUseCase {
  constructor(readonly taskRepository: ITaskRepository) {}

  async execute(
    id: number,
    callback: (err: Error | null, task?: Task | null) => void
  ): Promise<void> {
    await this.taskRepository.updateTaskToConcluded(id, callback);
  }
}
