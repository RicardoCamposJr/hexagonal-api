import IProjectRepository from "../../port/repository/IProjectRepository";
import Project from "../../entity/Project";

export default class UpdateProjectDetailsUseCase {
	constructor(readonly projectRepository: IProjectRepository) {}

	async execute(
		userId: number,
		projectId: number,
		callback: (err: Error | null, project?: Project | null) => void,
		name?: string,
		description?: string,
	): Promise<void> {
		await this.projectRepository.updateProjectDetails(userId, projectId, callback, name, description);
	}
}
