import IProjectRepository from "../../port/repository/IProjectRepository";

export default class AddUserToProjectUseCase {
	constructor(readonly projectRepository: IProjectRepository) {}

	async execute(userId: number, projectId: number, newUserId: number, callback: (err: Error | null, isAdded?: boolean) => void): Promise<void> {
		await this.projectRepository.addUserToProject(userId, projectId, newUserId, callback);
	}
}
