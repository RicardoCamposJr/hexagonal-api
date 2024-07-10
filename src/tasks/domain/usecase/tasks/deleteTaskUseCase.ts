import Task from "../../entity/Task";
import ITaskRepository from "../../port/ITaskRepository";

export default class DeleteTaskUseCase {
  constructor(readonly taskRepository: ITaskRepository) {}

  async execute(id: number, callback: (err: Error | null, isAproved?: boolean) => void): Promise<void> {
    await this.taskRepository.delete(id, callback)
  }
}