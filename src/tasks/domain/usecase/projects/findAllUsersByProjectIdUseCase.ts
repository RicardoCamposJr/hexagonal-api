import IProjectRepository from "../../port/repository/IProjectRepository";

export default class FindAllUsersByProjectIdUseCase {
	constructor(readonly projectRepository: IProjectRepository) {}

	async execute(
		userId: number,
		projectId: number,
		callback: (err: Error | null, users?: Array<{ userId: number; username: string }>) => void,
	): Promise<void> {
		await this.projectRepository.findAllUsersByProjectId(userId, projectId, callback);
	}
}
