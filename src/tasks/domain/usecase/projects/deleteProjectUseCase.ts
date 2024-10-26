import IProjectRepository from "../../port/repository/IProjectRepository";

export default class DeleteProjectUseCase {
	constructor(readonly projectRepository: IProjectRepository) {}

	async execute(userId: number, projectId: number, callback: (err: Error | null, isDeleted?: boolean) => void): Promise<void> {
		await this.projectRepository.delete(userId, projectId, callback);
	}
}
