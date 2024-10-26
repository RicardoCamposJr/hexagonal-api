import IProjectRepository from "../../port/repository/IProjectRepository";

export default class FindAllTasksByProjectIdUseCase {
	constructor(readonly projectRepository: IProjectRepository) {}

	async execute(
		userId: number,
		projectId: number,
		callback: (err: Error | null, tasks?: Array<{ taskId: number; title: string; status: string }>) => void,
	): Promise<void> {
		await this.projectRepository.findAllTasksByProjectId(userId, projectId, callback);
	}
}
