import Task from "../../entity/Task";
import ITaskRepository from "../../port/repository/ITaskRepository";

export default class UpdateTaskToLowUseCase {
	constructor(readonly taskRepository: ITaskRepository) {}

	async execute(taskId: number, userId: number, callback: (err: Error | null, task?: Task | null) => void): Promise<void> {
		await this.taskRepository.updateTaskToLow(taskId, userId, callback);
	}
}
