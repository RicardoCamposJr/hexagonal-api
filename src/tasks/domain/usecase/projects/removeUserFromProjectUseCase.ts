import IProjectRepository from "../../port/repository/IProjectRepository";

export default class RemoveUserFromProjectUseCase {
	constructor(readonly projectRepository: IProjectRepository) {}

	async execute(userId: number, projectId: number, removeUserId: number, callback: (err: Error | null, isRemoved?: boolean) => void): Promise<void> {
		await this.projectRepository.removeUserFromProject(userId, projectId, removeUserId, callback);
	}
}
