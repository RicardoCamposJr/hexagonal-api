import Task from "../../entity/Task";
import ITaskRepository from "../../port/repository/ITaskRepository";

export default class FindAllTasksHighUseCase {
	constructor(readonly taskRepository: ITaskRepository) {}

	async execute(userId: number, callback: (err: Error | null, tasks?: Task[]) => void): Promise<void> {
		await this.taskRepository.findAllTasksHigh(userId, callback);
	}
}
